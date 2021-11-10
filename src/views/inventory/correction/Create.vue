<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <router-link
        to="/inventory/correction"
        class="breadcrumb-item"
      >
        {{ $t('correction') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
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
                    <td class="font-weight-bold">
                      {{ $t('warehouse') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.warehouse.open()"
                      >
                        <template v-if="form.warehouseId !== null && form.warehouseName !== null">
                          {{ form.warehouseName }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <hr>
            <point-table v-if="form.warehouseId">
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
                      {{ row.itemLabel || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'stock-database' + index"
                      v-model="row.stockDatabase"
                      :name="'stock-database' + index"
                      :item-id="row.itemId"
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
                      v-model="row.stockCorrection"
                      :name="'stock-correction' + index"
                      :disabled="row.itemId == null"
                      :item-id="row.itemId"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      disable-unit-selection
                      @choosen="chooseUnit($event, row)"
                    />
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'stock-balance' + index"
                      :value="parseFloat(row.stockDatabase) + parseFloat(row.stockCorrection)"
                      :name="'stock-balance' + index"
                      :item-id="row.itemId"
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
                      :disabled="row.itemId == null"
                      :name="'item-notes' + index"
                    />
                  </td>
                  <td>
                    <span
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
              v-if="form.warehouseId"
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
                >{{ form.approverName || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approverEmail | uppercase }}</span>
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
        warehouseId: null,
        warehouseName: null,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        notes: null,
        items: [],
        requestApprovalTo: null,
        approverName: null,
        approverEmail: null
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('inventoryCorrection', ['create']),
    ...mapActions('inventoryInventoryWarehouseRecapitulation', {
      findInventoryWarehouse: 'find'
    }),
    addItemRow () {
      this.form.items.push({
        itemId: null,
        itemName: null,
        unit: null,
        converter: null,
        stockDatabase: 0,
        stockCorrection: 0,
        notes: null,
        allocationId: null,
        allocationName: ''
      })
    },
    chooseApprover (value) {
      this.form.requestApprovalTo = value.id
      this.form.approverName = value.fullName
      this.form.approverEmail = value.email
    },
    chooseWarehouse (value) {
      this.form.warehouseId = value.id
      this.form.warehouseName = value.name
      this.form.items = []
      this.addItemRow()
    },
    async chooseItem (item) {
      const { data: inventoryWarehouses } = await this.findInventoryWarehouse({
        itemId: item.id,
        params: {
          item_id: item.id,
          warehouse_id: this.form.warehouseId,
          limit: 1
        }
      })

      const inventory = inventoryWarehouses.find((inventoryWarehouse) => inventoryWarehouse.id === this.form.warehouseId)

      if (item.id == null) {
        this.clearItem(item.index)
        return
      }

      const row = this.form.items[item.index]
      row.itemId = item.id
      row.itemName = item.name
      row.itemLabel = item.label
      row.units = item.units
      row.stockCorrection = 0
      row.stockDatabase = parseFloat(inventory.opening_balance)
      row.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
      let isNeedNewRow = true
      this.form.items.forEach(element => {
        if (element.itemId == null) {
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
    onSubmit () {
      this.isSaving = true
      if (this.form.requestApprovalTo == null) {
        this.$notification.error('approval can not be null')
        this.isSaving = false
        this.form.errors.record({
          requestApprovalTo: ['Approver should not empty']
        })
        return
      }

      const items = this.form.items.map((item) => {
        return {
          itemId: item.itemId,
          unit: item.unit,
          converter: item.converter,
          stockCorrection: item.stockCorrection,
          notes: item.notes,
          expiryDate: item.expiryDate,
          productionNumber: item.productionNumber
        }
      })
      const requestPayload = {
        formId: this.referenceForm.id,
        items,
        requestApprovalTo: this.form.requestApprovalTo,
        dueDate: this.form.date,
        warehouseId: this.form.warehouseId,
        notes: this.form.notes
      }

      this.create(requestPayload)
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
