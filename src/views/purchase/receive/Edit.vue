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
                      <!-- <span @click="$refs.warehouse.show()" class="select-link">
                        <template v-if="warehouse">
                          {{ warehouse.label }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span> -->
                      <m-warehouse
                        id="warehouse"
                        ref="warehouse"
                        name="warehouse"
                        @choosen="chooseWarehouse"
                      />
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
                  :key="'item-'+index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>{{ row.item_label }}</td>
                  <td>{{ row.quantity_remaining | numberFormat }} {{ row.unit }}</td>
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
                      :max="row.quantity * 1"
                      @choosen="chooseUnit($event, row)"
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
                <template v-if="row.more">
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
            </point-table>
            <!-- <div class="row"></div> -->
            <!-- <hr> -->
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

    <m-user
      ref="approver"
      @choosen="chooseApprover"
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
  name: 'Edit',
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
      purchaseOrder: null,
      warehouse: null,
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
        items: [],
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      })
    }
  },
  computed: {
    ...mapGetters('purchaseReceive', ['purchaseReceive']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.purchaseReceiveRequest()
  },
  methods: {
    ...mapActions('purchaseReceive', ['create', 'find']),
    toggleMore () {
      const isMoreActive = this.form.items.some(function (el, index) {
        return el.more === false
      })
      this.form.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    chooseWarehouse (warehouse) {
      this.form.warehouse_id = warehouse.id
      this.form.warehouse_name = warehouse.name
    },
    choosePurchaseOrder (purchaseOrder) {
      this.purchaseOrder = purchaseOrder
      this.form.purchase_order_id = purchaseOrder.id
      this.form.items = purchaseOrder.items.map(item => {
        return {
          purchase_order_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item_name,
          item_label: item.item_name,
          unit: item.unit,
          units: item.item.units,
          quantity_remaining: item.quantity,
          quantity: item.quantity,
          converter: item.converter,
          notes: ''
        }
      })
      this.form.supplier_id = purchaseOrder.supplier_id
      this.form.supplier_name = purchaseOrder.supplier_name
      this.form.supplier_label = purchaseOrder.supplier_name
      this.form.supplier_address = purchaseOrder.supplier_address
      this.form.supplier_phone = purchaseOrder.supplier_phone
      this.form.supplier_email = purchaseOrder.supplier_email
    },
    purchaseReceiveRequest () {
      this.isLoading = true
      this.find({
        id: this.$route.params.id,
        params: {
          with_archives: true,
          includes: 'supplier;' +
            'warehouse;' +
            'items.item.units;' +
            'purchaseOrder.form;' +
            'purchaseOrder.items.item.units;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.purchaseReceive = response.data
        this.form.purchase_receive_id = response.data.id
        this.form.driver = response.data.driver
        this.form.license_plate = response.data.license_plate
        this.form.request_approval_to = response.data.form.request_approval_to.id
        this.form.approver_name = response.data.form.request_approval_to.full_name
        this.form.approver_email = response.data.form.request_approval_to.email
        this.choosePurchaseOrder(response.data.purchase_order)
        this.chooseWarehouse(response.data.warehouse)
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    onSubmit () {
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
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

<style lang="scss" scoped>

</style>
