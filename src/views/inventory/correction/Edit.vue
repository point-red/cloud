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
                <h4>{{ $t('stock correction') | uppercase }}</h4>
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
                    <span
                      class="select-link"
                      @click="$refs.item.open(index)"
                    >
                      {{ row.item_label || $t('select') | uppercase }}
                    </span>
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
                      :name="'item-notes' + index"
                      :disabled="row.item_id == null"
                    />
                  </td>
                  <td>
                    <span
                      v-if="row.item_id != null"
                      class="select-link"
                      @click="$refs.allocation.open(index)"
                    >{{ row.allocationName || 'select' | uppercase }}</span><br>
                  </td>
                </tr>
              </template>
            </point-table>
            <hr>
            <div
              v-if="form.warehouse_id"
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
              <div class="row col-sm-6 align-items-end m-0 p-0">
                <div class="row col-12 m-0 p-0">
                  <div class="col-6 text-center">
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
                  <div class="col-6 text-center">
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
      :warehouse-id="form.warehouse_id"
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
    ...mapGetters('inventoryCorrection', ['stockCorrection']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    if (this.$route.params.id) {
      this.isLoading = true
      this.find({
        id: this.$route.params.id
      }).then(async (response) => {
        this.form.id = response.data.form.id
        this.form.warehouse_id = response.data.warehouseId
        this.form.warehouse_name = response.data.warehouse.name
        this.form.number = response.data.form.number
        this.form.date = response.data.form.date
        this.form.notes = response.data.form.notes
        this.form.request_approval_to = response.data.form.requestApprovalToUser.id
        this.form.approver_name = response.data.form.requestApprovalToUser.fullName
        this.form.approver_email = response.data.form.requestApprovalToUser.email

        this.form.items = await this.mapItemsData(response.data.items)
        this.addItemRow()
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
    async mapItemsData (stockCorrectionItems) {
      const stockCorrectionItemIds = [...new Set(stockCorrectionItems.map(stockCorrectionItem => stockCorrectionItem.itemId))]
      const mappedItems = await Promise.all(stockCorrectionItemIds.map(async (stockCorrectionItemId) => {
        const selectedItems = stockCorrectionItems.filter(stockCorrectionItem => stockCorrectionItem.itemId === stockCorrectionItemId)

        // without DNA
        if (!selectedItems[0].item.requireExpiryDate && !selectedItems[0].item.requireProductionNumber) {
          const selectedItem = selectedItems[0]
          const { data: inventoryWarehouses } = await this.findInventoryWarehouse({
            itemId: selectedItem.item.id,
            params: {
              item_id: selectedItem.item.id,
              warehouse_id: this.form.warehouse_id,
              limit: 1
            }
          })
          const inventory = inventoryWarehouses.find((inventoryWarehouse) => inventoryWarehouse.id === this.form.warehouse_id)
          const unit = selectedItem.item.units.find(unit => unit.converter === 1)
          selectedItem.item = {
            ...selectedItem.item,
            unit,
            require_expiry_date: selectedItem.item.requireExpiryDate,
            require_production_number: selectedItem.item.requireProductionNumber,
            warehouse_id: this.form.warehouse_id
          }

          return {
            id: selectedItem.id,
            notes: selectedItem.notes,
            production_number: selectedItem.productionNumber,
            expiry_date: selectedItem.expiryDate,
            item: selectedItem.item,
            item_id: selectedItem.item.id,
            item_name: selectedItem.item.name,
            item_label: selectedItem.item.label,
            stock_correction: selectedItem.quantity,
            require_production_number: selectedItem.item.requireProductionNumber,
            require_expiry_date: selectedItem.item.requireExpiryDate,
            stock_database: parseFloat(inventory.opening_balance),
            units: selectedItem.item.units,
            unit: selectedItem.unit,
            converter: selectedItem.converter,
            allocationId: selectedItem.allocation && selectedItem.allocation.id,
            allocationName: selectedItem.allocation && selectedItem.allocation.name
          }
        }

        // with DNA
        const dna = selectedItems.map((selectedItem) => {
          return {
            id: selectedItem.id,
            form_id: this.form.id,
            warehouse_id: this.warehouse_id,
            item_id: selectedItem.itemId,
            quantity: selectedItem.quantity,
            expiry_date: selectedItem.expiryDate,
            production_number: selectedItem.productionNumber,
            unit_reference: selectedItem.unit,
            converter_reference: selectedItem.converter,
            remaining: 0,
            remainingInUnit: 0
          }
        })

        const selectedItem = selectedItems[0]
        const { data: inventoryWarehouses } = await this.findInventoryWarehouse({
          itemId: selectedItem.item.id,
          params: {
            item_id: selectedItem.item.id,
            warehouse_id: this.form.warehouse_id,
            limit: 1
          }
        })
        const inventory = inventoryWarehouses.find((inventoryWarehouse) => inventoryWarehouse.id === this.form.warehouse_id)
        const unit = selectedItem.item.units.find(unit => unit.converter === 1)
        selectedItem.item = {
          ...selectedItem.item,
          unit,
          require_expiry_date: selectedItem.item.requireExpiryDate,
          require_production_number: selectedItem.item.requireProductionNumber,
          warehouse_id: this.form.warehouse_id
        }

        const totalQuantity = dna.reduce((prev, current) => {
          return prev + current.quantity
        }, 0)

        return {
          notes: selectedItem.notes,
          production_number: selectedItem.productionNumber,
          expiry_date: selectedItem.expiryDate,
          item: selectedItem.item,
          item_id: selectedItem.item.id,
          item_name: selectedItem.item.name,
          item_label: selectedItem.item.label,
          stock_correction: totalQuantity,
          require_production_number: selectedItem.item.requireProductionNumber,
          require_expiry_date: selectedItem.item.requireExpiryDate,
          stock_database: parseFloat(inventory.opening_balance),
          units: selectedItem.item.units,
          unit: selectedItem.unit,
          converter: selectedItem.converter,
          dna,
          allocationId: selectedItem.allocation && selectedItem.allocation.id,
          allocationName: selectedItem.allocation && selectedItem.allocation.name
        }
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

      const isAlreadyAdded = this.form.items.find((formItem) => formItem.item_id === item.id)
      if (isAlreadyAdded) {
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
        // with dna
        if (item.require_expiry_date || item.require_production_number) {
          item.dna.forEach((itemDna) => {
            if (parseFloat(itemDna.quantity) !== 0) {
              items.push({
                itemId: itemDna.item_id,
                unit: itemDna.unit_reference,
                converter: itemDna.converter_reference,
                stockCorrection: itemDna.quantity,
                notes: item.notes,
                expiryDate: itemDna.expiry_date,
                allocationId: item.allocationId,
                ...(itemDna.expiry_date ? { expiryDate: itemDna.expiry_date } : { expiryDate: null }),
                ...(itemDna.production_number ? { productionNumber: itemDna.production_number } : { productionNumber: null })
              })
            }
          })
          return
        }

        // without dna
        items.push({
          itemId: item.item_id,
          unit: item.unit,
          converter: item.converter,
          stockCorrection: item.stock_correction,
          notes: item.notes,
          expiryDate: item.expiry_date,
          productionNumber: item.production_number,
          allocationId: item.allocationId
        })
      })

      const requestPayload = {
        id: this.stockCorrection.id,
        items,
        dueDate: this.form.date,
        notes: this.form.notes,
        requestApprovalTo: this.form.request_approval_to
      }

      this.update(requestPayload)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/inventory/correction/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
