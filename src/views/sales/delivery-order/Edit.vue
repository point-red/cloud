<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        :to="{ name: 'sales.delivery-order.index' }"
        class="breadcrumb-item"
      >
        {{ $t('delivery order') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'sales.delivery-order.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ deliveryOrder.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('delivery order') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('form number') | uppercase }}
                    </td>
                    <td>
                      {{ deliveryOrder.form.number }}
                    </td>
                  </tr>
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
                        :disabled-date-rule="disabledDateRule"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('sales order') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectSalesOrder.open()"
                      >
                        <template v-if="salesOrder && salesOrder.form.number != null">
                          {{ salesOrder.form.number }}
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
                <th>Quantity Requested</th>
                <th>Quantity Delivered</th>
                <th>Quantity Remaining</th>
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
                      :id="'quantity_requested' + index"
                      v-model="row.quantity_requested"
                      :name="'quantity_requested' + index"
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
                  <td class="position-relative">
                    <p-quantity
                      :id="'quantity_delivered' + index"
                      v-model="row.quantity_delivered"
                      :name="'quantity_delivered' + index"
                      :disabled="row.item_id == null"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      :has-error="row.is_quantity_over"
                      disable-unit-selection
                      @changed="onQuantityChange($event, row)"
                    />
                    <span
                      v-if="row.is_quantity_over"
                      class="position-absolute text-danger"
                    >
                      {{ $t('quantity over message') }}
                    </span>
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity_remaining' + index"
                      v-model="row.quantity_remaining"
                      :name="'quantity_remaining' + index"
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
                  :disabled="isSaving || hasError"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('update') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-user
      ref="approver"
      permission="approve sales order"
      @choosen="chooseApprover"
    />
    <m-warehouse
      id="warehouse"
      ref="warehouse"
      name="warehouse"
      default-only
      @choosen="chooseWarehouse"
    />
    <select-sales-order
      ref="selectSalesOrder"
      @choosen="chooseSalesOrder"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectSalesOrder from './SelectSalesOrder'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbSales,
    SelectSalesOrder
  },
  data () {
    return {
      hasError: false,
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      salesOrder: null,
      form: new Form({
        id: this.$route.params.id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        warehouse_id: null,
        warehouse_name: null,
        customer_id: null,
        customer_name: null,
        customer_label: null,
        customer_address: null,
        customer_phone: null,
        customer_email: null,
        pricing_group_id: 1,
        notes: null,
        items: [],
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        sales_order_id: null
      })
    }
  },
  computed: {
    ...mapGetters('salesDeliveryOrder', ['deliveryOrder']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    'form.items': {
      handler (newValue) {
        const [item] = newValue

        item.quantity_remaining = item.quantity_requested - item.quantity_delivered
        item.is_quantity_over = item.quantity_remaining < 0

        this.hasError = item.is_quantity_over
      },
      deep: true
    }
  },
  async created () {
    this.isLoading = true

    try {
      if (this.deliveryOrder.form.number) {
        this.isLoading = false
        this.mapDeliveryOrderData(this.deliveryOrder)
        return true
      }

      const response = await this.find({
        id: this.$route.params.id,
        params: {
          includes: 'customer;warehouse;salesOrder.form;form.requestApprovalTo;items.item.units'
        }
      })
      this.mapDeliveryOrderData(response.data)
    } catch (error) {
      console.log(error)
      this.$notification.error(error.message)
    }

    this.isLoading = false
    return true
  },
  methods: {
    ...mapActions('salesDeliveryOrder', ['find', 'update']),
    mapDeliveryOrderData (deliveryOrder) {
      this.chooseApprover(deliveryOrder.form.request_approval_to)
      this.chooseCustomer(deliveryOrder.customer)
      this.chooseWarehouse(deliveryOrder.warehouse)

      this.salesOrder = deliveryOrder.sales_order
      this.form.date = deliveryOrder.form.date
      this.form.notes = deliveryOrder.notes
      this.form.sales_order_id = deliveryOrder.sales_order_id

      this.form.items = deliveryOrder.items
      this.form.items.forEach(function (item) {
        const quantityRemainingInForm = item.quantity_requested - item.quantity_delivered

        item.item_label = item.item.name
        item.is_quantity_over = quantityRemainingInForm < 0
        item.units = item.item.units
      })
    },
    disabledDateRule (date) {
      const dateOptionFormatted = this.$options.filters.dateFormat(date, 'YYYY-MM-DD')
      const dateFormFormatted = this.$options.filters.dateFormat(this.form.date, 'YYYY-MM-DD')

      return dateOptionFormatted < dateFormFormatted
    },
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
      this.form.approver_name = value.fullName || value.full_name
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
    chooseSalesOrder (salesOrder) {
      this.salesOrder = salesOrder
      this.form.sales_order_id = salesOrder.id
      this.form.customer_id = salesOrder.customer.id
      this.form.customer_name = salesOrder.customer.name
      this.form.customer_label = salesOrder.customer.label
      this.form.items = salesOrder.items.map(item => {
        const quantityRemainingInForm = item.quantity_remaining - item.quantity_remaining

        return {
          sales_order_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.name,
          units: item.item.units,
          unit: item.unit_smallest || item.unit,
          converter: item.converter_smallest || item.converter,
          quantity_requested: item.quantity_remaining,
          quantity_delivered: item.quantity_remaining,
          quantity_remaining: quantityRemainingInForm,
          is_quantity_over: quantityRemainingInForm < 0,
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
      this.form.items = this.form.items.filter(item => item.item_id)
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/sales/delivery-order/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
