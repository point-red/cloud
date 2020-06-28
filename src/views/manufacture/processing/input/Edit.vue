<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="'/manufacture/processing'"
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
      <router-link
        :to="{ name: 'manufacture.processing.input.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ input.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
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
            id="process"
            name="process"
            :label="$t('process')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              <m-process
                id="process"
                v-model="form.manufacture_process_id"
                :label="form.manufacture_process_name"
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
              <m-machine
                id="machine"
                v-model="form.manufacture_machine_id"
                :label="form.manufacture_machine_name"
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
                <m-item
                  :id="'item-finished-' + index"
                  v-model="row.item_id"
                  :data-index="index"
                  :label="row.item_name"
                  @choosen="chooseFinishedGood($event, row)"
                />
              </td>
              <td>
                <m-warehouse
                  :id="'warehouse-finished-' + index"
                  v-model="row.warehouse_id"
                  :data-index="index"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouse($event, row)"
                />
              </td>
              <td>
                <p-quantity
                  :id="'quantity-finished-goods-' + index"
                  v-model="row.quantity"
                  :name="'quantity-finished-goods-' + index"
                  :units="row.item.units"
                  :unit="{
                    label: row.unit,
                    name: row.unit,
                    converter: row.converter
                  }"
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
                <m-item
                  :id="'item-raw-' + index"
                  v-model="row.item_id"
                  :data-index="index"
                  :label="row.item_name"
                  @clear="clearMaterial(row)"
                  @choosen="chooseMaterial($event, row)"
                />
              </td>
              <td>
                <m-warehouse
                  :id="'warehouse-raw-' + index"
                  v-model="row.warehouse_id"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouse($event, row)"
                />
              </td>
              <td>
                <p-quantity
                  :id="'quantity-raw-material-' + index"
                  v-model="row.quantity"
                  :name="'quantity-raw-material-' + index"
                  :units="row.item.units"
                  :unit="{
                    label: row.unit,
                    name: row.unit,
                    converter: row.converter
                  }"
                  :disable-unit-selection="onClickUnit(row)"
                  :readonly="onClickUnit(row)"
                  @choosen="chooseUnit($event, row)"
                  @click.native="onClickQuantity(row)"
                />
              </td>
              <td>
                <button
                  v-if="index > 0"
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
              <m-user
                :id="'user'"
                v-model="form.request_approval_to"
                :label="form.approver_name"
                :errors="form.errors.get('request_approval_to')"
                @errors="form.errors.set('request_approval_to', null)"
                @choosen="chooseApprover"
              />
              {{ form.approver_email }} <br v-if="form.approver_email">
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
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false,
      materials: [],
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
    ...mapGetters('manufactureInput', ['input']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.find({
      id: this.id,
      params: {
        join: 'form',
        fields: 'manufacture_inputs.*',
        includes: 'form;' +
          'manufactureMachine;' +
          'rawMaterials.item.units;' +
          'finishedGoods.item.units;' +
          'rawMaterials.warehouse;' +
          'finishedGoods.warehouse;' +
          'form.requestApprovalTo'
      }
    }).then(response => {
      this.form.id = response.data.id
      this.form.date = response.data.form.date
      this.form.notes = response.data.form.notes
      this.form.manufacture_machine_id = response.data.manufacture_machine_id
      this.form.manufacture_process_id = response.data.manufacture_process_id
      this.form.manufacture_formula_id = response.data.manufacture_formula_id
      this.form.manufacture_machine_name = response.data.manufacture_machine_name
      this.form.manufacture_process_name = response.data.manufacture_process_name
      this.form.manufacture_formula_name = response.data.manufacture_formula_name
      this.form.finished_goods = response.data.finished_goods
      this.form.request_approval_to = response.data.form.request_approval_to.id
      this.form.approver_name = response.data.form.request_approval_to.full_name
      this.form.approver_email = response.data.form.request_approval_to.email
      response.data.raw_materials.forEach(rawMaterial => {
        rawMaterial.row_id = this.materials.length
        rawMaterial.item.unit = {
          label: rawMaterial.unit,
          name: rawMaterial.unit,
          converter: rawMaterial.converter
        }

        if (rawMaterial.item.require_expiry_date || rawMaterial.item.require_production_number) {
          const foundIndex = this.materials.findIndex(o =>
            o.item_id === rawMaterial.item_id &&
            o.warehouse_id === rawMaterial.warehouse_id
          )

          if (foundIndex == -1) {
            rawMaterial.dna = []
            rawMaterial.dna.push({
              item_id: rawMaterial.item_id,
              quantity: rawMaterial.quantity,
              expiry_date: rawMaterial.expiry_date,
              production_number: rawMaterial.production_number
            })
            this.materials.push(rawMaterial)
          } else {
            var material = this.materials[foundIndex]
            material.quantity += rawMaterial.quantity
            material.dna.push({
              item_id: rawMaterial.item_id,
              quantity: rawMaterial.quantity,
              expiry_date: rawMaterial.expiry_date,
              production_number: rawMaterial.production_number
            })
            this.materials[foundIndex] = material
          }
        } else {
          this.materials.push(rawMaterial)
        }
      })
      this.addMaterialRow()
    })
  },
  methods: {
    ...mapActions('manufactureInput', ['find', 'update']),
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
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    onClickQuantity (row) {
      if (row.item.require_expiry_date == 1 || row.item.require_production_number == 1) {
        this.$refs.inventory.show(row)
      }
    },
    onClickUnit (row) {
      if (row.item_id == null || row.item.require_expiry_date === 1 || row.item.require_production_number === 1) {
        return true
      }

      return false
    },
    clearMaterial (row) {
      row.item_id = null
      row.item_name = null
      row.unit = null
      row.converter = null
      row.quantity = null
      row.price = null
      row.allocation_id = null
      row.notes = null
      row.more = false
      row.units = []
    },
    addFinishedGoodRow () {
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
        this.addMaterialRow()
      }
    },
    chooseFinishedGood (item, row) {
      row.item_name = item.name
      row.quantity = 0
      row.item.require_expiry_date = item.require_expiry_date
      row.item.require_production_number = item.require_production_number
      row.item.units = item.units
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseWarehouse (option, row) {
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
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
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
