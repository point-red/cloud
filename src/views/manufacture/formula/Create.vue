<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        to="/manufacture/formula"
        class="breadcrumb-item"
      >
        {{ $t('formula') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block>
        <p-block-inner>
          <div class="row">
            <div class="col-sm-6">
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>
                    <p-date-picker
                      id="date"
                      v-model="form.date"
                      name="date"
                      :label="$t('date')"
                      :errors="form.errors.get('date')"
                      @errors="form.errors.set('date', null)"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('process') | uppercase }}
                  </td>
                  <td>
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
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('name') | uppercase }}
                  </td>
                  <td>
                    <p-form-input
                      id="name"
                      v-model="form.name"
                      name="name"
                      :label="$t('name')"
                      :placeholder="$t('required') | uppercase"
                      :disabled="isSaving"
                      :errors="form.errors.get('name')"
                      @errors="form.errors.set('name', null)"
                    />
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <div class="mb-30">
                <h6 class="mb-0">
                  {{ authUser.tenant_name | uppercase }}
                </h6>
                <template v-if="authUser.branch">
                  {{ authUser.branch.address | uppercase }} <br v-if="authUser.branch.address">
                  {{ authUser.branch.phone | uppercase }} <br v-if="authUser.branch.phone">
                </template>
              </div>
            </div>
          </div>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Item
              </th>
              <th class="text-right">
                Quantity
              </th>
            </tr>
            <tr slot="p-body">
              <th />
              <td
                colspan="2"
                class="font-weight-bold"
              >
                {{ $t('finished goods') | uppercase }}
              </td>
            </tr>
            <tr
              v-for="(row, index) in form.finished_goods"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <span
                  class="select-link"
                  @click="$refs.finishedGoods.open(index)"
                >
                  {{ row.item_label || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <p-quantity
                  :id="'finished-goods-quantity' + index"
                  v-model="row.quantity"
                  :name="'finished-goods-quantity' + index"
                  :disabled="row.item_id == null"
                  :item-id="row.item_id"
                  :units="row.units"
                  :unit="{
                    name: row.unit,
                    label: row.unit,
                    converter: row.converter
                  }"
                  @choosen="chooseUnit($event, row)"
                />
              </td>
            </tr>
            <tr slot="p-body">
              <th />
              <td
                colspan="2"
                class="font-weight-bold"
              >
                {{ $t('raw materials') | uppercase }}
              </td>
            </tr>
            <tr
              v-for="(row, index) in form.raw_materials"
              slot="p-body"
              :key="'material-'+index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <span
                  class="select-link"
                  @click="$refs.rawMaterials.open(index)"
                >
                  {{ row.item_label || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <p-quantity
                  :id="'raw-material-quantity' + index"
                  v-model="row.quantity"
                  :name="'raw-material-quantity' + index"
                  :disabled="row.item_id == null"
                  :item-id="row.item_id"
                  :units="row.units"
                  :unit="{
                    name: row.unit,
                    label: row.unit,
                    converter: row.converter
                  }"
                  @choosen="chooseUnit($event, row)"
                />
              </td>
              <td>
                <button
                  v-if="row.item_id != null"
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteRawMaterialRow(index)"
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
              {{ createdBy | uppercase }}
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
      permission="approve manufacture formula"
      @choosen="chooseApprover"
    />
    <m-item
      ref="rawMaterials"
      @choosen="chooseRawMaterial"
    />
    <m-item
      ref="finishedGoods"
      @choosen="chooseFinishedGoods"
    />
  </div>
</template>

<script>
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapActions, mapGetters } from 'vuex'

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
      createdBy: localStorage.getItem('fullName'),
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_process_id: null,
        manufacture_process_name: null,
        name: null,
        notes: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
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
  computed: {
    ...mapGetters('auth', ['authUser'])
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
    chooseManufactureProcess (option) {
      this.form.manufacture_process_id = option.id
      this.form.manufacture_process_name = option.name
    },
    chooseRawMaterial (item) {
      const row = this.form.raw_materials[item.index]
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id == item.unit_default_purchase) {
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
    chooseFinishedGoods (item) {
      const row = this.form.finished_goods[item.index]
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id == item.unit_default_purchase) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    clearItem (row) {
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
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.raw_materials = this.form.raw_materials.filter(item => item.item_id !== null)
      if (this.form.raw_materials.length == 0) {
        this.addRawMaterialRow()
      }
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/manufacture/formula/' + response.data.id)
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
