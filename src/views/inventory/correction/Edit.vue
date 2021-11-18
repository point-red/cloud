<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <router-link
        to="/inventory/correction"
        class="breadcrumb-item"
      >
        {{ $t('stock correction') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
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
                    <th>
                      {{ $t('form number') | uppercase }}
                    </th>
                    <td>
                      {{ form.number | uppercase }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('warehouse') | uppercase }}
                    </td>
                    <td>
                      {{ form.warehouse_name }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <hr>
            <point-table v-if="form.warehouse_id">
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th>Stock Database</th>
                <th>Stock Correction</th>
                <th>Balance</th>
                <th>Notes</th>
                <th>Allocation</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    {{ row.item_label }}
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'stock-database' + index"
                      v-model="row.stock_database"
                      :name="'stock-database' + index"
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
                      :id="'stock-correction' + index"
                      v-model="row.stock_correction"
                      :name="'stock-correction' + index"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      :max="row.quantity_pending * 1"
                      :disabled="row.item_id == null"
                      disable-unit-selection
                      @choosen="chooseUnit($event, row)"
                      @click.native="onClickQuantity(row, index)"
                    />
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'stock-balance' + index"
                      :value="parseFloat(row.stock_database) + parseFloat(row.stock_correction)"
                      :name="'stock-balance' + index"
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
                    <p-form-input
                      :id="'item-notes' + index"
                      v-model="row.notes"
                      :disabled="row.item_id == null"
                      :name="'item-notes' + index"
                    />
                  </td>
                  <td>
                    <span
                      v-if="row.item_id != null"
                      class="select-link"
                      @click="$refs.allocation.open(index)"
                    >{{ row.allocationName || $t('select') | uppercase }}</span><br>
                  </td>
                </tr>
              </template>
            </point-table>

            <div
              v-if="form.referenceId"
              class="row"
            >
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="14"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>
              <div class="col-sm-6">
                <p-form-row
                  id="discount"
                  name="discount"
                  :label="$t('discount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-discount
                      id="discount"
                      v-model="form.discountPercent"
                      name="discount"
                      :base-value="subtotal"
                      :discount-percent.sync="form.discountPercent"
                      :discount-value.sync="form.discountValue"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="tax_base"
                  name="tax_base"
                  :label="$t('tax base')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'tax_base'"
                      :name="'tax_base'"
                      :readonly="true"
                      :value="tax_base"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  name="tax"
                  :label="$t('tax')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-form-check-box
                      class="mb-0"
                      style="float:left"
                      name="tax"
                      :checked="form.typeOfTax == 'include'"
                      :description="$t('include tax')"
                      @click.native="chooseTax('include')"
                    />
                    <p-form-check-box
                      name="tax"
                      :checked="form.typeOfTax == 'exclude'"
                      :description="$t('exclude tax')"
                      @click.native="chooseTax('exclude')"
                    />
                    <p-form-number
                      :id="'total'"
                      :name="'total'"
                      :readonly="true"
                      :value="tax"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="total"
                  name="total"
                  :label="$t('total')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'total'"
                      :name="'total'"
                      :readonly="true"
                      :value="total"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr>
            <div
              v-if="form.warehouse_id"
              class="row"
            >
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
      permission="approve sales invoice"
      @choosen="chooseApprover"
    />
    <m-warehouse
      id="warehouse"
      ref="warehouse"
      @choosen="chooseWarehouse($event)"
    />
    <select-item
      ref="item"
      @choosen="chooseItem($event)"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
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
import PointTable from 'point-table-vue'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import Form from '@/utils/Form'
import SelectItem from './SelectItem'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable,
    SelectItem
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      form: new Form({
        number: null,
        warehouse_id: null,
        warehouse_name: null,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        notes: null,
        items: [],
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      })
    }
  },
  computed: {
    ...mapGetters('inventoryCorrection', ['correction']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    if (this.$route.params.id) {
      this.isLoading = true
      this.find({
        id: this.$route.params.id
      }).then(async (response) => {
        this.form.warehouse_id = response.data.warehouseId
        this.form.warehouse_name = response.data.warehouse.name
        this.form.number = response.data.form.number
        this.form.date = response.data.form.date
        this.form.notes = response.data.form.notes
        this.form.request_approval_to = response.data.form.requestApprovalToUser.id
        this.form.approver_name = response.data.form.requestApprovalToUser.fullName
        this.form.approver_email = response.data.form.requestApprovalToUser.email

        this.form.items = await this.mapItemsData(response.data.items)
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  methods: {
    ...mapActions('inventoryCorrection', ['update', 'find']),
    ...mapActions('inventoryInventoryWarehouseRecapitulation', {
      findInventoryWarehouse: 'find'
    }),
    async mapItemsData (items) {
      const mappedItems = await Promise.all(items.map(async (stockCorrectionItem) => {
        const { data: inventoryWarehouses } = await this.findInventoryWarehouse({
          itemId: stockCorrectionItem.item.id,
          params: {
            item_id: stockCorrectionItem.item.id,
            warehouse_id: this.form.warehouse_id,
            limit: 1
          }
        })
        const inventory = inventoryWarehouses.find((inventoryWarehouse) => inventoryWarehouse.id === this.form.warehouse_id)

        const mappedItem = {}
        mappedItem.id = stockCorrectionItem.id
        mappedItem.notes = stockCorrectionItem.notes
        mappedItem.production_number = stockCorrectionItem.productionNumber
        mappedItem.expiry_date = stockCorrectionItem.expiryDate
        mappedItem.item = stockCorrectionItem.item
        mappedItem.item_id = stockCorrectionItem.item.id
        mappedItem.item_name = stockCorrectionItem.item.name
        mappedItem.item_label = stockCorrectionItem.item.name
        mappedItem.stock_correction = stockCorrectionItem.quantity
        mappedItem.require_production_number = stockCorrectionItem.item.requireProductionNumber
        mappedItem.require_expiry_date = stockCorrectionItem.requireExpiryDate
        mappedItem.stock_database = parseFloat(inventory.opening_balance)
        mappedItem.units = stockCorrectionItem.item.units
        mappedItem.unit = stockCorrectionItem.unit
        mappedItem.converter = stockCorrectionItem.converter

        return mappedItem
      }))

      return mappedItems
    },
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        item_label: null,
        require_expiry_date: null,
        require_production_number: null,
        unit: null,
        converter: null,
        quantity: null,
        allocation_id: null,
        allocation_name: null,
        notes: null,
        units: [{
          label: '',
          name: '',
          converter: null
        }],
        stock_database: 0,
        stock_correction: 0,
        allocationId: null,
        allocationName: ''
      })
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    chooseWarehouse (value) {
      this.form.warehouse_id = value.id
      this.form.warehouse_name = value.name
      this.form.items = []
      this.addItemRow()
    },
    async chooseItem (item) {
      if (item.id == null) {
        this.clearItem(item.index)
        return
      }

      const { data: inventoryWarehouses } = await this.findInventoryWarehouse({
        itemId: item.id,
        params: {
          item_id: item.id,
          warehouse_id: this.form.warehouse_id,
          limit: 1
        }
      })
      const inventory = inventoryWarehouses.find((inventoryWarehouse) => inventoryWarehouse.id === this.form.warehouse_id)

      const row = this.form.items[item.index]
      row.item = item
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.stock_correction = 0
      row.require_production_number = item.require_production_number
      row.require_expiry_date = item.require_expiry_date
      row.units = item.units
      row.stock_database = parseFloat(inventory.opening_balance)
      row.stock_correction = 0
      row.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
      let isNeedNewRow = true
      this.form.items.forEach(element => {
        if (element.item_id == null) {
          isNeedNewRow = false
        }
      })
      if (isNeedNewRow) {
        this.addItemRow()
      }
    },
    clearItem (index) {
      this.form.items.splice(index, 1)
      if (this.form.items.length === 0) {
        this.addItemRow()
      }
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
    chooseAllocation (allocation) {
      const row = this.form.items[allocation.index]
      row.allocationId = allocation.id
      row.allocationName = allocation.name
    },
    onClickQuantity (row, index) {
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        row.warehouse_id = this.form.warehouse_id
        row.index = index
        this.$refs.inventory.open(row, row.quantity)
      }
    },
    updateDna (e) {
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].stock_correction = e.quantity
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval can not be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }

      const items = []
      this.form.items.forEach((item) => {
        if (item.item_id === null) { return }
        // if (item.require_expiry_date === 1 && item.require_production_number === 1) {
        //   item.dna.forEach((itemDna) => {
        //     if (parseFloat(itemDna.quantity) !== 0) {
        //       items.push({
        //         stockCorrectionItemId: item.id,
        //         itemId: itemDna.item_id,
        //         unit: itemDna.unit_reference,
        //         converter: itemDna.converter_reference,
        //         stockCorrection: itemDna.quantity,
        //         notes: item.notes,
        //         expiryDate: itemDna.expiry_date,
        //         productionNumber: itemDna.production_number,
        //         allocationId: itemDna.allocation_id
        //       })
        //     }
        //   })
        //   return
        // }

        items.push({
          stockCorrectionItemId: item.id,
          itemId: item.item_id,
          unit: item.unit,
          converter: item.converter,
          stockCorrection: item.stock_correction,
          notes: item.notes,
          expiryDate: item.expiry_date,
          productionNumber: item.production_number,
          allocationId: item.allocation_id
        })
      })

      console.log(items)

      const requestPayload = {
        id: this.correction.id,
        items,
        request_approval_to: this.form.request_approval_to,
        dueDate: this.form.date,
        warehouseId: this.form.warehouse_id,
        notes: this.form.notes
      }

      this.update(requestPayload)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/inventory/correction/' + response.data.stockCorrection.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
