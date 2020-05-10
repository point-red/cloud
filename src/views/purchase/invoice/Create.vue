<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/invoice" class="breadcrumb-item">{{ $t('purchase invoice') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('purchase invoice')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="date"
                name="date"
                label="Date"
                v-model="form.date"
                :errors="form.errors.get('date')"
                @errors="form.errors.set('date', null)"/>
            </div>
          </p-form-row>

          <p-form-row
            id="due-date"
            name="due-date"
            :label="$t('due date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="due-date"
                name="due-date"
                label="Due Date"
                v-model="form.due_date"
                :errors="form.errors.get('due_date')"
                @errors="form.errors.set('due_date', null)"/>
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9 mt-5">
              {{ form.supplier_name }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5>Item</h5>

          <hr>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th>Notes</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
              <th style="min-width: 120px">Allocation</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-' + index"
                  :data-index="index"
                  v-model="row.item_id"
                  :label="row.item_name"
                  @choosen="chooseItem($event, row)"/>
              </td>
              <td>
                <p-form-input
                  :id="'notes-' + index"
                  :name="'notes-' + index"
                  v-model="form.items[index].notes"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.items[index].quantity"
                  :unit="form.items[index].item.units[0].label"
                  @keyup.native="calculate()"/>
              </td>
              <td>
                <p-form-number
                  :id="'price' + index"
                  :name="'price' + index"
                  v-model="form.items[index].price"
                  @keyup.native="calculate()"/>
              </td>
              <td>
                <p-discount
                  :id="'discount' + index"
                  :name="'discount' + index"
                  v-model="form.items[index].discount_percent"
                  @keyup.native="calculate()"/>
              </td>
              <td>
                <p-form-number
                  :id="'total-' + index"
                  :name="'total-' + index"
                  :readonly="true"
                  v-model="form.items[index].total"/>
              </td>
              <td>
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="form.items[index].allocation_id"
                  :label="row.allocation_name"
                  @choosen="chooseAllocation($event, row)"/>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.total_quantity"/>
              </td>
              <td></td>
              <td></td>
              <td>
                <p-form-number
                  :id="'subtotal'"
                  :name="'subtotal'"
                  :readonly="true"
                  v-model="form.subtotal"/>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h5>{{ $t('down payment') | titlecase }}</h5>

          <hr>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Use</th>
              <th>{{ $t('down payment') }}</th>
              <th>{{ $t('amount') }}</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <p-form-check-box
                  id="need-down-payment"
                  name="need-down-payment"
                  class="mt-15"
                  @click.native="chooseTax('exclude')"
                  :checked="form.type_of_tax == 'exclude'"/>
              </td>
              <td>PDP19040001</td>
              <td>
                <p-form-number
                  :id="'price' + index"
                  :name="'price' + index"
                  v-model="form.subtotal"
                  @keyup.native="calculate()"/>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td>
                <p-form-number
                  :id="'subtotal'"
                  :name="'subtotal'"
                  :readonly="true"
                  v-model="form.subtotal"/>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-6">
              <textarea rows="10" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
            </div>
            <div class="col-sm-6">
              <p-form-row
                id="discount"
                name="discount"
                :label="$t('discount')">
                <div slot="body" class="col-lg-9 mt-5">
                  <p-discount
                    id="discount"
                    name="discount"
                    v-model="form.discount_percent"
                    @keyup.native="calculate()"/>
                </div>
              </p-form-row>
              <p-form-row
                id="need-down-payment"
                name="need-down-payment"
                :label="$t('tax')">
                <div slot="body" class="col-lg-9">
                  <p-form-check-box
                    class="mb-0"
                    style="float:left"
                    id="need-down-payment"
                    name="need-down-payment"
                    @click.native="chooseTax('include')"
                    :checked="form.type_of_tax == 'include'"
                    :description="$t('include tax')"/>
                  <p-form-check-box
                    id="need-down-payment"
                    name="need-down-payment"
                    @click.native="chooseTax('exclude')"
                    :checked="form.type_of_tax == 'exclude'"
                    :description="$t('exclude tax')"/>
                  <p-form-number
                    :id="'total'"
                    :name="'total'"
                    :readonly="true"
                    v-model="form.tax"/>
                </div>
              </p-form-row>
              <p-form-row
                id="total"
                name="total"
                :label="$t('total')">
                <div slot="body" class="col-lg-9 mt-5">
                  <p-form-number
                    :id="'total'"
                    :name="'total'"
                    :readonly="true"
                    v-model="form.amount"/>
                </div>
              </p-form-row>
            </div>
          </div>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-12">
              <h5>Approver</h5>
              <hr>
              <p-form-row
                id="approver"
                name="approver"
                :label="$t('approver')">
                <div slot="body" class="col-lg-9 mt-5">
                  <m-user
                    :id="'user'"
                    v-model="form.approver_id"
                    :errors="form.errors.get('approver_id')"
                    @errors="form.errors.set('approver_id', null)"/>
                </div>
              </p-form-row>
            </div>
          </div>

          <div class="form-group row">
            <div class="col-md-12">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
              </button>
            </div>
          </div>

        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import PurchaseMenu from '../Menu'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        approver_id: null,
        need_down_payment: 0,
        cash_only: false,
        notes: null,
        subtotal: 0,
        discount_percent: 0,
        discount_value: 0,
        tax_base: 0,
        tax: 0,
        type_of_tax: 'exclude',
        total_quantity: 0,
        amount: 0,
        items: [{
          item_id: null,
          item_name: null,
          item: {
            units: [{
              label: '',
              name: '',
              converter: null
            }]
          },
          unit: null,
          converter: null,
          quantity: null,
          price: null,
          total: null,
          allocation_id: null,
          allocation_name: null,
          notes: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('purchaseReceive', ['purchaseReceive']),
    ...mapGetters('purchaseInvoice', ['purchaseInvoice'])
  },
  methods: {
    ...mapActions('purchaseReceive', ['find']),
    ...mapActions('purchaseInvoice', ['create']),
    chooseSupplier (value) {
      this.form.supplier_name = value
    },
    chooseItem (item, row) {
      row.item_name = item.name
      row.item.units = item.units
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseAllocation (allocation, row) {
      row.allocation_name = allocation
    },
    chooseTax (taxType) {
      if (taxType == this.form.type_of_tax) {
        this.form.type_of_tax = null
      } else {
        this.form.type_of_tax = taxType
      }
      this.calculate()
    },
    calculate: debounce(function () {
      var subtotal = 0
      var totalQuantity = 0
      this.form.items.forEach(function (element) {
        element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        subtotal += parseFloat(element.total)
        totalQuantity += parseFloat(element.quantity)
      })
      this.form.subtotal = subtotal
      this.form.total_quantity = totalQuantity
      this.form.tax_base = this.form.subtotal - (this.form.subtotal * this.form.discount_percent / 100)
      if (this.form.type_of_tax == 'include') {
        this.form.tax = this.form.tax_base * 10 / 100
        this.form.amount = this.form.tax_base
      } else if (this.form.type_of_tax == 'exclude') {
        this.form.tax = this.form.tax_base * 10 / 100
        this.form.amount = this.form.tax_base + this.form.tax
      } else {
        this.form.tax = 0
        this.form.amount = this.form.tax_base
      }
    }, 300),
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
        })
        return
      }
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
  },
  created () {
    if (this.$route.query.id) {
      this.isLoading = true
      this.find({
        id: this.$route.query.id,
        params: {
          includes: 'form;' +
            'supplier;' +
            'items.item.units;' +
            'services.service;' +
            'purchaseOrder.remainingDownPayments'
        }
      }).then(response => {
        this.isLoading = false
        this.form.purchase_request_id = response.data.id
        this.form.date = response.data.form.date
        this.form.supplier_id = response.data.supplier_id
        this.form.supplier_name = response.data.supplier_name
        this.form.notes = response.data.form.notes
        this.form.amount = response.data.amount
        this.form.items = response.data.items
        this.form.items.forEach(function (element) {
          element.purchase_receive_item_id = element.id
        })
        this.calculate()
      }).catch(error => {
        this.$notification.error(error.message)
        this.isLoading = false
      })
    }
  }
}
</script>
