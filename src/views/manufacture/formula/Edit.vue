<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="{ name: 'manufacture.formula.index' }" class="breadcrumb-item">{{ $t('formula') | uppercase }}</router-link>
      <router-link :to="{ name: 'manufacture.formula.show', params: { id: id }}" class="breadcrumb-item">{{ formula.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('formula')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="formula.form.number">
                {{ formula.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ formula.form.edited_number }}
              </template>
            </div>
          </p-form-row>

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
            :disabled="loadingSaveButton"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')"
            v-model="form.notes"
            :disabled="loadingSaveButton"
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
            <i class="fa fa-plus"/> Add
          </button>

          <p-separator></p-separator>

          <h5>{{ $t('raw materials') | titlecase }}</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Item</th>
              <th>Quantity</th>
              <th style="min-width: 120px">Warehouse</th>
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
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.item.units[0].label"/>
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
            <i class="fa fa-plus"/> Add
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
              <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import Form from '@/utils/Form'
import ManufactureMenu from '../Menu'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbManufacture,
    PointTable,
    ManufactureMenu
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: true,
      loadingSaveButton: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        id: this.$route.params.id,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_process_id: null,
        manufacture_process_name: null,
        name: null,
        notes: null,
        approver_id: null,
        raw_materials: [],
        finished_goods: []
      })
    }
  },
  computed: {
    ...mapGetters('manufactureFormula', ['formula'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'manufactureProcess;rawMaterials.item.units;finishedGoods.item.units;form.approvals.requestedBy;form.approvals.requestedTo;rawMaterials.warehouse;finishedGoods.warehouse'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/manufacture/formula/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = new Date(response.data.form.date)
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.manufacture_process_id = response.data.manufacture_process_id
      this.form.manufacture_process_name = response.data.manufacture_process_name
      this.form.name = response.data.name
      this.form.notes = response.data.form.notes
      response.data.raw_materials.forEach((item, keyItem) => {
        this.form.raw_materials.push({
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
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('manufactureFormula', ['find', 'update']),
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
      this.form.finished_goods.push({
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
      this.$delete(this.form.finished_goods, index)
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
    onSubmit () {
      this.loadingSaveButton = true
      this.update(this.form)
        .then(response => {
          this.loadingSaveButton = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/manufacture/formula/' + response.data.id)
        }).catch(error => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
