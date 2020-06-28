<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="{ name: 'manufacture.formula.index' }"
        class="breadcrumb-item"
      >
        {{ $t('formula') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'manufacture.formula.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ formula.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block>
        <div class="row">
          <div class="col-sm-6">
            <h4>{{ $t('formula') | uppercase }}</h4>
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
                    <template v-if="form.manufacture_process_name">
                      {{ form.manufacture_process_name }}
                    </template>
                    <template v-else>
                      {{ $t('select') | uppercase }}
                    </template>
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
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Item
              </th>
              <th class="text-right">
                Quantity
              </th>
              <th style="width: 50px" />
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
                  @click="$refs.finishedGoods.open(index)"
                >
                  {{ row.item_label || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  v-model="row.quantity"
                  :name="'quantity' + index"
                  :item-id="row.item_id"
                  :units="row.item.units"
                  :unit="{
                    name: row.unit,
                    label: row.unit,
                    converter: row.converter
                  }"
                  @choosen="chooseUnit($event, row)"
                />
              </td>
              <td>
                &nbsp;
              </td>
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
              v-for="(row, index) in form.raw_materials"
              slot="p-body"
              :key="'material-' + index"
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
                  :id="'quantity' + index"
                  v-model="row.quantity"
                  :name="'quantity' + index"
                  :disabled="row.item_id == null"
                  :item-id="row.item_id"
                  :units="row.item.units"
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
                  v-if="row.item_id != null && index > 0"
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
                /> {{ $t('update') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import Form from '@/utils/Form'
import ManufactureMenu from '../Menu'
import PointTable from 'point-table-vue'
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
      isLoading: true,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        id: this.$route.params.id,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_process_id: null,
        manufacture_process_name: null,
        name: null,
        notes: null,
        request_approval_to: null,
        raw_materials: [],
        finished_goods: []
      })
    }
  },
  computed: {
    ...mapGetters('manufactureFormula', ['formula']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'manufactureProcess;' +
        'rawMaterials.item.units;' +
        'finishedGoods.item.units;' +
        'form.requestApprovalTo;' +
        'form.requestCancellationTo'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/manufacture/formula/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = response.data.form.date
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.manufacture_process_id = response.data.manufacture_process_id
      this.form.manufacture_process_name = response.data.manufacture_process_name
      this.form.name = response.data.name
      this.form.notes = response.data.form.notes
      this.form.request_approval_to = response.data.form.request_approval_to.id
      this.form.approver_name = response.data.form.request_approval_to.full_name
      this.form.approver_email = response.data.form.request_approval_to.email
      response.data.raw_materials.forEach((item, keyItem) => {
        this.form.raw_materials.push({
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.label,
          item: item.item,
          quantity: item.quantity,
          unit: item.unit,
          converter: item.converter
        })
      })
      this.addRawMaterialRow()
      response.data.finished_goods.forEach((item, keyItem) => {
        this.form.finished_goods.push({
          item_id: item.item_id,
          item_name: item.item.name,
          item_label: item.item.label,
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
        item_label: null,
        item: {
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
    addFinishedGoodRow () {
      this.form.finished_goods.push({
        item_id: null,
        item_name: null,
        item_label: null,
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
    deleteFinishedGoodRow (index) {
      this.$delete(this.form.finished_goods, index)
    },
    chooseManufactureProcess (option) {
      this.form.manufacture_process_name = option.name
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    chooseRawMaterial (item) {
      const row = this.form.raw_materials[item.index]
      row.item_name = item.name
      row.item_label = item.label
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
    chooseFinishedGood (item) {
      const row = this.form.finished_goods[item.index]
      row.item_name = item.name
      row.item_label = item.label
      row.item.units = item.units
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
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
      row.item_label = null
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
      this.form.raw_materials = this.form.raw_materials.filter(item => item.item_id !== null)
      if (this.form.raw_materials.length == 0) {
        this.addRawMaterialRow()
      }
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
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
