<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/processing/' + id" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <router-link :to="'/manufacture/processing/' + id + '/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('use formula') | uppercase }}</span>
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
              <th width="50px">#</th>
              <th style="min-width: 120px">Item</th>
              <th style="min-width: 120px">Warehouse</th>
              <th width="50px"></th>
              <th>Quantity</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.finished_goods" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                  {{ row.item.label }}
                </router-link>
              </td>
              <td>
                <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                  {{ row.warehouse.name }}
                </router-link>
              </td>
              <td width="50px"></td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.item.units[0].label"
                  @input="quantityChange($event, row)"/>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h5>{{ $t('raw materials') | titlecase }}</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th style="min-width: 120px">Item</th>
              <th style="min-width: 120px">Warehouse</th>
              <th width="50px">&nbsp;</th>
              <th>Quantity</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.raw_materials_temporary" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                  {{ row.item.label }}
                </router-link>
              </td>
              <td>
                <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                  {{ row.warehouse.name }}
                </router-link>
              </td>
              <td>
                <m-inventory-out
                  :id="'inventory-' + index"
                  :itemId="row.item_id"
                  :itemUnit="row.item.units[0]"
                  :requireExpiryDate="row.item.require_expiry_date"
                  :requireProductionNumber="row.item.require_production_number"
                  :warehouseId="row.warehouse_id"
                  :value="row.quantity"
                  :inventories="row.inventories"
                  @add="addInventory($event, row)"
                  v-if="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1) && row.item_id && row.warehouse_id"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.unit"
                  :readonly="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1)"/>
              </td>
            </tr>
          </point-table>

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
      formulaId: this.$route.params.formulaId,
      isLoading: false,
      isSaving: false,
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
        raw_materials_temporary: [],
        raw_materials: [],
        finished_goods: []
      })
    }
  },
  computed: {
    ...mapGetters('manufactureFormula', ['formula'])
  },
  methods: {
    ...mapActions('manufactureInput', ['create']),
    ...mapActions('manufactureFormula', ['find']),
    manufactureFormulaRequest () {
      this.isLoading = true
      this.find({
        id: this.formulaId,
        params: {
          with_archives: true,
          includes: 'rawMaterials.item.units;finishedGoods.item.units;rawMaterials.warehouse;finishedGoods.warehouse'
        }
      }).then(response => {
        this.form.manufacture_process_id = this.formula.manufacture_process_id
        this.form.manufacture_process_name = this.formula.manufacture_process_name
        this.form.manufacture_formula_id = this.formula.id
        this.form.manufacture_formula_name = this.formula.name
        for (let index in this.formula.raw_materials) {
          var rawMaterials = this.formula.raw_materials[index]
          rawMaterials.original_quantity = rawMaterials.quantity
          rawMaterials.item.units.forEach((unit, keyUnit) => {
            if (unit.converter == 1) {
              rawMaterials.converter = unit.converter
            }
          })
          rawMaterials.inventories = []
          this.form.raw_materials_temporary.push(rawMaterials)
        }
        for (let index in this.formula.finished_goods) {
          var finishedGoods = this.formula.finished_goods[index]
          finishedGoods.original_quantity = finishedGoods.quantity
          finishedGoods.item.units.forEach((unit, keyUnit) => {
            if (unit.converter == 1) {
              finishedGoods.converter = unit.converter
            }
          })
          this.form.finished_goods.push(finishedGoods)
        }
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    chooseManufactureMachine (value) {
      this.form.manufacture_machine_name = value
    },
    quantityChange (quantity, row) {
      for (let index in this.form.raw_materials_temporary) {
        this.form.raw_materials_temporary[index].quantity = this.form.raw_materials_temporary[index].original_quantity * (row.quantity / row.original_quantity)
        this.form.raw_materials_temporary[index].inventories = []
      }
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
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
        })
        return
      }
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/manufacture/processing/' + this.id + '/input/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.manufactureFormulaRequest()
  }
}
</script>
