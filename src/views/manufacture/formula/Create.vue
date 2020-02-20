<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link to="/manufacture/formula" class="breadcrumb-item">{{ $t('formula') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-block-inner>
          <div class="row">
            <div class="col-sm-12">
              <h4 class="text-center m-0">{{ $t('formula') | uppercase }}</h4>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-12">
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
                :placeholder="$t('required') | uppercase"
                v-model="form.name"
                :disabled="isSaving"
                :errors="form.errors.get('name')"
                @errors="form.errors.set('name', null)"/>
            </div>
          </div>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Finished Goods</th>
              <th class="text-right">Quantity</th>
              <th style="width: 50px"></th>
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
                  :item-id="row.item_id"
                  :units="row.item.units"
                  :unit="row.item.units[0]"
                  @choosen="chooseUnit($event, row)"/>
              </td>
              <td>
                <!-- <i class="btn btn-sm fa fa-times" @click="deleteFinishGoodRow(index)"></i> -->
              </td>
            </tr>
          </point-table>
          <!-- <button type="button" class="btn btn-sm btn-secondary" @click="addFinishGoodRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button>
          <hr> -->
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Raw Material</th>
              <th class="text-right">Quantity</th>
              <th style="width: 50px"></th>
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
                  :item-id="row.item_id"
                  :units="row.item.units"
                  :unit="row.item.units[0]"
                  @choosen="chooseUnit($event, row)"/>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-danger" v-if="row.item_id != null" @click="deleteRawMaterialRow(index)">
                  <i class="fa fa-times"></i>
                </button>
              </td>
            </tr>
          </point-table>
          <!-- <button type="button" class="btn btn-sm btn-secondary" @click="addRawMaterialRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button> -->

          <div class="row mt-50">
            <div class="col-sm-6">
              <textarea rows="5" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ Date.now() | dateFormat('DD MMMM YYYY') }}</div>
              {{ requestedBy | uppercase }}
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
      requestedBy: localStorage.getItem('userName'),
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
          item_name: null,
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
        finished_goods: [{
          item_id: null,
          item_name: null,
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
        item_name: null,
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
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    addFinishGoodRow () {
      this.form.finished_goods.push({
        item_id: null,
        item_name: null,
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
      row.quantity = 0
      row.item_name = item.name
      row.item.units = item.units
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
      row.quantity = 0
      row.item_name = item.name
      row.item.units = item.units
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
      this.form.raw_materials = this.form.raw_materials.filter(item => item.item_id !== null)
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
