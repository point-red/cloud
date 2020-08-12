<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/receive"
        class="breadcrumb-item"
      >
        {{ $t('purchase receive') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('purchase receive') | uppercase }}</h4>
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
                        <template v-if="purchaseOrder && purchaseOrder.form.number">
                          {{ purchaseOrder.form.number }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('warehouse') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.warehouse.open()"
                      >{{ form.warehouse_name || $t('select') | uppercase }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('driver') | uppercase }}
                    </td>
                    <td>
                      <p-form-input
                        id="driver"
                        v-model="form.driver"
                        name="driver"
                        :label="$t('driver')"
                        :errors="form.errors.get('driver')"
                        @errors="form.errors.set('driver', null)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('license plate') | uppercase }}
                    </td>
                    <td>
                      <p-form-input
                        id="license plate"
                        v-model="form.license_plate"
                        name="license plate"
                        :label="$t('license plate')"
                        :errors="form.errors.get('license_plate')"
                        @errors="form.errors.set('license_plate', null)"
                      />
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
                    {{ $t('from') | uppercase }}:
                  </h6>
                  <span>{{ form.supplier_label | uppercase }}</span>
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
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  {{ $t('item') | uppercase }}
                </th>
                <th>{{ $t('quantity remaining') | uppercase }}</th>
                <th>{{ $t('quantity received') | uppercase }}</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  v-if="row.quantity_pending > 0"
                  slot="p-body"
                  :key="'item-'+index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>{{ row.item_label }}</td>
                  <td>{{ row.quantity_pending }} {{ row.unit }}</td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      v-model="row.quantity"
                      :name="'quantity' + index"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      :max="row.quantity_pending * 1"
                      :disable-unit-selection="true"
                      :readonly="onClickUnit(row)"
                      @choosen="chooseUnit($event, row)"
                      @click.native="onClickQuantity(row, index)"
                    />
                  </td>
                </tr>
              </template>
            </point-table>
            <div class="row">
              <div class="col-sm-9" />
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('created by') | uppercase }}
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
    <m-inventory-in
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @submit="updateDna($event)"
    />
    <m-warehouse
      id="warehouse"
      ref="warehouse"
      name="warehouse"
      @choosen="chooseWarehouse"
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
  name: 'Create',
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
        warehouse_id: null,
        warehouse_name: null,
        supplier_id: null,
        supplier_name: null,
        supplier_label: null,
        supplier_address: null,
        supplier_phone: null,
        supplier_email: null,
        driver: null,
        license_plate: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    if (this.$route.query.id) {
      this.isLoading = true
      this.find({
        id: this.$route.query.id,
        params: {
          includes: 'form;supplier;items.item.units'
        }
      }).then(response => {
        this.choosePurchaseOrder(response.data)
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    }
  },
  methods: {
    ...mapActions('purchaseReceive', ['create']),
    onClickQuantity (row, index) {
      if (row.item.require_expiry_date == 1 || row.item.require_production_number == 1) {
        row.index = index
        this.$refs.inventory.open(row, row.quantity_pending)
      }
    },
    onClickUnit (row) {
      if (row.item_id == null || row.item.require_expiry_date === 1 || row.item.require_production_number === 1) {
        return true
      }
      return false
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    chooseWarehouse (warehouse) {
      this.form.warehouse_id = warehouse.id
      this.form.warehouse_name = warehouse.name
      this.form.items.forEach(element => {
        element.warehouse_id = this.form.warehouse_id
        element.warehouse_name = this.form.warehouse_name
      })
    },
    choosePurchaseOrder (purchaseOrder) {
      this.purchaseOrder = purchaseOrder
      this.form.purchase_order_id = purchaseOrder.id
      this.form.supplier_id = purchaseOrder.supplier_id
      this.form.supplier_name = purchaseOrder.supplier_name
      this.form.supplier_label = purchaseOrder.supplier_name
      this.form.supplier_address = purchaseOrder.supplier_address
      this.form.supplier_phone = purchaseOrder.supplier_phone
      this.form.supplier_email = purchaseOrder.supplier_email
      this.form.items = purchaseOrder.items
      this.form.items.forEach(purchaseOrderItem => {
        let quantityPending = 0
        const quantity = purchaseOrderItem.quantity
        purchaseOrder.purchase_receives.forEach(purchaseReceive => {
          purchaseReceive.items.forEach(purchaseReceiveItem => {
            if (purchaseReceiveItem.purchase_order_item_id == purchaseOrderItem.id) {
              quantityPending += purchaseReceiveItem.quantity
            }
          })
        })
        purchaseOrderItem.purchase_order_item_id = purchaseOrderItem.id
        purchaseOrderItem.item_name = purchaseOrderItem.item.name
        purchaseOrderItem.item_label = purchaseOrderItem.item.label
        purchaseOrderItem.quantity_pending = quantity - quantityPending
        purchaseOrderItem.quantity = 0
      })
    },
    updateDna (e) {
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].quantity = e.quantity
      this.form.items[e.index].unit = e.unit
      this.form.items[e.index].converter = e.converter
    },
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.items = this.form.items.filter(item => item.quantity)
      this.create(this.form)
        .then(response => {
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/purchase/receive/' + response.data.id)
        }).catch(error => {
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        }).finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>
