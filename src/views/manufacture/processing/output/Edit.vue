<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="'/manufacture/processing/' + id"
        class="breadcrumb-item"
      >
        {{ $t('process') | uppercase }}
      </router-link>
      <router-link
        :to="'/manufacture/processing/' + id + '/output'"
        class="breadcrumb-item"
      >
        {{ $t('output') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'manufacture.process.io.output.show', params: { id: id, outputId: outputId }}"
        class="breadcrumb-item"
      >
        {{ output.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :title="$t('input')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              {{ output.manufacture_input.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="number"
            name="number"
            :label="$t('number')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <template v-if="output.manufacture_input.form.number">
                {{ output.manufacture_input.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ output.manufacture_input.form.edited_number }}
              </template>
            </div>
          </p-form-row>
        </p-block-inner>
      </p-block>

      <p-block
        :title="$t('output')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
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

          <p-form-row
            id="notes"
            v-model="form.notes"
            name="notes"
            :label="$t('notes')"
            :disabled="isSaving"
            :errors="form.errors.get('notes')"
            @errors="form.errors.set('notes', null)"
          />

          <p-separator />

          <h5>{{ $t('finished goods') | titlecase }}</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Item
              </th>
              <th>Estimation</th>
              <th>&nbsp;</th>
              <th>Output</th>
              <th style="min-width: 120px">
                Warehouse
              </th>
            </tr>
            <tr
              v-for="(row, index) in form.finished_goods_temporary"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                  {{ row.item.label }}
                </router-link>
              </td>
              <td>
                {{ row.estimation_quantity | numberFormat }} {{ row.unit }}
              </td>
              <td>
                <m-inventory-in
                  v-if="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1) && row.item_id && row.warehouse_id"
                  :id="'inventory-' + index"
                  :item-id="row.item_id"
                  :require-expiry-date="row.item.require_expiry_date"
                  :require-production-number="row.item.require_production_number"
                  :unit="row.unit"
                  :inventories="row.inventories"
                  :value="row.quantity"
                  @add="addInventory($event, row)"
                />
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  v-model="row.quantity"
                  :name="'quantity' + index"
                  :unit="row.item.units[0].label"
                  :readonly="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1)"
                />
              </td>
              <td>
                <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                  {{ row.warehouse.name }}
                </router-link>
              </td>
            </tr>
          </point-table>

          <p-separator />

          <h5 class="">
            Approver
          </h5>

          <p-form-row
            id="approver"
            name="approver"
            :label="$t('approver')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <m-user
                :id="'user'"
                v-model="form.approver_id"
              />
            </div>
          </p-form-row>

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
  </div>
</template>

<script>
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
      outputId: this.$route.params.outputId,
      isLoading: false,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        id: this.$route.params.outputId,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        manufacture_machine_id: null,
        manufacture_process_id: null,
        manufacture_input_id: null,
        manufacture_machine_name: null,
        manufacture_process_name: null,
        notes: null,
        approver_id: null,
        finished_goods_temporary: [],
        finished_goods: []
      })
    }
  },
  computed: {
    ...mapGetters('manufactureOutput', ['output'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.outputId,
      params: {
        includes: 'form;manufactureMachine;manufactureInput.form;manufactureInput.finishedGoods;finishedGoods.item.units;finishedGoods.warehouse;form.approvals.requestedBy;form.approvals.requestedTo'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/manufacture/processing/' + this.id + '/output/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = new Date(response.data.form.date)
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.manufacture_machine_id = response.data.manufacture_machine_id
      this.form.manufacture_process_id = response.data.manufacture_process_id
      this.form.manufacture_input_id = response.data.manufacture_input_id
      this.form.manufacture_machine_name = response.data.manufacture_machine_name
      this.form.manufacture_process_name = response.data.manufacture_process_name
      this.form.notes = response.data.form.notes
      response.data.finished_goods.forEach((item, keyItem) => {
        this.form.finished_goods.push({
          item_id: item.item_id,
          warehouse_id: item.warehouse_id,
          item_name: item.item_name,
          warehouse_name: item.warehouse_name,
          quantity: item.quantity,
          expiry_date: item.expiry_date,
          production_number: item.production_number,
          unit: item.unit,
          item: item.item,
          warehouse: item.warehouse,
          converter: item.converter
        })
      })
      for (const index in this.output.manufacture_input.finished_goods) {
        const inputFinishGood = this.output.manufacture_input.finished_goods[index]
        const finishGoodIndex = this.form.finished_goods.findIndex(o => o.item_id === inputFinishGood.item_id && o.warehouse_id === inputFinishGood.warehouse_id)
        if (finishGoodIndex >= 0) {
          this.form.finished_goods[finishGoodIndex].estimation_quantity = inputFinishGood.quantity
          this.form.finished_goods[finishGoodIndex].input_finish_good_id = inputFinishGood.id
        }
      }
      for (const index in this.form.finished_goods) {
        const finishGood = this.form.finished_goods[index]
        const finishGoodTemporaryIndex = this.form.finished_goods_temporary.findIndex(o => o.item_id === finishGood.item_id && o.warehouse_id === finishGood.warehouse_id)
        if (finishGoodTemporaryIndex < 0) {
          var newItem = Object.assign({}, finishGood)
          newItem.inventories = []
          newItem.inventories.push({
            quantity: finishGood.quantity,
            expiry_date: finishGood.expiry_date,
            production_number: finishGood.production_number
          })
          this.form.finished_goods_temporary.push(newItem)
        } else {
          var existing = this.form.finished_goods_temporary[finishGoodTemporaryIndex]
          existing.quantity += finishGood.quantity
          existing.inventories.push({
            quantity: finishGood.quantity,
            expiry_date: finishGood.expiry_date,
            production_number: finishGood.production_number
          })
          this.form.finished_goods_temporary[finishGoodTemporaryIndex] = existing
        }
      }
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('manufactureOutput', ['find', 'update']),
    chooseManufactureMachine (value) {
      this.form.manufacture_machine_name = value
    },
    addInventory (value, row) {
      row.quantity = value.quantity
      row.inventories = value.inventories
    },
    setFinishedGoods () {
      this.form.finished_goods = []
      for (const index in this.form.finished_goods_temporary) {
        const finishGood = this.form.finished_goods_temporary[index]
        if (finishGood.inventories.length > 0) {
          for (const indexInventory in finishGood.inventories) {
            const inventory = finishGood.inventories[indexInventory]
            if (inventory.quantity) {
              var outputFinishGood = Object.assign({}, finishGood)
              outputFinishGood.quantity = inventory.quantity
              outputFinishGood.expiry_date = inventory.expiry_date
              outputFinishGood.production_number = inventory.production_number
              this.form.finished_goods.push(outputFinishGood)
            }
          }
        } else {
          this.form.finished_goods.push(finishGood)
        }
      }
    },
    onSubmit () {
      this.isSaving = true
      this.setFinishedGoods()
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Update success')
          this.$router.push('/manufacture/processing/' + this.id + '/output/' + response.data.id)
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
