<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/order"
        class="breadcrumb-item"
      >
        {{ $t('sales order') | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <sales-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('sales order') | uppercase }}</h4>
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
                      {{ $t('sales quotation') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectSalesQuotation.open()"
                      >
                        <template v-if="salesQuotation && salesQuotation.form.number != null">
                          {{ salesQuotation.form.number }}
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
                    {{ $t('to') | uppercase }}: <span
                      class="select-link"
                      @click="$refs.customers.open()"
                    >{{ form.customer_label || $t('select') | uppercase }}</span>
                  </h6>
                  {{ form.customer_address | uppercase }} <br v-if="form.customer_address">
                  {{ form.customer_phone }} <br v-if="form.customer_phone">
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
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-customer
      ref="customers"
      @choosen="chooseCustomer"
    />
    <m-item
      ref="item"
      @choosen="chooseItem"
    />
    <m-user
      ref="approver"
      permission="approve sales order"
      @choosen="chooseApprover"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <select-sales-quotation
      ref="selectSalesQuotation"
      @choosen="chooseSalesQuotation"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectSalesQuotation from './SelectSalesQuotation'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbSales,
    SelectSalesQuotation
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      salesQuotation: null,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        customer_id: null,
        customer_name: null,
        customer_label: null,
        customer_address: null,
        customer_phone: null,
        customer_email: null,
        pricing_group_id: 1,
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
        sales_quotation_id: null
      })
    }
  },
  computed: {
    ...mapGetters('salesOrder', ['salesOrder']),
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
    this.addItemRow()

    if (this.$route.query.id) {
      this.isLoading = true
      this.find({
        id: this.$route.query.id,
        params: {
          includes: 'form;customer;items.item.units.prices;items.allocation'
        }
      }).then(response => {
        this.isLoading = false
        this.form.sales_quotation_id = response.data.id
        this.form.date = response.data.form.date
        this.form.customer_id = response.data.customer_id
        this.form.customer_name = response.data.customer_name
        this.form.notes = response.data.form.notes
        this.form.items = response.data.items
        this.form.items.forEach(function (element) {
          element.sales_quotation_item_id = element.id
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  methods: {
    ...mapActions('salesOrder', ['create']),
    addItemRow () {
      this.form.items.push({
        sales_quotation_item_id: null,
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
    chooseCustomer (value) {
      this.form.customer_id = value.id
      this.form.customer_name = value.name
      this.form.customer_label = value.label
      this.form.customer_address = value.address
      this.form.customer_phone = value.phone
      this.form.customer_email = value.email
      this.form.pricing_group_id = value.pricing_group_id
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
        if (unit.id == item.unit_default_sales) {
          row.unit = unit.label
          row.converter = unit.converter
          if (unit.prices.length > 0) {
            const index = unit.prices.findIndex(x => x.id === this.form.pricing_group_id)
            row.price = parseFloat(unit.prices[index].pivot.price)
            row.discount_value = parseFloat(unit.prices[index].pivot.discount_value)
            row.discount_percent = parseFloat(unit.prices[index].pivot.discount_percent)
          }
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
      if (unit.prices && unit.prices.length > 0) {
        const index = unit.prices.findIndex(x => x.id === this.form.pricing_group_id)
        row.price = parseFloat(unit.prices[index].pivot.price)
        row.discount_value = parseFloat(unit.prices[index].pivot.discount_value)
        row.discount_percent = parseFloat(unit.prices[index].pivot.discount_percent)
      }
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
    chooseSalesQuotation (salesQuotation) {
      this.salesQuotation = salesQuotation
      this.form.sales_quotation_id = salesQuotation.id
      this.form.customer_id = salesQuotation.customer.id
      this.form.customer_name = salesQuotation.customer.name
      this.form.customer_label = salesQuotation.customer.label
      this.form.items = salesQuotation.items.map(item => {
        return {
          sales_quotation_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.name,
          more: false,
          unit: item.unit,
          converter: item.converter,
          quantity: item.quantity,
          price: item.price,
          discount_percent: item.discount_percent,
          discount_value: item.discount_value,
          total: item.quantity * (item.price - item.discount_value),
          allocation_id: item.allocation_id,
          allocation_name: item.allocation_name,
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
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/sales/order/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
