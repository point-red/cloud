<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/item" class="breadcrumb-item">{{ $t('item') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block id="item-unit" :title="'Create Item'" :header="true">
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

        <p-separator></p-separator>

        <h5>{{ $t('chart of account') | uppercase }}</h5>

        {{ $t('create item helper - chart of account') }}

        <hr>

        <m-chart-of-account id="chart-of-account" v-model="form.chart_of_account_id" sub-ledger="account payable"/>

        <p-separator></p-separator>

        <h5>{{ $t('unit') | uppercase }}</h5>

        {{ $t('create item helper - unit') }}

        <hr>

        <point-table>
          <tr slot="p-head">
            <th width="50px">#</th>
            <th>Unit Converter</th>
          </tr>
          <tr slot="p-body" v-for="(row, index) in form.units" :key="index">
            <th>{{ ++index }}</th>
            <td>
              <template v-if="index == 1">
                {{ row.converter }} {{ row.name }}
              </template>
              <template v-else>
                1 {{ row.name | uppercase }} = {{ row.converter }} {{ form.units[0].name | uppercase }}
                <span style="font-size: 10px" v-if="row.default_purchase">(DEFAULT UNIT FOR PURCHASE)</span>
                <span style="font-size: 10px" v-if="row.default_sales">(DEFAULT UNIT FOR SALES)</span>
              </template>
            </td>
          </tr>
        </point-table>

        <m-item-unit id="unit" ref="mItemUnit" @updated="updateItemUnit"></m-item-unit>

        <p-separator></p-separator>

        <h5>{{ $t('group') | uppercase }}</h5>

        {{ $t('create item helper - group') }}

        <hr>

        <p-form-row
          id="item-group"
          name="item-group"
          :label="$t('group')">
          <div slot="body" class="col-lg-9 mt-5">
            <template v-for="(group, index) in form.groups">
              <m-item-group
                :key="'item-group-'+index"
                :id="'item-group-'+index"
                :label="form.groups[index].name"
                v-model="form.groups[index].id"
                @choosen="chooseItemGroup($event, index)"
                @clear="removeItemGroupRow(index)"/>
              <hr :key="'item-group-hr-'+index"/>
            </template>
            <button type="button" class="btn btn-sm btn-secondary" @click="addItemGroupRow">
              <i class="fa fa-plus"/>
            </button>
          </div>
        </p-form-row>

        <p-separator></p-separator>

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

        <p-separator></p-separator>

        <h5>{{ $t('opening stock') | uppercase }}</h5>

        {{ $t('create item helper - opening stock') }}

        <hr>

        <p-block-inner>
          <point-table>
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
            </tr>
          </point-table>

          <button type="button" class="btn btn-sm btn-secondary" @click="addOpeningStockRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button>

          <hr>

          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>{{ $t('save') | uppercase }}
          </button>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      isSaving: false,
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
        }],
        opening_stocks: [
          {
            warehouse_id: null,
            quantity: null,
            price: null,
            value: null,
            expiry_date: this.$moment().format('YYYY-MM-DD'),
            production_number: null
          }
        ]
      })
    }
  },
  watch: {
    'form.opening_stocks': {
      handler: function (newValue) {
        this.form.opening_stocks.forEach(function (element) {
          element.value = element.quantity * element.price
        })
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  methods: {
    ...mapActions('masterItem', ['create']),
    updateItemUnit (units) {
      this.form.units = units
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
    addItemGroupRow () {
      this.form.groups.push({
        id: null,
        label: null,
        name: null
      })
    },
    removeItemGroupRow (group) {
      this.$delete(this.form.groups, group)
    },
    chooseItemGroup (event, index) {
      this.$set(this.form.groups, index, event)
    },
    chooseProductionNumber () {
      this.form.require_production_number = !this.form.require_production_number
    },
    chooseExpiryDate () {
      this.form.require_expiry_date = !this.form.require_expiry_date
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/master/item/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
