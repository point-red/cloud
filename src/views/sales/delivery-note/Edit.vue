<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        :to="{ name: 'sales.delivery-note.index' }"
        class="breadcrumb-item"
      >
        {{ $t('delivery note') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'sales.delivery-note.show', params: { id: $route.params.id }}"
        class="breadcrumb-item"
      >
        {{ deliveryNote.form.number | uppercase }}
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
                        :disabled-date-rule="disabledDateRule"
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
                      <span>{{ deliveryOrder.form.number }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('warehouse') | uppercase }}
                    </td>
                    <td>
                      <span>{{ form.warehouse_name | uppercase }}</span>
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
                <th>Quantity Remaining</th>
                <th>Quantity</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                  :class="{'d-none' : row.quantity_requested == 0}"
                >
                  <th>{{ index + 1 }}</th>
                  <td>{{ row.item_label | uppercase }}</td>
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
              <div class="col-sm-9">
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
    <select-delivery-order
      ref="selectDeliveryOrder"
      @choosen="chooseDeliveryOrder"
    />
    <m-inventory-out
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @updated="updateDna($event)"
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
        id: this.$route.params.id,
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
      }),
      showNotif: false
    }
  },
  computed: {
    ...mapGetters('salesDeliveryNote', ['deliveryNote']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    'form.items': {
      handler (changedItems) {
        changedItems.forEach(item => {
          if (typeof item.quantity === 'undefined') item.quantity = 0
          const quantity = Number(item.quantity)
          const quantityRequested = Number(item.quantity_requested)
          const remaining = quantityRequested - quantity
          if (quantity > quantityRequested) item.quantity = quantityRequested
          item.quantity_remaining = isNaN(quantity) ? quantityRequested : remaining
        })
      },
      deep: true
    },
    'form.driver': {
      handler (text) {
        this.maxInput('driver', text)
      },
      deep: true
    },
    'form.license_plate': {
      handler (text) {
        this.maxInput('license_plate', text)
      },
      deep: true
    }
  },
  async created () {
    this.isLoading = true

    try {
      const response = await this.find({
        id: this.$route.params.id,
        params: {
          includes: 'customer;warehouse;deliveryOrder.form;form.requestApprovalTo;items.item.units'
        }
      })
      this.mapDeliveryNoteData(response.data)
    } catch (error) {
      this.$notification.error(error.message)
    }

    this.isLoading = false
    return true
  },
  methods: {
    ...mapActions('salesDeliveryNote', ['find', 'update']),
    mapDeliveryNoteData (deliveryNote) {
      this.chooseCustomer(deliveryNote.customer)
      this.chooseWarehouse(deliveryNote.warehouse)

      this.deliveryOrder = deliveryNote.delivery_order
      this.form.date = deliveryNote.form.date
      this.form.notes = deliveryNote.notes
      this.form.driver = deliveryNote.driver
      this.form.license_plate = deliveryNote.license_plate
      this.form.delivery_order_id = deliveryNote.delivery_order_id
      this.form.request_approval_to = this.deliveryOrder.form.request_approval_to

      const items = []
      let currentId = 0
      deliveryNote.items.forEach(function (item) {
        item.item_label = item.item.name
        item.item.units.forEach((unit, keyUnit) => {
          if (unit.id == item.item.unit_default) {
            item.item.unit = unit
          }
        })

        let quantity = 0
        if (currentId != item.item_id) {
          items.push(item)
          currentId = item.item_id
          quantity = Number(item.quantity)
        }

        const index = items.length - 1
        items[index].quantity = quantity || items[index].quantity + Number(item.quantity)
        items[index].quantity_requested = items[index].quantity + Number(item.quantity_remaining)
        items[index].require_expiry_date = item.item.require_expiry_date
        items[index].require_production_number = item.item.require_production_number

        if (item.item.require_expiry_date || item.item.require_production_number) {
          if (!items[index].dna) {
            items[index].dna = []
          }
          items[index].dna.push({
            item_id: item.item_id,
            quantity: Number(item.quantity),
            remaining: Number(item.quantity_remaining),
            production_number: item.production_number,
            expiry_date: item.expiry_date
          })
        }
      })

      this.form.items = items
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
    updateDna (e) {
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].quantity = e.quantity
      this.form.items[e.index].unit = e.unit
      this.form.items[e.index].converter = e.converter
    },
    chooseDeliveryOrder (deliveryOrder) {
      const items = deliveryOrder.items.filter(item => item.quantity_delivered)

      if (items.length <= 0) {
        this.$notification.error('Can not load form ' + deliveryOrder.form.number + ', because there is no item or quantity item is 0')
        return false
      }
      this.form.items = deliveryOrder.items.filter(item => {
        item.item.units.forEach((unit, keyUnit) => {
          if (unit.id == item.item.unit_default) {
            item.item.unit = unit
          }
        })
        return {
          item: item.item,
          delivery_order_item_id: item.id,
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.name,
          more: false,
          unit: item.unit,
          converter: item.converter,
          quantity: item.quantity,
          quantity_requested: item.quantity_delivered,
          require_expiry_date: item.item.require_expiry_date,
          require_production_number: item.item.require_production_number,
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
      this.update(this.form)
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
    },
    onClickQuantity (row, index) {
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        row.warehouse_id = this.form.warehouse_id
        row.index = index
        row.max_input = Number(row.quantity_remaining) + Number(row.quantity)
        this.$refs.inventory.open(row, row.quantity)
      }
    },
    onClickUnit (row) {
      if (row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }
      return false
    },
    maxInput (name, input) {
      const maxInput = 255
      if (input.length > maxInput) {
        setTimeout(() => {
          this.form[name] = input.substring(0, maxInput)
          if (!this.showNotif) {
            this.showNotif = true
            this.$notification.error('max input ' + maxInput + ' characters')
            setTimeout(() => { this.showNotif = false }, 6000)
          }
        }, 1)
      }
    }
  }
}
</script>
