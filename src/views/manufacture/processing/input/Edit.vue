<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/processing'" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <router-link :to="'/manufacture/processing/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <router-link :to="{ name: 'manufacture.processing.input.show', params: { id: id, inputId: inputId }}" class="breadcrumb-item">{{ input.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="process"
            name="process"
            :label="$t('process')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-process id="process" v-model="form.manufacture_process_id" @choosen="chooseManufactureProcess" :label="form.manufacture_process_name"/>
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
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Finished Goods</th>
              <th style="min-width: 120px">Warehouse</th>
              <th>Quantity</th>
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
                <m-warehouse
                  :id="'warehouse-finish-' + index"
                  :data-index="index"
                  v-model="row.warehouse_id"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouseFinishGood($event, row)"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity-finish-goods-' + index"
                  :name="'quantity-finish-goods-' + index"
                  v-model="row.quantity"
                  :units="row.item.units"
                  :unit="row.item.units[0]"/>
              </td>
              <td></td>
            </tr>
          </point-table>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Raw Material</th>
              <th style="min-width: 120px">Warehouse</th>
              <th>Quantity</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in materials" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-raw-' + index"
                  :data-index="index"
                  v-model="row.item_id"
                  :label="row.item_name"
                  @choosen="chooseMaterial($event, row)"/>
              </td>
              <td>
                <m-warehouse
                  :id="'warehouse-raw-' + index"
                  :data-index="index"
                  v-model="row.warehouse_id"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouseMaterial($event, row)"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity-raw-material-' + index"
                  :name="'quantity-raw-material-' + index"
                  v-model="row.quantity"
                  :units="row.item.units"
                  :unit="row.item.unit"
                  @click.native="onClickQuantity(row)"
                  :disable-unit-selection="onClickUnit(row)"
                  :readonly="onClickUnit(row)"/>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-danger" v-if="row.item_id != null" @click="deleteRawMaterialRow(index)">
                  <i class="fa fa-times"></i>
                </button>
              </td>
            </tr>
          </point-table>

          <div class="row mt-50">
            <div class="col-sm-6">
              <textarea rows="5" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ Date.now() | dateFormat('DD MMMM YYYY') }}</div>
              {{ authUser.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">_______________</div>
              <m-user
                :id="'user'"
                v-model="form.approver_id"
                :errors="form.errors.get('approver_id')"
                @errors="form.errors.set('approver_id', null)"
                @choosen="chooseApprover"/>
                {{ form.approver_email }} <br v-if="form.approver_email">
            </div>
          </div>
          <hr>
          <div class="form-group row">
            <div class="col-md-12">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
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
import TabMenu from '../TabMenu'
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
      }),
      materials: [{
        row_id: 0,
        item_id: null,
        item_name: null,
        warehouse_id: null,
        warehouse_name: null,
        require_expiry_date: false,
        require_production_number: false,
        unit: null,
        quantity: null,
        converter: null,
        inventories: [],
        item: {
          require_expiry_date: false,
          require_production_number: false,
          units: [{
            label: '',
            name: '',
            converter: null
          }],
          unit: {
            label: '',
            name: '',
            converter: null
          }
        }
      }]
    }
  },
  computed: {
    ...mapGetters('manufactureInput', ['input']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.inputId,
      params: {
        includes: 'manufactureMachine;' +
          'rawMaterials.item.units;' +
          'finishedGoods.item.units;' +
          'form.approvals.requestedBy;' +
          'form.approvals.requestedTo;' +
          'rawMaterials.warehouse;' +
          'finishedGoods.warehouse'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/manufacture/processing/' + this.id + '/input/' + response.data.id)
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
    chooseApprover (value) {
      this.form.approver_name = value.label
      this.form.approver_email = value.email
    },
    chooseManufactureProcess (option) {
      this.form.manufacture_process_name = option.name
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
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Update success')
          this.$router.push('/manufacture/processing/input/' + response.data.id)
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
