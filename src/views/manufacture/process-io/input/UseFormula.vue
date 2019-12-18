<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | titlecase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/input'" class="breadcrumb-item">{{ $t('input') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Use Formula</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('input')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="date"
                name="date"
                label="Date"
                v-model="form.date"
                :errors="form.errors.get('date')"
                @errors="form.errors.set('date', null)"/>
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

          <h3>{{ $t('finished goods') | titlecase }}</h3>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th>Quantity</th>
              <th style="min-width: 120px">Warehouse</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.finish_goods" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.item_name }}</td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.finish_goods[index].quantity"
                  :unit="form.finish_goods[index].item.units[0].label"
                  @input="quantityChange"/>
              </td>
              <td>{{ row.warehouse_name}}</td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h3>{{ $t('raw materials') | titlecase }}</h3>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th>&nbsp;</th>
              <th>Quantity</th>
              <th style="min-width: 120px">Warehouse</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.raw_materials" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.item_name }}</td>
              <td>
                <m-inventory-out :id="'inventory-' + index" :itemId="row.item_id" :value="form.raw_materials[index].quantity" :shouldChange="form.raw_materials[index].should_change" @add="addInventory($event, row)" v-if="(form.raw_materials[index].item.require_production_number === 1 || form.raw_materials[index].item.require_expiry_date === 1)"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.raw_materials[index].quantity"
                  :unit="form.raw_materials[index].unit"
                  :readonly="(form.raw_materials[index].item.require_production_number === 1 || form.raw_materials[index].item.require_expiry_date === 1)"/>
              </td>
              <td>{{ row.warehouse_name}}</td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-12">
              <h3>Approver</h3>
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
        date: new Date(),
        manufacture_machine_id: null,
        manufacture_process_id: null,
        manufacture_formula_id: null,
        manufacture_machine_name: null,
        manufacture_process_name: null,
        manufacture_formula_name: null,
        notes: null,
        approver_id: null,
        raw_materials: [],
        finish_goods: []
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
          includes: 'rawMaterials.item.units;finishGoods.item.units;rawMaterials.warehouse;finishGoods.warehouse'
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
          rawMaterials.should_change = true
          this.form.raw_materials.push(rawMaterials)
        }
        for (let index in this.formula.finish_goods) {
          var finishGoods = this.formula.finish_goods[index]
          finishGoods.item.units.forEach((unit, keyUnit) => {
            if (unit.converter == 1) {
              finishGoods.converter = unit.converter
            }
          })
          this.form.finish_goods.push(finishGoods)
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
    quantityChange (quantity) {
      for (let index in this.formula.raw_materials) {
        this.form.raw_materials[index].quantity = this.form.raw_materials[index].original_quantity * quantity
        this.form.raw_materials[index].should_change = true
      }
    },
    addInventory (value, row) {
      row.quantity = value.quantity
      row.inventories = value.inventories
      for (let index in this.formula.raw_materials) {
        this.form.raw_materials[index].should_change = false
      }
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
        return
      }
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
    this.manufactureFormulaRequest()
  }
}
</script>
