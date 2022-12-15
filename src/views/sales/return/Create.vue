<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/return"
        class="breadcrumb-item"
      >
        {{ $t('sales return') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('sales return ') | uppercase }}</h4>
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
                      {{ $t('reference') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectSalesInvoice.open()"
                      >
                        <template v-if="salesInvoice && salesInvoice.form.number != null">
                          {{ salesInvoice.form.number }}
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
                    {{ $t('to') | uppercase }}: <span>{{ form.customer_name | uppercase }}</span>
                  </h6>
                  {{ form.customer_address | uppercase }} <br v-if="form.customer_address">
                  {{ form.customer_phone }} <br v-if="form.customer_phone">
                </div>
              </div>
            </div>
            <hr>
            <point-table v-if="form.sales_invoice_id">
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th>Allocation</th>
                <th>Quantity Sales</th>
                <th>Quantity Return</th>
                <th>Price Sales</th>
                <th>Total</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    {{ row.item_name || $t('select') | uppercase }}
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.allocation.open(index)"
                    >
                      {{ row.allocation_name || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'quantity' + index"
                      v-model="row.quantity_sales"
                      :name="'quantity' + index"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      disabled
                      readonly
                    />
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'quantity-return' + index"
                      v-model="row.quantity"
                      :name="'quantity-return' + index"
                      :max="Number(row.quantity_sales)"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'price' + index"
                      v-model.number="row.price_sales"
                      :name="'price' + index"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'total-' + index"
                      :name="'total-' + index"
                      :readonly="true"
                      :value="row.quantity * row.price_sales"
                    />
                  </td>
                </tr>
              </template>
            </point-table>

            <div
              v-if="form.sales_invoice_id"
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
                  id="sub_total"
                  name="sub_total"
                  :label="$t('sub total')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'sub_total'"
                      :name="'sub_total'"
                      :readonly="true"
                      :value="sub_total"
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
                  :label="$t('tax method')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    {{ form.type_of_tax + ' tax' | uppercase }}
                  </div>
                </p-form-row>
                <p-form-row
                  id="tax_amount"
                  name="tax_amount"
                  :label="$t('tax amount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'tax_amount'"
                      :name="'tax_amount'"
                      :readonly="true"
                      :value="tax_amount"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="amount"
                  name="amount"
                  :label="$t('amount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'amount'"
                      :name="'amount'"
                      :readonly="true"
                      :value="amount"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr v-if="form.sales_invoice_id">
            <div
              v-if="form.sales_invoice_id"
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
    <m-user
      ref="approver"
      permission="approve sales return"
      @choosen="chooseApprover"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <select-sales-invoice
      ref="selectSalesInvoice"
      @choosen="chooseSalesInvoice"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectSalesInvoice from './SelectSalesInvoice'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    SelectSalesInvoice,
    PointTable
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      salesInvoice: null,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        sales_invoice_id: null,
        warehouse_id: null,
        customer_id: null,
        customer_code: null,
        customer_name: null,
        customer_address: null,
        customer_phone: null,
        customer_email: null,
        notes: null,
        type_of_tax: null,
        sub_total: null,
        tax_base: null,
        tax: null,
        amount: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    sub_total () {
      return this.form.items.reduce((carry, item) => {
        return carry + item.quantity * item.price_sales
      }, 0)
    },
    tax_base () {
      return this.sub_total
    },
    tax_amount () {
      let value = 0
      if (this.form.type_of_tax == 'include') {
        value = this.tax_base - (this.tax_base * 10 / 110)
      } else if (this.form.type_of_tax == 'exclude') {
        value = this.tax_base * (10 / 110)
      }
      return value
    },
    amount () {
      if (this.form.type_of_tax == 'include') {
        return this.tax_base
      } else {
        return this.tax_base + this.tax_amount
      }
    }
  },
  methods: {
    ...mapActions('salesReturn', ['create']),
    ...mapActions('salesReturnApproval', ['send']),
    chooseSalesInvoice (salesInvoice) {
      this.salesInvoice = salesInvoice
      this.form.sales_invoice_id = salesInvoice.id
      this.form.warehouse_id = salesInvoice.salesDeliveryNote.warehouseId
      this.form.customer_id = salesInvoice.customerId
      this.form.customer_code = salesInvoice.customerCode
      this.form.customer_name = salesInvoice.customerName
      this.form.type_of_tax = salesInvoice.typeOfTax
      this.form.items = salesInvoice.items.map(item => {
        return {
          sales_invoice_item_id: item.id,
          item_id: item.itemId,
          item_name: item.itemName,
          item_label: item.itemName,
          more: false,
          units: item.units,
          unit: item.unit_smallest || item.unit,
          converter: item.converter_smallest || item.converter,
          expiry_date: item.expiryDate,
          production_number: item.productionNumber,
          quantity_sales: item.quantity - item.quantityReturned,
          quantity: 0,
          price: item.price,
          price_sales: item.price - item.discountValue,
          discount_percent: item.discountPercent,
          discount_value: item.discountValue,
          total: 0 * (item.price - item.discountValue),
          allocation_id: item.allocation_id,
          allocation_name: item.allocation_name,
          notes: item.notes
        }
      })
    },
    chooseAllocation (allocation) {
      const row = this.form.items[allocation.index]
      row.allocation_id = allocation.id
      row.allocation_name = allocation.name
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.notes) {
        if (this.form.notes.length > 255) {
          this.$notification.error('notes cannot be more than 255 character')
          this.isSaving = false
          this.form.errors.record({
            notes: ['notes cannot be more than 255 character']
          })
          return
        }

        if (this.form.notes.charAt(0) === ' ' || this.form.notes.charAt(this.form.notes.length - 1) === ' ') {
          this.$notification.error('notes cannot start or end with space')
          this.isSaving = false
          this.form.errors.record({
            notes: ['notes cannot start or end with space']
          })
          return
        }
      }
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.sub_total = this.sub_total
      this.form.tax_base = this.tax_base
      this.form.amount = this.amount
      this.form.tax = this.tax_amount
      this.form.items = this.form.items.filter(item => {
        if (item.quantity > 0) {
          item.total = item.quantity * (item.price - item.discount_value)
          return item
        }
      })
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/sales/return/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
