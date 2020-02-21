<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/processing/'" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <router-link :to="'/manufacture/processing/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <div class="row">
          <div class="col-sm-12">
            <h4 class="text-center m-0">{{ $t('processing input') | uppercase }}</h4>
          </div>
        </div>
        <hr>
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
              <td>&nbsp;</td>
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
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
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
    ...mapGetters('manufactureProcess', ['process']),
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('manufactureInput', ['create']),
    addRawMaterialRow () {
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
    chooseManufactureMachine (option) {
      this.form.manufacture_machine_name = option.name
    },
    chooseApprover (value) {
      this.form.approver_name = value.label
      this.form.approver_email = value.email
    },
    chooseManufactureProcess (option) {
      this.form.manufacture_process_name = option.name
    },
    chooseMaterial (item, row) {
      console.log(item)
      row.item_name = item.name
      row.quantity = 0
      row.require_expiry_date = item.require_expiry_date
      row.require_production_number = item.require_production_number
      row.item.id = item.id
      row.item.units = item.units
      row.item.unit = item.unit
      row.inventories = []
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
      let isNeedNewRow = true
      this.form.raw_materials.forEach(element => {
        if (element.item_id == null) {
          isNeedNewRow = false
        }
      })
      if (isNeedNewRow) {
        this.addRawMaterialRow()
      }
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
      if (this.form.raw_materials.length > 1) {
        this.form.raw_materials = this.form.raw_materials.filter(item => item.item_id !== null)
      }
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/manufacture/processing/input/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
