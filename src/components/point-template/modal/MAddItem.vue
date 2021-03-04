<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('add item') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="code"
              v-model="form.code"
              name="code"
              :label="$t('code')"
              :disabled="isSaving"
              :errors="form.errors.get('code')"
              @errors="form.errors.set('code', null)"
            />

            <p-form-row
              id="name"
              ref="name"
              v-model="form.name"
              name="name"
              :label="$t('name')"
              :placeholder="$t('required') | uppercase"
              :disabled="isSaving"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />

            <p-separator />

            <h5>{{ $t('chart of account') | uppercase }}</h5>

            {{ $t('create item helper - chart of account') }}

            <hr>

            <span
              class="select-link"
              @click="$refs.chartOfAccountRef.open()"
            >
              {{ form.chart_of_account_label || $t('select') | uppercase }}
            </span>

            <p-separator />

            <h5>{{ $t('stock dna') | uppercase }}</h5>

            {{ $t('create item helper - stock dna') }}

            <hr>

            <p-form-row
              id="require-production-number"
              name="require-production-number"
              :label="$t('production number')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-check-box
                  id="require-production-number"
                  class="mb-0"
                  style="float:left"
                  name="require-production-number"
                  :checked="form.require_production_number"
                  @click.native="chooseProductionNumber()"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="require-expiry-date"
              name="require-expiry-date"
              :label="$t('expiry date')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-check-box
                  id="require-expiry-date"
                  name="require-expiry-date"
                  :checked="form.require_expiry_date"
                  @click.native="chooseExpiryDate()"
                />
              </div>
            </p-form-row>

            <p-separator />

            <h5>{{ $t('unit') | uppercase }}</h5>

            {{ $t('create item helper - unit') }}

            <hr>

            <table class="table">
              <tr>
                <th width="50px">
                  #
                </th>
                <th>Unit Converter</th>
                <th class="text-center">
                  Default Unit Purchasing
                </th>
                <th class="text-center">
                  Default Unit Sales
                </th>
              </tr>
              <tr
                v-for="(row, index) in form.units"
                :key="index"
              >
                <th>{{ ++index }}</th>
                <td>
                  <template v-if="index == 1">
                    {{ row.converter }} {{ row.name }}
                  </template>
                  <template v-else>
                    1 {{ row.name | uppercase }} = {{ row.converter }} {{ form.units[0].name | uppercase }}
                  </template>
                </td>
                <td class="text-center">
                  <i
                    v-if="row.default_purchase"
                    class="fa fa-check"
                  />
                </td>
                <td class="text-center">
                  <i
                    v-if="row.default_sales"
                    class="fa fa-check"
                  />
                </td>
              </tr>
            </table>

            <button
              v-if="form.require_production_number === false && form.require_expiry_date == false"
              type="button"
              class="btn btn-sm btn-secondary"
              @click="$refs.itemUnitRef.open()"
            >
              <i class="fa fa-plus" /> Add Unit Converter
            </button>

            <p-separator />

            <h5>{{ $t('group') | uppercase }}</h5>

            {{ $t('create item helper - group') }}

            <hr>

            <span
              class="select-link"
              @click="$refs.itemGroupRef.open()"
            >
              {{ form.groups[0].name || $t('select') | uppercase }}
            </span>
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
    <m-item-unit
      ref="itemUnitRef"
      @updated="onUpdateItemUnit"
    />
    <m-item-group
      ref="itemGroupRef"
      @choosen="onChoosenItemGroup"
    />
    <m-chart-of-account
      ref="chartOfAccountRef"
      v-model="form.chart_of_account_id"
      type="inventory"
      @choosen="onChoosenAccount"
    />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: new Form({
        code: null,
        name: null,
        chart_of_account_id: null,
        units: [{
          label: 'PCS',
          name: 'PCS',
          converter: 1,
          default_purchase: true,
          default_sales: true
        }],
        require_expiry_date: false,
        require_production_number: false,
        groups: [{
          id: null,
          label: null,
          name: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterItem', ['create']),
    onChoosenAccount (account) {
      this.form.chart_of_account_id = account.id
      this.form.chart_of_account_label = account.label
    },
    getItemCode () {
      this.isLoading = true
      this.get()
        .then(response => {
          this.isLoading = false
          this.form.code = 'A' + response.next_id
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },
    onUpdateItemUnit (units) {
      this.form.units = units
    },
    onChoosenItemGroup (group) {
      this.form.groups[0].id = group.id
      this.form.groups[0].name = group.name
    },
    chooseProductionNumber () {
      this.form.require_production_number = !this.form.require_production_number
    },
    chooseExpiryDate () {
      this.form.require_expiry_date = !this.form.require_expiry_date
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('added', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
