<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('input')" :header="true">
        <p-block-inner :is-loading="isLoading">
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
              <td>
                <i class="btn btn-sm fa fa-times" @click="deleteFinishGoodRow(index)"></i>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addFinishGoodRow">
            <i class="fa fa-plus"/> Add
          </button>

          <p-separator></p-separator>

          <h5>{{ $t('raw materials') | titlecase }}</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
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
                <i class="btn btn-sm fa fa-times" @click="deleteMaterialRow(index)"></i>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addMaterialRow">
            <i class="fa fa-plus"/> Add
          </button>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-12">
              <h5>Approver</h5>
              <hr>
              <p-form-row
                id="approver"
                name="approver"
                :label="$t('approver')">
                <div slot="body" class="col-lg-9 mt-5">
                  <m-user
                    :id="'user'"
                    v-model="form.approver_id"
                    :errors="form.errors.get('approver_id')"
                    @errors="form.errors.set('approver_id', null)"/>
                </div>
              </p-form-row>
            </div>
          </div>

          <div class="form-group row">
            <div class="col-md-12">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
    <m-inventory-out
      ref="inventory"
      :id="'inventory'"
      :key="'inventory'"
      @updated="updateDna($event)"/>
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
      isLoading: false,
      isSaving: false,
      selectedItem: {
        item_id: 0,
        item_name: null,
        item_unit: null,
        item_unit_id: 0,
        unit: null,
        converter: 0,
        quantity: 0,
        price: 0,
        discount_value: 0,
        discount_percent: 0,
        total: 0,
        pricing_group_id: -1,
        notes: null,
        error: null,
        stock: 0,
        require_expiry_date: 0,
        require_production_number: 0,
        inventories: []
      },
      materials: [{
        row_id: 0,
        item_id: null,
        item_name: null,
        warehouse_id: null,
        warehouse_name: null,
        require_expiry_date: false,
        require_production_number: false,
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
        },
        unit: null,
        quantity: null,
        converter: null,
        inventories: []
      }],
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_machine_id: null,
        manufacture_process_id: null,
        manufacture_formula_id: null,
        manufacture_machine_name: null,
        manufacture_process_name: null,
        manufacture_formula_name: null,
        notes: null,
        approver_id: null,
        raw_materials: [],
        finished_goods: [{
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
        }]
      })
    }
  },
  computed: {
    ...mapGetters('manufactureProcess', ['process'])
  },
  methods: {
    ...mapActions('manufactureInput', ['create']),
    ...mapActions('manufactureProcess', ['find']),
    manufactureProcessRequest () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.form.manufacture_process_id = this.process.id
        this.form.manufacture_process_name = this.process.name
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    addMaterialRow () {
      this.materials.push({
        row_id: this.materials.length,
        item_id: null,
        item_name: null,
        warehouse_id: null,
        warehouse_name: null,
        require_expiry_date: false,
        require_production_number: false,
        item: {
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
        },
        unit: null,
        quantity: null,
        converter: null,
        inventories: []
      })
    },
    onClickQuantity (row) {
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        this.$refs.inventory.show(row)
      }
    },
    onClickUnit (row) {
      if (row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }

      return false
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
    deleteMaterialRow (index) {
      this.$delete(this.materials, index)
    },
    deleteFinishGoodRow (index) {
      this.$delete(this.form.finished_goods, index)
    },
    chooseManufactureMachine (value) {
      this.form.manufacture_machine_name = value
    },
    chooseMaterial (item, row) {
      row.item_name = item.name
      row.quantity = 0
      row.require_expiry_date = item.require_expiry_date
      row.require_production_number = item.require_production_number
      row.item.id = item.id
      row.item.units = item.units
      row.item.unit = item.unit
      row.inventories = []
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
    chooseWarehouseMaterial (value, row) {
      row.warehouse_name = value
      row.quantity = 0
      row.inventories = []
    },
    chooseWarehouseFinishGood (value, row) {
      row.warehouse_name = value
      row.quantity = 0
      row.inventories = []
    },
    updateDna (e) {
      this.materials.forEach(element => {
        if (element.row_id == e.rowId) {
          element.dna = e.dna
          element.quantity = e.totalQuantity
          element.unit = e.unit.label
          element.converter = e.unit.converter
        }
      })
    },
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
        })
      }
      this.form.raw_materials = []
      this.materials.forEach(material => {
        if (material.dna && material.dna.length > 0) {
          material.dna.forEach(dna => {
            let newMaterial = JSON.parse(JSON.stringify(material))
            newMaterial.expiry_date = dna.expiry_date
            newMaterial.production_number = dna.production_number
            newMaterial.quantity = dna.quantity
            this.form.raw_materials.push(newMaterial)
          })
        } else {
          this.form.raw_materials.push(material)
        }
      })
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/manufacture/process-io/' + this.id + '/input/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.manufactureProcessRequest()
  }
}
</script>
