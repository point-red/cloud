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
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
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
              {{ input.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
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
              <template v-if="input.form.number">
                {{ input.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ input.form.edited_number }}
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
              {{ form.manufacture_machine_name }}
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
              <th style="min-width: 120px">
                Warehouse
              </th>
              <th>Estimation</th>
              <th>&nbsp;</th>
              <th>Output</th>
              <th />
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
                <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                  {{ row.warehouse.name }}
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
            </tr>
          </point-table>

          <p-separator />

          <div class="row">
            <div class="col-sm-12">
              <h5>Approver</h5>
              <hr>
              <p-form-row
                id="approver"
                name="approver"
                :label="$t('approver')"
              >
                <div
                  slot="body"
                  class="col-lg-9 mt-5"
                >
                  <m-user
                    :id="'user'"
                    v-model="form.approver_id"
                    :errors="form.errors.get('approver_id')"
                    @errors="form.errors.set('approver_id', null)"
                  />
                </div>
              </p-form-row>
            </div>
          </div>

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
      inputId: this.$route.params.inputId,
      isLoading: false,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
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
    ...mapGetters('manufactureInput', ['input'])
  },
  created () {
    this.manufactureInputRequest()
  },
  methods: {
    ...mapActions('manufactureOutput', ['create']),
    ...mapActions('manufactureInput', ['find']),
    manufactureInputRequest () {
      this.isLoading = true
      this.find({
        id: this.inputId,
        params: {
          with_archives: true,
          includes: 'form;finishedGoods.item.units;finishedGoods.warehouse'
        }
      }).then(response => {
        this.form.manufacture_process_id = this.input.manufacture_process_id
        this.form.manufacture_input_id = this.input.id
        this.form.manufacture_process_name = this.input.manufacture_process_name
        this.form.manufacture_machine_id = this.input.manufacture_machine_id
        this.form.manufacture_machine_name = this.input.manufacture_machine_name
        this.form.finished_goods_temporary = this.input.finished_goods
        for (const index in this.form.finished_goods_temporary) {
          this.form.finished_goods_temporary[index].input_finish_good_id = this.input.finished_goods[index].id
          this.form.finished_goods_temporary[index].estimation_quantity = this.form.finished_goods_temporary[index].quantity
          this.form.finished_goods_temporary[index].inventories = []
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
              var inputFinishGood = Object.assign({}, finishGood)
              inputFinishGood.quantity = inventory.quantity
              inputFinishGood.expiry_date = inventory.expiry_date
              inputFinishGood.production_number = inventory.production_number
              this.form.finished_goods.push(inputFinishGood)
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
