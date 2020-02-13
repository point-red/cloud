<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link :to="{ name: 'purchase.order.index' }" class="breadcrumb-item">{{ $t('purchase order') | titlecase }}</router-link>
      <router-link :to="{ name: 'purchase.order.show', params: { id: id }}" class="breadcrumb-item">{{ purchaseOrder.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('purchase order')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseOrder.form.number">
                {{ purchaseOrder.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ purchaseOrder.form.edited_number }}
              </template>
            </div>
          </p-form-row>
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="date"
                name="date"
                label="date"
                v-model="form.date"
                :errors="form.errors.get('date')"
                @errors="form.errors.set('date', null)"/>
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9">
              <m-supplier id="supplier" v-model="form.supplier_id" @choosen="chooseSupplier" :label="form.supplier_name"/>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5 class="">Item</h5>

          <p-block-inner>
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
                <th></th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <m-item
                    :id="'item-' + index"
                    :data-index="index"
                    v-model="row.item_id"
                    @units="updateUnits"/>
                </td>
                <td>
                  <p-form-input
                    id="notes"
                    name="notes"
                    v-model="row.notes"/>
                </td>
                <td>
                  <p-quantity
                    :id="'quantity' + index"
                    :name="'quantity' + index"
                    v-model="row.quantity"
                    :unit="row.unit"/>
                </td>
                <td>
                  <p-form-number
                    :id="'price' + index"
                    :name="'price' + index"
                    v-model="row.price"/>
                </td>
                <td>
                  <p-discount
                    :id="'discount' + index"
                    :name="'discount' + index"
                    v-model="row.discount_percent"
                    @keyup.native="calculate()"/>
                </td>
                <td>
                  <p-form-number
                    :id="'total-' + index"
                    :name="'total-' + index"
                    :readonly="true"
                    v-model="row.total"/>
                </td>
                <td>
                  <m-allocation
                    :id="'allocation-' + index"
                    v-model="row.allocation_id"/>
                </td>
              </tr>
              <tr slot="p-body">
                <th></th>
                <td></td>
                <td></td>
                <td>
                  <p-form-number
                    :id="'total_quantity'"
                    :name="'total_quantity'"
                    :readonly="true"
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
            <button type="button" class="btn btn-sm btn-secondary" @click="addItemRow">
              <i class="fa fa-plus"/> Add
            </button>
          </p-block-inner>

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

          <h5 class="">Approver</h5>

          <p-form-row
            id="approver"
            name="approver"
            :label="$t('approver')">
            <div slot="body" class="col-lg-9">
              <m-user :id="'user'" v-model="form.approver_id"/>
            </div>
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>{{ $t('save') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PurchaseMenu from '../Menu'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable,
    PurchaseMenu
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: true,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        date: null,
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
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrder'])
  },
  watch: {
    'form.required_date': function () {
      this.form.date = this.form.required_date
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'supplier;items.item.units;items.allocation;services.service;services.allocation;form.approvals.requestedBy;form.approvals.requestedTo'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/purchase/order/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = response.data.form.date
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.required_date = response.data.required_date
      this.form.supplier_id = response.data.supplier_id
      this.form.supplier_name = response.data.supplier_name
      this.form.discount_percent = response.data.discount_percent
      this.form.discount_value = response.data.discount_value
      this.form.amount = response.data.amount
      this.form.notes = response.data.form.notes
      response.data.items.forEach((item, keyItem) => {
        this.form.items.push({
          item_id: item.item_id,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          converter: item.converter,
          allocation_id: item.allocation_id,
          notes: item.notes
        })
      })
      this.calculate()
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
        unit: '',
        converter: null,
        units: [{
          label: '',
          name: '',
          converter: ''
        }],
        quantity: 0,
        price: 0,
        allocation: null,
        notes: null
      })
    },
    chooseSupplier (value) {
      this.form.supplier_name = value
    },
    updateUnits (itemUnits) {
      this.form.items.forEach((item, keyItem) => {
        if (item.item_id == itemUnits.item_id) {
          this.form.items[keyItem].units = itemUnits.units
        }
        item.units.forEach((unit, keyUnit) => {
          if (unit.converter == 1) {
            this.form.items[keyItem].unit = unit.label
            this.form.items[keyItem].converter = unit.converter
          }
        })
      })
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
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
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
