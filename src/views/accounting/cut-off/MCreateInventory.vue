<template>
  <div>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="create inventory">
      <template slot="content">
        <form class="row" @submit.prevent="onSubmit">
          <p-block>
            <p-form-row
              id="code"
              name="code"
              :label="$t('code')"
              v-model="form.code"
              :disabled="isSaving"
              :errors="form.errors.get('code')"
              @errors="form.errors.set('code', null)"/>

            <p-form-row
              id="name"
              name="name"
              :label="$t('name')"
              v-model="form.name"
              :disabled="isSaving"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"/>

            <p-form-row
              id="account"
              name="account"
              :label="$t('account')"
              :disabled="isSaving"
              :errors="form.errors.get('account')"
              @errors="form.errors.set('account', null)">
              <div slot="body" class="col-lg-9 mt-5">
                <m-chart-of-account id="chart-of-account" v-model="form.chart_of_account_id" :label="form.chart_of_account_name" sub-ledger="inventory"/>
                <p>{{ $t('create item helper - chart of account') }}</p>
              </div>
            </p-form-row>

            <p-form-row
              id="unit"
              name="unit"
              :label="$t('unit')"
              v-model="form.unit"
              :disabled="isSaving"
              :errors="form.errors.get('unit')"
              @errors="form.errors.set('unit', null)"/>

            <h5>{{ $t('stock dna') | uppercase }}</h5>

            {{ $t('create item helper - stock dna') }}

            <hr>

            <p-form-row
              id="require-production-number"
              name="require-production-number"
              :label="$t('production number')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  class="mb-0"
                  style="float:left"
                  id="require-production-number"
                  name="require-production-number"
                  @click.native="chooseProductionNumber()"
                  :checked="form.require_production_number"/>
              </div>
            </p-form-row>

            <p-form-row
              id="require-expiry-date"
              name="require-expiry-date"
              :label="$t('expiry date')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  id="require-expiry-date"
                  name="require-expiry-date"
                  @click.native="chooseExpiryDate()"
                  :checked="form.require_expiry_date"/>
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
                  <th v-if="form.require_expiry_date">Expiry Date</th>
                  <th v-if="form.require_production_number">Production No.</th>
                </tr>
                <tr slot="p-body" v-for="(row, index) in form.opening_stocks" :key="index">
                  <th>{{ index + 1 }}</th>
                  <td>
                    <m-warehouse :id="'warehouse-' + index" v-model="form.opening_stocks[index].warehouse_id"/>
                  </td>
                  <td>
                    <p-form-number
                      :id="'quantity' + index"
                      :name="'quantity' + index"
                      v-model="form.opening_stocks[index].quantity"/>
                  </td>
                  <td>
                    <p-form-number
                      :id="'price' + index"
                      :name="'price' + index"
                      v-model="form.opening_stocks[index].price"/>
                  </td>
                  <td>
                    <p-form-number
                      :id="'value' + index"
                      :name="'value' + index"
                      :readonly="true"
                      v-model="form.opening_stocks[index].value"/>
                  </td>
                  <td v-if="form.require_expiry_date">
                    <p-date-picker
                      id="expiry-date"
                      name="expiry-date"
                      v-model="form.opening_stocks[index].expiry_date"/>
                  </td>
                  <td v-if="form.require_production_number">
                    <p-form-input
                      id="production-number"
                      :disabled="isSaving"
                      v-model="form.opening_stocks[index].production_number"
                      name="production-number"/>
                  </td>
                  <td>
                    <a href="javascript:void(0)" @click="removeRow(index)"><i class="fa fa-trash"></i></a>
                  </td>
                </tr>
              </p-table>

              <button type="button" class="btn btn-sm btn-secondary" @click="addOpeningStockRow">
                <i class="fa fa-plus"/>
              </button>
            </p-block-inner>

            <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
            </button>
          </p-block>
        </form>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      form: new Form({
        item_id: null,
        chart_of_account_id: null,
        chart_of_account_name: null,
        name: null,
        code: null,
        unit: null,
        quantity: 0,
        converter: 1,
        price: 0,
        total: 0,
        require_expiry_date: false,
        require_production_number: false,
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
        ]
      })
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    },
    'form.opening_stocks': {
      handler: function (newValue) {
        this.form.opening_stocks.forEach(function (element) {
          element.value = element.quantity * element.price
        })
      },
      deep: true
    }
  },
  created () {
  },
  methods: {
    ...mapActions('accountingCutOffInventory', ['create']),
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
    removeRow (index) {
      this.$delete(this.form.opening_stocks, index)
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.form.chart_of_account_id = null
          this.form.chart_of_account_name = 'select'
          this.form.reset()
          this.$notification.success('create success')
          this.$emit('updated', true)
          window.location.reload(true)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    show () {
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
