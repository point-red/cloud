<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        :to="{ name: 'purchase.order.index' }"
        class="breadcrumb-item"
      >
        {{ $t('purchase order') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'purchase.order.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ purchaseOrder.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('purchase order') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('form number') | uppercase }}
                    </td>
                    <td>
                      {{ purchaseOrder.form.number }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('date') | uppercase }}
                    </td>
                    <td>
                      {{ purchaseOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('purchase request') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectPurchaseRequest.open()"
                      >
                        <template v-if="purchaseRequest && purchaseRequest.form.number != null">
                          {{ purchaseRequest.form.number }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-sm-6 text-right">
                <div class="mb-30">
                  <h6 class="mb-0">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  <template v-if="authUser.branch">
                    {{ authUser.branch.address | uppercase }} <br v-if="authUser.branch.address">
                    {{ authUser.branch.phone | uppercase }} <br v-if="authUser.branch.phone">
                  </template>
                </div>
                <div>
                  <h6 class="mb-0">
                    {{ $t('to') | uppercase }}: <span
                      class="select-link"
                      @click="$refs.supplier.open()"
                    >{{ form.supplier_label || $t('select') | uppercase }}</span>
                  </h6>
                  <div v-if="form.supplier_address">
                    <i class="fa fa-home fa-fw" /> {{ form.supplier_address | uppercase }}
                  </div>
                  <div v-if="form.supplier_phone">
                    <i class="fa fa-phone fa-fw" /> {{ form.supplier_phone | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
                <th>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="toggleMore()"
                  >
                    <i class="fa fa-ellipsis-h" />
                  </button>
                </th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.item.open(index)"
                    >
                      {{ row.item_label || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      v-model="row.quantity"
                      :name="'quantity' + index"
                      :disabled="row.item_id == null"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      @choosen="chooseUnit($event, row)"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'price' + index"
                      v-model.number="row.price"
                      :name="'price' + index"
                      :readonly="row.item_id == null"
                    />
                  </td>
                  <td>
                    <p-discount
                      :id="'discount' + index"
                      :name="'discount' + index"
                      :readonly="row.item_id == null"
                      :base-value="row.price"
                      :discount-percent.sync="row.discount_percent"
                      :discount-value.sync="row.discount_value"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'total-' + index"
                      :name="'total-' + index"
                      :readonly="true"
                      :value="row.quantity * (row.price - row.discount_value)"
                    />
                  </td>
                  <td>
                    <button
                      v-if="!isSaving"
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="row.more = !row.more"
                    >
                      <i class="fa fa-ellipsis-h" />
                    </button>
                  </td>
                </tr>
                <template v-if="row.more && row.item_id">
                  <tr
                    slot="p-body"
                    :key="'ext-'+index"
                    class="bg-gray-light"
                  >
                    <th class="bg-gray-light" />
                    <td colspan="4">
                      <p-form-row
                        id="allocation"
                        name="allocation"
                        :label="$t('allocation')"
                      >
                        <div
                          slot="body"
                          class="col-lg-9 mt-5"
                        >
                          <span
                            class="select-link"
                            @click="$refs.allocation.open(index)"
                          >
                            {{ row.allocation_name || $t('select') | uppercase }}
                          </span>
                        </div>
                      </p-form-row>
                    </td>
                    <td />
                    <td />
                  </tr>
                  <tr
                    slot="p-body"
                    :key="'ext-'+index"
                    class="bg-gray-light"
                  >
                    <th class="bg-gray-light" />
                    <td colspan="4">
                      <p-form-row
                        id="notes"
                        v-model="row.notes"
                        name="notes"
                        :label="$t('notes')"
                      />
                    </td>
                    <td />
                    <td />
                  </tr>
                </template>
              </template>
              <tr slot="p-body">
                <th />
                <td />
                <td />
                <td />
                <td />
                <td>
                  <p-form-number
                    :id="'subtotal'"
                    :name="'subtotal'"
                    :readonly="true"
                    :value="subtotal"
                  />
                </td>
              </tr>
            </point-table>

            <div class="row">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="14"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>
              <div class="col-sm-6">
                <p-form-row
                  id="discount"
                  name="discount"
                  :label="$t('discount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-discount
                      id="discount"
                      name="discount"
                      :base-value="subtotal"
                      :discount-percent.sync="form.discount_percent"
                      :discount-value.sync="form.discount_value"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="tax-base"
                  name="tax-base"
                  :label="$t('tax base')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'tax-base'"
                      :name="'tax-base'"
                      :readonly="true"
                      :value="tax_base"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  name="tax"
                  :label="$t('tax')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-form-check-box
                      class="mb-0"
                      style="float:left"
                      name="tax"
                      :checked="form.type_of_tax == 'include'"
                      :description="$t('include tax')"
                      @click.native="chooseTax('include')"
                    />
                    <p-form-check-box
                      name="tax"
                      :checked="form.type_of_tax == 'exclude'"
                      :description="$t('exclude tax')"
                      @click.native="chooseTax('exclude')"
                    />
                    <p-form-number
                      :id="'tax-value'"
                      :name="'tax-value'"
                      :readonly="true"
                      :value="tax"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="total"
                  name="total"
                  :label="$t('total')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'total'"
                      :name="'total'"
                      :readonly="true"
                      :value="grandTotal"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-6" />
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('requested by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  {{ Date.now() | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ requestedBy | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('approved by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  _______________
                </div>
                <span
                  class="select-link"
                  @click="$refs.approver.open()"
                >{{ form.approver_name || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
              </div>

              <div class="col-sm-12">
                <hr>
                <button
                  type="submit"
                  class="btn btn-block btn-sm btn-primary"
                  :disabled="isSaving"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('update') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-supplier
      ref="supplier"
      @choosen="chooseSupplier"
    />
    <m-item
      ref="item"
      @choosen="chooseItem"
    />
    <m-user
      ref="approver"
      @choosen="chooseApprover"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <select-purchase-request
      ref="selectPurchaseRequest"
      @choosen="choosePurchaseRequest"
    />
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectPurchaseRequest from './SelectPurchaseRequest'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase,
    SelectPurchaseRequest
  },
  data () {
    return {
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      purchaseRequest: null,
      form: new Form({
        id: this.$route.params.id,
        purchase_request_id: null,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        supplier_label: null,
        supplier_address: null,
        supplier_phone: null,
        supplier_email: null,
        need_down_payment: 0,
        cash_only: false,
        notes: null,
        discount_percent: 0,
        discount_value: 0,
        tax_base: 0,
        tax: 0,
        type_of_tax: 'exclude',
        items: [],
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      })
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrder']),
    ...mapGetters('auth', ['authUser']),
    subtotal () {
      return this.form.items.reduce((carry, item) => {
        return carry + item.quantity * (item.price - item.discount_value)
      }, 0)
    },
    tax_base () {
      return this.subtotal - this.form.discount_value
    },
    tax () {
      let value = 0
      if (this.form.type_of_tax == 'include') {
        value = this.tax_base - (this.tax_base * 10 / 11)
      } else if (this.form.type_of_tax == 'exclude') {
        value = this.tax_base / 10
      }
      return value
    },
    grandTotal () {
      if (this.form.type_of_tax == 'include') {
        return this.subtotal - this.form.discount_value
      } else {
        return this.subtotal - this.form.discount_value + this.tax
      }
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.$route.params.id,
      params: {
        includes: 'form.requestApprovalTo;supplier;items.item.units;items.allocation;purchaseRequest.form'
      }
    }).then(response => {
      this.isLoading = false
      if (response.data.purchase_request) {
        this.form.purchase_request_id = response.data.purchase_request.id
      }
      this.form.date = response.data.form.date
      this.form.supplier_id = response.data.supplier_id
      this.form.supplier_name = response.data.supplier_name
      this.form.supplier_label = response.data.supplier.label
      this.form.discount_percent = response.data.discount_percent
      this.form.discount_value = response.data.discount_value
      this.form.notes = response.data.form.notes
      this.form.type_of_tax = response.data.type_of_tax
      this.form.amount = response.data.amount
      this.form.discount_value = response.data.discount_value
      this.form.discount_percent = response.data.discount_percent
      this.form.items = response.data.items
      this.form.request_approval_to = response.data.form.request_approval_to.id
      this.form.approver_name = response.data.form.request_approval_to.full_name
      this.form.approver_email = response.data.form.request_approval_to.email
      this.form.items.forEach(el => {
        el.item_label = el.item.label
        el.units = el.item.units
      })
      this.purchaseRequest = response.data.purchase_request
      this.addItemRow()
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('purchaseOrder', ['find', 'update']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        more: false,
        unit: null,
        converter: null,
        quantity: 0,
        price: 0,
        discount_percent: 0,
        discount_value: 0,
        allocation_id: null,
        allocation_name: '',
        notes: null
      })
    },
    toggleMore () {
      const isMoreActive = this.form.items.some(function (el, index) {
        return el.more === false
      })
      this.form.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    clearItem (index) {
      this.form.items.splice(index, 1)
      if (this.form.items.length === 0) {
        this.addItemRow()
      }
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    chooseSupplier (value) {
      this.form.supplier_id = value.id
      this.form.supplier_name = value.name
      this.form.supplier_label = value.label
      this.form.supplier_address = value.address
      this.form.supplier_phone = value.phone
      this.form.supplier_email = value.email
    },
    chooseItem (item) {
      if (item.id == null) {
        this.clearItem(item.index)
        return
      }

      const row = this.form.items[item.index]
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id == item.unit_default_purchase) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
      let isNeedNewRow = true
      this.form.items.forEach(element => {
        if (element.item_id == null) {
          isNeedNewRow = false
        }
      })
      if (isNeedNewRow) {
        this.addItemRow()
      }
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    chooseAllocation (allocation) {
      const row = this.form.items[allocation.index]
      row.allocation_id = allocation.id
      row.allocation_name = allocation.name
    },
    chooseTax (taxType) {
      if (taxType == this.form.type_of_tax) {
        this.form.type_of_tax = null
      } else {
        this.form.type_of_tax = taxType
      }
    },
    choosePurchaseRequest (purchaseRequest) {
      this.purchaseRequest = purchaseRequest
      this.form.purchase_request_id = purchaseRequest.id
      this.form.items = purchaseRequest.items.map(item => {
        return {
          purchase_request_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.name,
          more: false,
          unit: item.unit,
          converter: item.converter,
          quantity: item.quantity,
          price: item.price,
          discount_percent: 0,
          discount_value: 0,
          total: item.quantity * (item.price - item.discount_value),
          allocation_id: item.allocation_id,
          allocation_name: '', // TODO get alocation name
          notes: item.notes
        }
      })
      this.addItemRow()
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.subtotal = this.subtotal
      this.form.tax_base = this.tax_base
      this.form.tax = this.tax
      this.form.total = this.total
      this.form.items = this.form.items.filter(item => item.item_id)
      this.update(this.form).then(response => {
        this.isSaving = false
        this.$notification.success('update success')
        Object.assign(this.$data, this.$options.data.call(this))
        this.$router.push('/purchase/order/' + response.data.id)
      }).catch(error => {
        this.isSaving = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
