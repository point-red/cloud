<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('payment order') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('payment order')" :header="true">
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
            id="payment-type"
            name="payment-type"
            :label="$t('payment type')">
            <div slot="body" class="col-lg-9">                
              <p-form-check-box
                class="mb-0"
                style="float:left"
                id="payment-type"
                name="payment-type"
                @click.native="choosePaymentType('cash')"
                :checked="form.payment_type == 'cash'"
                :description="$t('cash')"/>
              <p-form-check-box
                id="payment-type"
                name="payment-type"
                @click.native="choosePaymentType('bank')"
                :checked="form.payment_type == 'bank'"
                :description="$t('bank')"/>
            </div>
          </p-form-row>

          <p-form-row
            id="payment-to"
            name="payment-to"
            :label="$t('payment to')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-paymentable id="paymentable" v-model="form.paymentable_id" @choosen="choosePaymentType" :label="form.paymentable_name"/>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h3>Detail</h3>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Account</th>
              <th>Notes</th>
              <th>Amount</th>
              <th style="min-width: 120px">Allocation</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-chart-of-account
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
                <p-form-number
                  :id="'amount-' + index"
                  :name="'amount-' + index"
                  v-model="form.items[index].amount"
                  @keyup.native="calculate()"/>
              </td>
              <td>
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="form.items[index].allocation_id"
                  :label="row.allocation_name"
                  @choosen="chooseAllocation($event, row)"/>
              </td>
              <td>
                <i class="btn btn-sm fa fa-times" @click="deleteRow(index)"></i>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td>
                <p-form-number
                  :id="'total_amount'"
                  :name="'total_amount'"
                  :readonly="true"
                  v-model="form.total_amount"/>
              </td>
              <td></td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addItemRow">
            <i class="fa fa-plus"/> Add
          </button>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-6">
              <textarea rows="10" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
            </div>
            <div class="col-sm-6">
              <h3>Approver</h3>
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

          <p-separator></p-separator>

          <div class="form-group row">
            <div class="col-md-12">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
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
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: null,
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
        total_amount: 0,
        amount: 0,
        items: [{
          item_id: null,
          item_name: null,
          item: {
            units: [{
              label: '',
              name: '',
              converter: null
            }],
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
    ...mapGetters('purchaseRequest', ['purchaseRequest']),
    ...mapGetters('purchaseOrder', ['purchaseOrder'])
  },
  methods: {
    ...mapActions('purchaseRequest', ['find']),
    ...mapActions('purchaseOrder', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        item: {
          units: [{
            label: '',
            name: '',
            converter: null
          }],
        },
        unit: null,
        converter: null,
        quantity: null,
        price: null,
        allocation_id: null,
        allocation_name: null,
        notes: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.items, index)
    },
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
    choosePaymentType (type) {
      if (type == this.form.payment_type) {
        this.form.payment_type = null
      } else {
        this.form.payment_type = type
      }
      this.calculate()
    },
    chooseTax (taxType) {
      if (taxType == this.form.type_of_tax) {
        this.form.type_of_tax = null
      } else {
        this.form.type_of_tax = taxType
      }
      this.calculate()
    },
    calculate: debounce (function () {
      var subtotal = 0
      var totalQuantity = 0
      this.form.items.forEach(function (element) {
        element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        element.discount_value = element.discount_percent * element.price / 100
        subtotal += parseFloat(element.total)
        totalQuantity += parseFloat(element.quantity)
      })
      this.form.subtotal = subtotal
      this.form.discount_value = this.form.discount_percent * subtotal / 100
      this.form.total_amount = totalQuantity
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
          this.$router.push('/purchase/order/' + response.data.id)
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
          includes: 'form;supplier;items.item.units;services.service'
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
          element.purchase_request_item_id = element.id
        })
        this.calculate()
      }).catch(error => {
        this.isLoading = false
      })
    }
  }
}
</script>
