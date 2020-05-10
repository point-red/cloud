<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link :to="{ name: 'purchase.receive.index' }" class="breadcrumb-item">{{ $t('purchase receive') | titlecase }}</router-link>
      <router-link :to="{ name: 'purchase.order.show', params: { id: id }}" class="breadcrumb-item">{{ purchaseOrder.form.number }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('purchase receive')" :header="true">
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
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9">
              {{ form.supplier_name }}
            </div>
          </p-form-row>

          <p-form-row
            id="warehouse"
            name="warehouse"
            :label="$t('warehouse')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-warehouse id="warehouse" v-model="form.warehouse_id" @choosen="chooseWarehouse" :label="form.warehouse_name"/>
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
            id="driver"
            v-model="form.driver"
            :disabled="isSaving"
            :label="$t('driver')"
            name="driver"
            :errors="form.errors.get('driver')"
            @errors="form.errors.set('driver', null)"/>

          <p-form-row
            id="license-plate"
            v-model="form.license_plate"
            :disabled="isSaving"
            :label="$t('license plate')"
            name="license-plate"
            :errors="form.errors.get('license_plate')"
            @errors="form.errors.set('license_plate', null)"/>

          <p-separator></p-separator>

          <h5 class="">Item</h5>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">Item</th>
                <th>Notes</th>
                <th>Quantity</th>
                <th>Receive</th>
                <th>Expiry Date</th>
                <th>Production No.</th>
                <th></th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
                <th>{{ index + 1 }}</th>
                <td>{{ row.item.name }}</td>
                <td>{{ row.notes }}</td>
                <td class="text-right">
                  {{ row.quantity_pending }} {{ row.unit }}
                </td>
                <td>
                  <p-quantity
                    :id="'quantity' + index"
                    :name="'quantity' + index"
                    :disabled="isSaving"
                    v-model="row.quantity"
                    :unit="row.unit"/>
                </td>
                <td>
                  <p-date-picker
                    id="expiry-date"
                    name="expiry-date"
                    v-model="row.expiry_date"/>
                </td>
                <td>
                  <p-form-input
                    id="production-number"
                    v-model="row.production_number"
                    :disabled="isSaving"
                    name="production-number"/>
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-separator></p-separator>

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
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PurchaseMenu from '../Menu'
import PointTable from 'point-table-vue'
// import debounce from 'lodash/debounce'
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
      id: this.$route.query.id,
      isLoading: true,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        id: this.$route.query.id,
        date: null,
        supplier_id: null,
        supplier_name: null,
        warehouse_id: null,
        purchase_order_id: null,
        driver: null,
        license_plate: null,
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
        includes: 'supplier;items.item.units;items.allocation;services.service;services.allocation;form.approvals.requestedBy;form.approvals.requestedTo',
        remaining_info: true
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/purchase/order/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = response.data.form.date
      this.form.purchase_order_id = response.data.id
      this.form.warehouse_id = response.data.warehouse_id
      this.form.supplier_id = response.data.supplier_id
      this.form.supplier_name = response.data.supplier_name
      this.form.notes = response.data.form.notes
      response.data.items.forEach((item, keyItem) => {
        this.form.items.push({
          purchase_order_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item_name,
          item: item.item,
          quantity_pending: item.quantity_pending,
          quantity: item.quantity_pending,
          expiry_date: this.$moment().format('YYYY-MM-DD'),
          production_number: null,
          price: item.price,
          discount_value: item.discount_value,
          discount_percent: item.discount_percent,
          unit: item.unit,
          converter: item.converter,
          allocation_id: item.allocation_id,
          notes: item.notes
        })
      })
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('purchaseOrder', ['find']),
    ...mapActions('purchaseReceive', ['create']),
    chooseWarehouse (value) {
      this.form.warehouse_name = value
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
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('create success')
          this.$router.push('/purchase/receive/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
