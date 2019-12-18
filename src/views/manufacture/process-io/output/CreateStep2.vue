<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | titlecase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/output'" class="breadcrumb-item">{{ $t('output') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create Step 2</span>
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
              {{ input.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
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

      <p-block :title="$t('output')" :header="true">
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
              <th>Estimation</th>
              <th>Output</th>
              <th>Production Number</th>
              <th>Expiry Date</th>
              <th style="min-width: 120px">Warehouse</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.finish_goods" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    [{{ row.item.code }}] {{ row.item.name }}
                  </router-link>
                </td>
                <td>
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td>
                  <p-quantity
                    :id="'quantity' + index"
                    :name="'quantity' + index"
                    v-model="form.finish_goods[index].produced_quantity"
                    :unit="row.unit"/>
                </td>
                <td>
                  <p-form-input
                    id="production-number"
                    v-model="form.finish_goods[index].production_number"
                    :disabled="isSaving"
                    name="production-number"/>
                </td>
                <td>
                  <p-date-picker
                    id="expiry-date"
                    name="expiry-date"
                    v-model="form.finish_goods[index].expiry_date"/>
                </td>
                <td>
                  <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                    [{{ row.warehouse.code }}] {{ row.warehouse.name }}
                  </router-link>
                </td>
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
      inputId: this.$route.params.inputId,
      isLoading: false,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: new Date(),
        manufacture_machine_id: null,
        manufacture_input_id: null,
        manufacture_machine_name: null,
        notes: null,
        approver_id: null,
        finish_goods: []
      })
    }
  },
  computed: {
    ...mapGetters('manufactureInput', ['input'])
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
          includes: 'form;finishGoods.item.units;finishGoods.warehouse'
        }
      }).then(response => {
        this.form.manufacture_input_id = this.input.id
        this.form.finish_goods = this.input.finish_goods
        for (let index in this.form.finish_goods) {
          this.form.finish_goods[index].input_finish_good_id = this.input.finish_goods[index].id
          this.form.finish_goods[index].produced_quantity = 0
          this.form.finish_goods[index].production_number = null
          this.form.finish_goods[index].expiry_date = null
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
          this.$router.push('/manufacture/process-io/' + this.id + '/output/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.manufactureInputRequest()
  }
}
</script>
