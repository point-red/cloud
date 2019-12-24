<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link to="/manufacture/formula" class="breadcrumb-item">{{ $t('formula') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <manufacture-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('formula')" :header="true">
        <p-block-inner>
          <p-form-row
            id="process"
            name="process"
            :label="$t('process')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-process id="process" v-model="form.manufacture_process_id" @choosen="chooseManufactureProcess" :label="form.manufacture_process_name"/>
            </div>
          </p-form-row>

          <p-form-row
            id="name"
            name="name"
            :label="$t('name')"
            v-model="form.name"
            :disabled="isSaving"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

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
            <tr slot="p-body" v-for="(row, index) in form.finish_goods" :key="index">
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
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.item.units[0].label"/>
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
            <tr slot="p-body" v-for="(row, index) in form.raw_materials" :key="index">
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
                <m-warehouse
                  :id="'warehouse-raw-' + index"
                  :data-index="index"
                  v-model="row.warehouse_id"
                  :label="row.warehouse_name"
                  @choosen="chooseWarehouseRawMaterial($event, row)"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.item.units[0].label"/>
              </td>
              <td>
                <i class="btn btn-sm fa fa-times" @click="deleteRawMaterialRow(index)"></i>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addRawMaterialRow">
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
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbManufacture
  },
  data () {
    return {
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_process_id: null,
        manufacture_process_name: null,
        name: null,
        notes: null,
        approver_id: null,
        raw_materials: [{
          item_id: null,
          warehouse_id: null,
          item_name: null,
          warehouse_name: null,
          item: {
            units: [{
              label: '',
              name: '',
              converter: null
            }]
          },
          unit: null,
          quantity: 0,
          converter: null
        }],
        finish_goods: [{
          item_id: null,
          warehouse_id: null,
          item_name: null,
          warehouse_name: null,
          item: {
            units: [{
              label: '',
              name: '',
              converter: null
            }]
          },
          unit: null,
          quantity: 0,
          converter: null
        }]
      })
    }
  },
  methods: {
    ...mapActions('manufactureFormula', ['create']),
    addRawMaterialRow () {
      this.form.raw_materials.push({
        item_id: null,
        warehouse_id: null,
        item_name: null,
        warehouse_name: null,
        item: {
          units: [{
            label: '',
            name: '',
            converter: null
          }]
        },
        unit: null,
        quantity: 0,
        converter: null
      })
    },
    addFinishGoodRow () {
      this.form.finish_goods.push({
        item_id: null,
        warehouse_id: null,
        item_name: null,
        warehouse_name: null,
        item: {
          units: [{
            label: '',
            name: '',
            converter: null
          }]
        },
        unit: null,
        quantity: 0,
        converter: null
      })
    },
    deleteRawMaterialRow (index) {
      this.$delete(this.form.raw_materials, index)
    },
    deleteFinishGoodRow (index) {
      this.$delete(this.form.finish_goods, index)
    },
    chooseManufactureProcess (value) {
      this.form.manufacture_process_name = value
    },
    chooseRawMaterial (item, row) {
      row.item_name = item.name
      row.item.units = item.units
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseFinishGood (item, row) {
      row.item_name = item.name
      row.item.units = item.units
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseWarehouseRawMaterial (value, row) {
      row.warehouse_name = value
    },
    chooseWarehouseFinishGood (value, row) {
      row.warehouse_name = value
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
          this.$router.push('/manufacture/formula/' + response.data.id)
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
