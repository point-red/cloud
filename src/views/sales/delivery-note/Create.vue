<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/delivery-order"
        class="breadcrumb-item"
      >
        {{ $t('delivery note') | uppercase }}
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
                <h4>{{ $t('delivery note') | uppercase }}</h4>
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
                      {{ $t('delivery order') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectDeliveryOrder.open()"
                      >
                        <template v-if="deliveryOrder && deliveryOrder.form.number != null">
                          {{ deliveryOrder.form.number }}
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
                    {{ $t('to') | uppercase }}: {{ form.customer_name | uppercase }}
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
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>{{ row.item_label | uppercase }}</td>
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
                </tr>
              </template>
            </point-table>

            <div class="row">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>

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
            </div>
            <hr>
            <div class="row">
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
      permission="approve sales delivery note"
      @choosen="chooseApprover"
    />
    <m-warehouse
      id="warehouse"
      ref="warehouse"
      name="warehouse"
      @choosen="chooseWarehouse"
    />
    <select-delivery-order
      ref="selectDeliveryOrder"
      @choosen="chooseDeliveryOrder"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectDeliveryOrder from './SelectDeliveryOrder'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbSales,
    SelectDeliveryOrder
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      deliveryOrder: null,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        driver: null,
        license_plate: null,
        warehouse_id: null,
        warehouse_name: null,
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
        delivery_order_id: null
      })
    }
  },
  computed: {
    ...mapGetters('salesDeliveryNote', ['deliveryNote']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    if (this.$route.query.id) {
      this.isLoading = true
      this.find({
        id: this.$route.query.id,
        params: {
          includes: 'form;customer;items.item.units.prices;items.allocation'
        }
      }).then(response => {
        this.isLoading = false
        this.form.delivery_order_id = response.data.id
        this.form.date = response.data.form.date
        this.form.customer_id = response.data.customer_id
        this.form.customer_name = response.data.customer_name
        this.form.notes = response.data.form.notes
        this.form.items = response.data.items
        this.form.items.forEach(function (element) {
          element.delivery_order_item_id = element.id
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  methods: {
    ...mapActions('salesDeliveryNote', ['create']),
    chooseWarehouse (warehouse) {
      this.form.warehouse_id = warehouse.id
      this.form.warehouse_name = warehouse.name
      this.form.items.forEach(element => {
        element.warehouse_id = this.form.warehouse_id
        element.warehouse_name = this.form.warehouse_name
      })
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
    chooseDeliveryOrder (deliveryOrder) {
      this.deliveryOrder = deliveryOrder
      this.form.warehouse_id = deliveryOrder.warehouse_id
      this.form.delivery_order_id = deliveryOrder.id
      this.form.customer_id = deliveryOrder.customer.id
      this.form.customer_name = deliveryOrder.customer.name
      this.form.customer_label = deliveryOrder.customer.label
      this.form.items = deliveryOrder.items.map(item => {
        return {
          delivery_order_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.name,
          more: false,
          unit: item.unit,
          converter: item.converter,
          quantity: item.quantity,
          price: item.price,
          discount_percent: 0,
          discount_value: 0,
          total: item.quantity * (item.price - item.discount_value),
          allocation_id: item.allocation_id,
          allocation_name: item.allocation_name,
          notes: item.notes
        }
      })
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
          this.$router.push('/sales/delivery-note/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
