<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/order" class="breadcrumb-item">Purchase Order</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('purchase order')" :header="true">
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
          id="supplier"
          name="supplier"
          :label="$t('supplier')">
          <div slot="body" class="col-lg-9 mt-5">
            <m-supplier id="supplier" v-model="form.supplier_id" @choosen="chooseSupplier"/>
          </div>
        </p-form-row>        

        <p-form-row
          id="notes"
          v-model="form.notes"
          :disabled="isSaving"
          :label="$t('notes')"
          name="notes"
          :errors="form.errors.get('notes')"
          @errors="form.errors.set('notes', null)"/>

        <p-separator></p-separator>

        <h3>Item</h3>
        <hr>
        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th style="min-width: 120px">Allocation</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-' + index"
                  :data-index="index"
                  v-model="form.items[index].item_id"
                  @choosen="chooseItem($event, row)"/>
              </td>
              <td>
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="form.items[index].allocation_id"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.items[index].quantity"
                  :unit="form.items[index].units[0].label"
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
                  v-model="form.items[index].discount"
                  @keyup.native="calculate()"/>
              </td>              
              <td>
                <p-form-number
                  :id="'total-' + index"
                  :name="'total-' + index"
                  :readonly="true"
                  v-model="form.items[index].total"/>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td colspan="5" class="text-right">{{ $t('discount') | uppercase }}</td>
              <td>
                <p-form-number
                  :id="'discount'"
                  :name="'discount'"
                  :readonly="true"
                  v-model="form.discount"/>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td colspan="5" class="text-right">{{ $t('vat') | uppercase }}</td>
              <td>
                <p-form-number
                  :id="'vat'"
                  :name="'vat'"
                  :readonly="true"
                  v-model="form.vat"/>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td colspan="5" class="text-right">{{ $t('total') | uppercase }}</td>
              <td>
                <p-form-number
                  :id="'total'"
                  :name="'total'"
                  :readonly="true"
                  v-model="form.total"/>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addItemRow">
            <i class="fa fa-plus"/> Add
          </button>
        </p-block-inner>

        <p-separator></p-separator>

        <div class="row">
          <div class="col-sm-6">
            <h3>Options</h3>        
            <hr>
            <p-form-row
              id="need-down-payment"
              name="need-down-payment"
              :label="$t('require down payment')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  id="need-down-payment"
                  name="need-down-payment"
                  @click.native="form.need_down_payment = !form.need_down_payment"
                  :checked="form.need_down_payment"
                  :description="''"/>
              </div>
            </p-form-row>

            <p-form-row
              id="cash-only"
              name="cash-only"
              :label="$t('cash only')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  id="cash-only"
                  name="cash-only"
                  @click.native="form.cash_only = !form.cash_only"
                  :checked="form.cash_only"
                  :description="''"/>
              </div>
            </p-form-row>
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

        <div class="form-group row">
          <div class="col-md-12">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
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
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        approver_id: null,
        need_down_payment: false,
        cash_only: false,
        notes: null,
        total: null,
        items: [
          {
            item_id: null,
            item_name: null,
            unit: null,
            converter: null,
            units: [{
              label: '',
              name: '',
              converter: null
            }],
            quantity: null,
            price: null,
            total: null,
            allocation_id: null,
            notes: null
          }
        ]
      })
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrder'])
  },
  methods: {
    ...mapActions('purchaseOrder', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        unit: null,
        converter: null,
        units: [
          {
            label: '',
            name: '',
            converter: null
          }
        ],
        quantity: null,
        price: null,
        allocation: null,
        notes: null
      })
    },
    chooseSupplier (value) {
      this.form.supplier_name = value
    },
    chooseItem (item, row) {
      row.item_name = item.name
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    calculate: debounce (function () {
      this.form.items.forEach(function (element) {
        element.total = element.quantity * (element.price - (element.price * element.discount / 100))
      })
    }, 300),
    onSubmit () {
      this.isSaving = true
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
          console.log(error.errors)
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
  }
}
</script>
