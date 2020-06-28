<template>
  <div>
    <p-modal
      :id="'select-' + id"
      :ref="'select-' + id"
      title="edit inventory"
    >
      <template slot="content">
        <form
          class="row"
          @submit.prevent="onSubmit"
        >
          <p-block>
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
              v-model="form.name"
              name="name"
              :label="$t('name')"
              :disabled="isSaving"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />

            <p-form-row
              id="account"
              name="account"
              :label="$t('account')"
              :disabled="isSaving"
              :errors="form.errors.get('account')"
              @errors="form.errors.set('account', null)"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <m-chart-of-account
                  id="edit-chart-of-account"
                  v-model="form.chart_of_account_id"
                  :label="form.chart_of_account_name"
                  sub-ledger="inventory"
                />
                <p>{{ $t('create item helper - chart of account') }}</p>
              </div>
            </p-form-row>

            <p-form-row
              id="unit"
              v-model="form.unit"
              name="unit"
              :label="$t('unit')"
              :disabled="isSaving"
              :errors="form.errors.get('unit')"
              @errors="form.errors.set('unit', null)"
            />

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
                />
              </div>
            </p-form-row>

            <p-block-inner>
              <p-table>
                <tr slot="p-head">
                  <th>#</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th v-if="form.require_expiry_date">
                    Expiry Date
                  </th>
                  <th v-if="form.require_production_number">
                    Production No.
                  </th>
                </tr>
                <tr slot="p-body">
                  <th>-</th>
                  <td>
                    <m-warehouse
                      :id="'edit-warehouse-'"
                      v-model="form.warehouse_id"
                      :label="form.warehouse_name"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'quantity'"
                      v-model="form.quantity"
                      :name="'quantity'"
                      @keyup.native="calculate()"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'price'"
                      v-model="form.price"
                      :name="'price'"
                      @keyup.native="calculate()"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'value'"
                      v-model="form.value"
                      :name="'value'"
                      :readonly="true"
                    />
                  </td>
                  <td v-if="form.require_expiry_date">
                    <p-date-picker
                      id="expiry-date"
                      v-model="form.expiry_date"
                      name="expiry-date"
                    />
                  </td>
                  <td v-if="form.require_production_number">
                    <p-form-input
                      id="production-number"
                      v-model="form.production_number"
                      :disabled="isSaving"
                      name="production-number"
                    />
                  </td>
                </tr>
              </p-table>
            </p-block-inner>

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
          </p-block>
        </form>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isSaving: false,
      form: new Form({
        item_id: null,
        chart_of_account_id: null,
        chart_of_account_name: null,
        warehouse_id: null,
        warehouse_name: null,
        name: null,
        code: null,
        unit: null,
        quantity: 0,
        converter: 1,
        price: 0,
        total: 0,
        value: 0,
        units: [{
          label: 'PCS',
          name: 'PCS',
          converter: 1,
          default_purchase: true,
          default_sales: true
        }],
        opening_stocks: [
          {
            warehouse_id: null,
            quantity: 0,
            price: 0,
            value: 0,
            expiry_date: this.$moment().format('YYYY-MM-DD'),
            production_number: null
          }
        ],
        require_expiry_date: false,
        require_production_number: false
      })
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
  },
  methods: {
    ...mapActions('accountingCutOffInventory', ['update']),
    chooseProductionNumber () {
      this.form.require_production_number = !this.form.require_production_number
    },
    chooseExpiryDate () {
      this.form.require_expiry_date = !this.form.require_expiry_date
    },
    addOpeningStockRow () {
      this.form.opening_stocks.push({
        warehouse_id: null,
        quantity: null,
        price: null,
        value: null,
        expiry_date: this.$moment().format('YYYY-MM-DD'),
        production_number: null
      })
    },
    calculate () {
      this.form.value = this.form.price * this.form.quantity
    },
    onSubmit () {
      this.isSaving = true

      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          this.$emit('updated', true)
          this.form.warehouse_name = null
          this.form.chart_of_account_name = null
          this.form.reset()
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    show (cutOffInventory) {
      this.form.id = cutOffInventory.id
      this.form.code = cutOffInventory.item.code
      this.form.name = cutOffInventory.item.name
      this.form.number = cutOffInventory.item.number
      this.form.require_expiry_date = cutOffInventory.item.require_expiry_date
      this.form.require_production_number = cutOffInventory.item.require_production_number
      this.form.unit = cutOffInventory.unit
      this.form.quantity = cutOffInventory.quantity
      this.form.expiry_date = cutOffInventory.expiry_date
      this.form.production_number = cutOffInventory.production_number
      this.form.price = cutOffInventory.price
      this.form.value = cutOffInventory.price * cutOffInventory.quantity
      this.form.warehouse_id = cutOffInventory.warehouse_id
      this.form.warehouse_name = cutOffInventory.warehouse.name
      this.form.converter = cutOffInventory.converter
      this.form.chart_of_account_id = cutOffInventory.item.chart_of_account_id
      this.form.chart_of_account_name = cutOffInventory.item.account.alias
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
