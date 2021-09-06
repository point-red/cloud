<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/invoice"
        class="breadcrumb-item"
      >
        {{ $t('purchase invoice') | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('purchase invoice') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('date') | uppercase }}
                    </td>
                    <td>
                      <p-date-picker
                        id="date"
                        v-model="form.date"
                        name="date"
                        :label="$t('date')"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('purchase order') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectPurchaseOrder.open()"
                      >
                        <template v-if="purchaseOrder && purchaseOrder.form.number != null">
                          {{ purchaseOrder.form.number }}
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
                  <h6 class="mb-0 ">
                    {{ $t('to') | uppercase }}:
                  </h6>
                  {{ form.supplier_label | uppercase }}
                  <div
                    v-if="form.supplier_phone"
                    style="font-size:12px"
                  >
                    <br v-if="form.supplier_address">{{ form.supplier_address | uppercase }}
                    <br v-if="form.supplier_phone">{{ form.supplier_phone }}
                    <br v-if="form.supplier_email">{{ form.supplier_email | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <point-table v-if="form.items.length > 0">
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
                    <!-- <span @click="$refs.item.open(index)" class="select-link"> -->
                    {{ row.item_label || $t('select') | uppercase }}
                    <!-- </span> -->
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      v-model="row.quantity"
                      :name="'quantity' + index"
                      :disabled="true"
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
                    :key="'ext1-'+index"
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
                    :key="'ext2-'+index"
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

            <div
              v-if="form.items.length > 0"
              class="row"
            >
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
                      v-model="form.discount_percent"
                      name="discount"
                      :base-value="subtotal"
                      :discount-percent.sync="form.discount_percent"
                      :discount-value.sync="form.discount_value"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="tax_base"
                  name="tax_base"
                  :label="$t('tax base')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'tax_base'"
                      :name="'tax_base'"
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
                      :id="'total'"
                      :name="'total'"
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
                      :value="total"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr>
            <div
              v-if="form.items.length > 0"
              class="row"
            >
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
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-item
      ref="item"
      @choosen="chooseItem"
    />
    <m-user
      ref="approver"
      :permission="'approve purchase invoice'"
      @choosen="chooseApprover"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <select-purchase-order
      ref="selectPurchaseOrder"
      @choosen="choosePurchaseOrder"
    />
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectPurchaseOrder from './SelectPurchaseOrder'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase,
    SelectPurchaseOrder
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      purchaseOrder: {
        form: {
          number: null
        },
        purchase_receives: []
      },
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        due_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
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
        approver_email: null,
        purchase_request_id: null
      })
    }
  },
  computed: {
    ...mapGetters('purchaseInvoice', ['purchaseInvoice']),
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
    total () {
      if (this.form.type_of_tax == 'include') {
        return this.subtotal - this.form.discount_value
      } else {
        return this.subtotal - this.form.discount_value + this.tax
      }
    }
  },
  created () {
    // this.addItemRow()
  },
  methods: {
    ...mapActions('purchaseInvoice', ['create']),
    addItemRow () {
      this.form.items.push({
        purchase_receive_item_id: null,
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
        // this.addItemRow()
      }
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
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
        this.form.type_of_tax = 'non'
      } else {
        this.form.type_of_tax = taxType
      }
    },
    choosePurchaseOrder (purchaseOrder) {
      this.form.items = []
      this.purchaseOrder = purchaseOrder
      this.form.purchase_order_id = purchaseOrder.id
      this.form.supplier_id = purchaseOrder.supplier_id
      this.form.supplier_name = purchaseOrder.supplier_name
      this.form.supplier_label = purchaseOrder.supplier_name
      this.form.supplier_address = purchaseOrder.supplier_address
      this.form.supplier_phone = purchaseOrder.supplier_phone
      this.form.supplier_email = purchaseOrder.supplier_email
      purchaseOrder.purchase_receives.forEach(purchaseReceive => {
        purchaseReceive.items.forEach(purchaseReceiveItem => {
          if (purchaseReceive.form.done == false) {
            this.form.items.push({
              purchase_receive_id: purchaseReceiveItem.purchase_receive_id,
              purchase_receive_item_id: purchaseReceiveItem.id,
              item_id: purchaseReceiveItem.item_id,
              item_name: purchaseReceiveItem.item_name,
              item_label: purchaseReceiveItem.item_name,
              more: false,
              unit: purchaseReceiveItem.unit,
              converter: purchaseReceiveItem.converter,
              quantity: purchaseReceiveItem.quantity,
              price: purchaseReceiveItem.price,
              discount_percent: purchaseReceiveItem.discount_percent,
              discount_value: purchaseReceiveItem.discount_value,
              total: purchaseReceiveItem.quantity * (purchaseReceiveItem.price - purchaseReceiveItem.discount_value),
              allocation_id: purchaseReceiveItem.allocation_id,
              allocation_name: purchaseReceiveItem.allocation_name,
              notes: purchaseReceiveItem.notes
            })
          }
        })
      })
      // this.addItemRow()
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
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/purchase/invoice/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
