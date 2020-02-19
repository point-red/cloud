<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <router-link :to="{ name: 'manufacture.process.io.input.show', params: { id: id, inputId: inputId }}" class="breadcrumb-item">{{ input.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('input')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="input.form.number">
                {{ input.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ input.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="machine"
            name="machine"
            :label="$t('machine')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-machine id="machine" v-model="form.manufacture_machine_id" @choosen="chooseManufactureMachine" :label="form.manufacture_machine_name"/>
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')"
            v-model="form.notes"
            :disabled="isSaving"
            :errors="form.errors.get('notes')"
            @errors="form.errors.set('notes', null)"/>

          <p-separator></p-separator>

          <h5>{{ $t('finished goods') | titlecase }}</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th>Quantity</th>
              <th style="min-width: 120px">Warehouse</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.finished_goods" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-finish-' + index"
                  :data-index="index"
                  v-model="row.item_id"
                  :label="row.item_name"
                  @choosen="chooseFinishGood($event, row)"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.item.units[0].label"/>
              </td>
              <td>
                <m-warehouse
                  :id="'warehouse-finish-' + index"
                  :data-index="index"
                  v-model="row.warehouse_id"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouseFinishGood($event, row)"/>
              </td>
              <td>
                <i class="btn btn-sm fa fa-times" @click="deleteFinishGoodRow(index)"></i>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addFinishGoodRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button>

          <p-separator></p-separator>

          <h5>{{ $t('raw materials') | titlecase }}</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th>&nbsp;</th>
              <th>Quantity</th>
              <th style="min-width: 120px">Warehouse</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.raw_materials_temporary" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-raw-' + index"
                  :data-index="index"
                  v-model="row.item_id"
                  :label="row.item_name"
                  @choosen="chooseRawMaterial($event, row)"/>
              </td>
              <td>
                <m-inventory-out
                  :id="'inventory-' + index"
                  :itemId="row.item_id"
                  :itemUnit="row.item.units[0]"
                  :requireExpiryDate="row.item.require_expiry_date"
                  :requireProductionNumber="row.item.require_production_number"
                  :warehouseId="row.warehouse_id"
                  :inventories="row.inventories"
                  @add="addInventory($event, row)"
                  v-if="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1) && row.item_id && row.warehouse_id"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.item.units[0].label"
                  :readonly="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1)"/>
              </td>
              <td>
                <m-warehouse
                  :id="'warehouse-raw-' + index"
                  :data-index="index"
                  v-model="row.warehouse_id"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouseRawMaterial($event, row)"/>
              </td>
              <td>
                <i class="btn btn-sm fa fa-times" @click="deleteRawMaterialRow(index)"></i>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addRawMaterialRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button>

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
import debounce from 'lodash/debounce'
import ManufactureMenu from '../../Menu'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbManufacture
  },
  data () {
    return {
      id: this.$route.params.id,
      inputId: this.$route.params.inputId,
      isLoading: false,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        id: this.$route.params.inputId,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_machine_id: null,
        manufacture_process_id: null,
        manufacture_formula_id: null,
        manufacture_machine_name: null,
        manufacture_process_name: null,
        manufacture_formula_name: null,
        notes: null,
        approver_id: null,
        raw_materials_temporary: [],
        raw_materials: [],
        finished_goods: []
      })
    }
  },
  computed: {
    ...mapGetters('manufactureInput', ['input'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.inputId,
      params: {
        includes: 'manufactureMachine;rawMaterials.item.units;finishedGoods.item.units;form.approvals.requestedBy;form.approvals.requestedTo;rawMaterials.warehouse;finishedGoods.warehouse'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/manufacture/process-io/' + this.id + '/input/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = new Date(response.data.form.date)
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.manufacture_machine_id = response.data.manufacture_machine_id
      this.form.manufacture_process_id = response.data.manufacture_process_id
      this.form.manufacture_formula_id = response.data.manufacture_formula_id
      this.form.manufacture_machine_name = response.data.manufacture_machine_name
      this.form.manufacture_process_name = response.data.manufacture_process_name
      this.form.manufacture_formula_name = response.data.manufacture_formula_name
      this.form.notes = response.data.form.notes
      response.data.finished_goods.forEach((item, keyItem) => {
        this.form.finished_goods.push({
          item_id: item.item_id,
          warehouse_id: item.warehouse_id,
          item_name: item.item_name,
          warehouse_name: item.warehouse_name,
          quantity: item.quantity,
          unit: item.unit,
          item: item.item,
          converter: item.converter
        })
      })
      response.data.raw_materials.forEach((item, keyItem) => {
        this.form.raw_materials.push({
          item_id: item.item_id,
          warehouse_id: item.warehouse_id,
          item_name: item.item_name,
          warehouse_name: item.warehouse_name,
          quantity: item.quantity,
          expiry_date: item.expiry_date,
          production_number: item.production_number,
          unit: item.unit,
          item: item.item,
          converter: item.converter
        })
      })
      for (let index in this.form.raw_materials) {
        let rawMaterial = this.form.raw_materials[index]
        let rawMaterialTemporaryIndex = this.form.raw_materials_temporary.findIndex(o => o.item_id === rawMaterial.item_id && o.warehouse_id === rawMaterial.warehouse_id)
        if (rawMaterialTemporaryIndex < 0) {
          var newItem = Object.assign({}, rawMaterial)
          newItem.inventories = []
          newItem.inventories.push({
            'quantity': rawMaterial.quantity,
            'expiry_date': rawMaterial.expiry_date,
            'production_number': rawMaterial.production_number
          })
          this.form.raw_materials_temporary.push(newItem)
        } else {
          var existing = this.form.raw_materials_temporary[rawMaterialTemporaryIndex]
          existing.quantity += rawMaterial.quantity
          existing.inventories.push({
            'quantity': rawMaterial.quantity,
            'expiry_date': rawMaterial.expiry_date,
            'production_number': rawMaterial.production_number
          })
          this.form.raw_materials_temporary[rawMaterialTemporaryIndex] = existing
        }
      }
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('manufactureInput', ['find', 'update']),
    addRawMaterialRow () {
      this.form.raw_materials_temporary.push({
        item_id: null,
        warehouse_id: null,
        item_name: null,
        warehouse_name: null,
        item: {
          require_expiry_date: false,
          require_production_number: false,
          units: [{
            label: '',
            name: '',
            converter: null
          }]
        },
        unit: null,
        quantity: null,
        converter: null,
        inventories: []
      })
    },
    addFinishGoodRow () {
      this.form.finished_goods.push({
        item_id: null,
        warehouse_id: null,
        item_name: null,
        warehouse_name: null,
        item: {
          require_expiry_date: false,
          require_production_number: false,
          units: [{
            label: '',
            name: '',
            converter: null
          }]
        },
        unit: null,
        quantity: null,
        converter: null
      })
    },
    deleteRawMaterialRow (index) {
      this.$delete(this.form.raw_materials_temporary, index)
    },
    deleteFinishGoodRow (index) {
      this.$delete(this.form.finished_goods, index)
    },
    chooseManufactureMachine (value) {
      this.form.manufacture_machine_name = value
    },
    chooseRawMaterial (item, row) {
      row.item_name = item.name
      row.quantity = 0
      row.item.require_expiry_date = item.require_expiry_date
      row.item.require_production_number = item.require_production_number
      row.item.units = item.units
      row.inventories = []
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseFinishGood (item, row) {
      row.item_name = item.name
      row.quantity = 0
      row.item.require_expiry_date = item.require_expiry_date
      row.item.require_production_number = item.require_production_number
      row.item.units = item.units
      row.inventories = []
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseWarehouseRawMaterial (value, row) {
      row.warehouse_name = value
      row.quantity = 0
      row.inventories = []
    },
    chooseWarehouseFinishGood (value, row) {
      row.warehouse_name = value
      row.quantity = 0
      row.inventories = []
    },
    addInventory (value, row) {
      row.quantity = value.quantity
      row.inventories = value.inventories
    },
    setRawMaterials () {
      this.form.raw_materials = []
      for (let index in this.form.raw_materials_temporary) {
        let rawMaterial = this.form.raw_materials_temporary[index]
        if (rawMaterial['inventories'].length > 0) {
          for (let indexInventory in rawMaterial['inventories']) {
            let inventory = rawMaterial['inventories'][indexInventory]
            if (inventory['quantity']) {
              var inputRawMaterial = Object.assign({}, rawMaterial)
              inputRawMaterial.quantity = inventory['quantity']
              inputRawMaterial.expiry_date = inventory['expiry_date']
              inputRawMaterial.production_number = inventory['production_number']
              this.form.raw_materials.push(inputRawMaterial)
            }
          }
        } else {
          this.form.raw_materials.push(rawMaterial)
        }
      }
    },
    onSubmit () {
      this.isSaving = true
      this.setRawMaterials()
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Update success')
          this.$router.push('/manufacture/process-io/' + this.id + '/input/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
