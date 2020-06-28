<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="'/manufacture/processing/'"
        class="breadcrumb-item"
      >
        {{ $t('processing') | uppercase }}
      </router-link>
      <router-link
        :to="'/manufacture/processing/input'"
        class="breadcrumb-item"
      >
        {{ $t('input') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block>
        <div class="row">
          <div class="col-sm-12">
            <h4 class="text-center m-0">
              {{ $t('processing input') | uppercase }}
            </h4>
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            v-if="formulaId"
            id="formula"
            name="formula"
            :label="$t('formula')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              {{ formula.name }}
            </div>
          </p-form-row>
          <p-form-row
            id="process"
            name="process"
            :label="$t('process')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              <span
                class="select-link"
                @click="$refs.selectProcess.open()"
              >
                {{ form.manufacture_process_name || $t('select') | uppercase }}
              </span>
              <m-process
                id="process"
                ref="selectProcess"
                @choosen="chooseManufactureProcess"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="machine"
            name="machine"
            :label="$t('machine')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              <span
                class="select-link"
                @click="$refs.selectMachine.open()"
              >
                {{ form.manufacture_machine_name || $t('select') | uppercase }}
              </span>
              <m-machine
                id="machine"
                ref="selectMachine"
                @choosen="chooseManufactureMachine"
              />
            </div>
          </p-form-row>

          <hr>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Item
              </th>
              <th style="min-width: 120px">
                Warehouse
              </th>
              <th>Quantity</th>
              <th />
            </tr>
            <tr slot="p-body">
              <th />
              <td
                colspan="4"
                class="font-weight-bold"
              >
                {{ $t('finished goods') | uppercase }}
              </td>
            </tr>
            <tr
              v-for="(row, index) in form.finished_goods"
              slot="p-body"
              :key="'finished-goods-' + index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <span
                  class="select-link"
                  @click="$refs.itemFinishedGoods.open(index)"
                >
                  {{ row.item_label || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <span
                  class="select-link"
                  @click="$refs.warehouseFinishedGoods.open(index)"
                >
                  {{ row.warehouse_name || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <p-quantity
                  :id="'quantity-finish-goods-' + index"
                  v-model="row.quantity"
                  :name="'quantity-finish-goods-' + index"
                  :units="row.item.units"
                  :unit="row.item.units[0]"
                  @choosen="chooseUnit($event, row)"
                />
              </td>
              <td>&nbsp;</td>
            </tr>
            <tr slot="p-body">
              <th />
              <td
                colspan="4"
                class="font-weight-bold"
              >
                {{ $t('raw materials') | uppercase }}
              </td>
            </tr>
            <tr
              v-for="(row, index) in materials"
              slot="p-body"
              :key="'raw-materials-' + index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <span
                  class="select-link"
                  @click="$refs.itemRawMaterial.open(index)"
                >
                  <i
                    v-if="row.require_production_number || row.require_expiry_date"
                    class="fa fa-barcode"
                  />
                  {{ row.item_label || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <span
                  class="select-link"
                  @click="$refs.warehouseRawMaterials.open(index)"
                >
                  {{ row.warehouse_name || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <p-quantity
                  :id="'quantity-raw-material-' + index"
                  v-model="row.quantity"
                  :name="'quantity-raw-material-' + index"
                  :units="row.item.units"
                  :unit="row.item.unit"
                  :disable-unit-selection="onClickUnit(row)"
                  :readonly="onClickUnit(row)"
                  @choosen="chooseUnit($event, row)"
                  @click.native="onClickQuantity(row)"
                />
              </td>
              <td>
                <button
                  v-if="row.item_id != null"
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteMaterialRow(index)"
                >
                  <i class="fa fa-times" />
                </button>
              </td>
            </tr>
          </point-table>

          <div class="row mt-50">
            <div class="col-sm-6">
              <textarea
                v-model="form.notes"
                rows="5"
                class="form-control"
                placeholder="Notes"
              />
              <div class="d-sm-block d-md-none mt-10" />
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
              {{ authUser.full_name | uppercase }}
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
          <div class="form-group row">
            <div class="col-md-12">
              <button
                type="submit"
                class="btn btn-sm btn-primary"
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
    </form>
    <m-user
      ref="approver"
      @choosen="chooseApprover"
    />
    <m-warehouse
      id="warehouse-finished-goods"
      ref="warehouseFinishedGoods"
      name="warehouse-finished-goods"
      @choosen="chooseWarehouseFinishedGood"
    />
    <m-warehouse
      id="warehouse-raw-materials"
      ref="warehouseRawMaterials"
      name="warehouse-raw-materials"
      @choosen="chooseWarehouseRawMaterial"
    />
    <m-item
      ref="itemFinishedGoods"
      @choosen="chooseFinishedGood($event)"
    />
    <m-item
      ref="itemRawMaterial"
      @choosen="chooseRawMaterial($event)"
    />
    <m-inventory-out
      :id="'inventory'"
      ref="inventory"
      @updated="updateDna($event)"
    />
  </div>
</template>

<script>
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
      formulaId: this.$route.query.formulaId,
      isLoading: false,
      isSaving: false,
      formula: {
        name: ''
      },
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
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        raw_materials: [],
        finished_goods: [{
          item_id: null,
          item_name: null,
          warehouse_id: null,
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
  mounted () {
    if (this.authUser != null) {
      this.form.finished_goods.forEach(element => {
        element.warehouse_id = this.authUser.warehouse.id
        element.warehouse_name = this.authUser.warehouse.name
      })
    }
  },
  created () {
    if (this.formulaId) {
      this.find({
        id: this.formulaId,
        params: {
          includes: 'manufactureProcess;finishedGoods.item.units;' +
            'rawMaterials.item.units'
        }
      }).then(response => {
        this.formula = response.data
        this.form.manufacture_formula_id = response.data.id
        this.form.manufacture_formula_name = response.data.name
        this.form.manufacture_process_id = response.data.manufacture_process.id
        this.form.manufacture_process_name = response.data.manufacture_process.name
        this.form.finished_goods = response.data.finished_goods
        this.materials = response.data.raw_materials
      })
    }
  },
  methods: {
    ...mapActions('manufactureInput', ['create']),
    ...mapActions('manufactureFormula', ['find']),
    onClickQuantity (row) {
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        this.$refs.inventory.open(row)
      }
    },
    onClickUnit (row) {
      if (row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }

      return false
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
        converter: null
      })
    },
    addFinishGoodRow () {
      this.form.finished_goods.push({
        item_id: null,
        item_name: null,
        warehouse_id: null,
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
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    chooseFinishedGood (item) {
      const row = this.form.finished_goods[item.index]
      if (item.id == null) {
        this.clearItem(row)
      } else {
        row.quantity = 0
        row.item_id = item.id
        row.item_name = item.name
        row.item_label = item.label
        row.item.require_expiry_date = item.require_expiry_date
        row.item.require_production_number = item.require_production_number
        row.units = item.units
        row.units.forEach((unit, keyUnit) => {
          if (unit.id == item.unit_default_purchase) {
            row.unit = unit.label
            row.converter = unit.converter
          }
        })
        let isNeedNewRow = true
        this.form.finished_goods.forEach(element => {
          if (element.item_id == null) {
            isNeedNewRow = false
          }
        })
        if (isNeedNewRow) {
          this.addFinishGoodRow()
        }
      }
    },
    chooseRawMaterial (item) {
      const row = this.materials[item.index]
      if (item.id == null) {
        this.clearItem(row)
      } else {
        row.quantity = 0
        row.item_id = item.id
        row.item_name = item.name
        row.item_label = item.label
        row.require_expiry_date = item.require_expiry_date
        row.require_production_number = item.require_production_number
        row.units = item.units
        row.units.forEach((unit, keyUnit) => {
          if (unit.id == item.unit_default_purchase) {
            row.unit = unit.label
            row.converter = unit.converter
          }
        })
        let isNeedNewRow = true
        this.materials.forEach(element => {
          if (element.item_id == null) {
            isNeedNewRow = false
          }
        })
        if (isNeedNewRow) {
          this.addMaterialRow()
        }
      }
    },
    chooseWarehouseFinishedGood (option) {
      const row = this.form.finished_goods[option.index]
      row.warehouse_id = option.id
      row.warehouse_name = option.name
      row.quantity = 0
    },
    chooseWarehouseRawMaterial (option) {
      const row = this.materials[option.index]
      row.warehouse_id = option.id
      row.warehouse_name = option.name
      row.quantity = 0
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
            const newMaterial = JSON.parse(JSON.stringify(material))
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
          let json = ''
          if (error.errors) {
            json = '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>'
          }
          this.$alert.error('Error Message', error.message + json)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
