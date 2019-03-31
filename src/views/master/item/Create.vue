<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/item" class="breadcrumb-item">Item</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Create Item'" :header="true">
        <p-form-row
          id="code"
          name="code"
          :label="$t('code')"
          v-model="form.code"
          :disabled="loadingSaveButton"
          :errors="form.errors.get('code')"
          @errors="form.errors.set('code', null)"/>

        <p-form-row
          id="name"
          name="name"
          :label="$t('name')"
          v-model="form.name"
          :disabled="loadingSaveButton"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <p-form-row
          id="chart-of-account"
          name="chart-of-account"
          :label="$t('chart of account')">
          <div slot="body" class="col-lg-9">
            <m-chart-of-account id="chart-of-account" v-model="form.chart_of_account_id"/>
          </div>
        </p-form-row>

        <p-form-row
          id="unit"
          name="unit"
          :label="$t('unit')"
          v-model="form.units[0].label"
          :disabled="loadingSaveButton"
          :errors="form.errors.get('unit')"
          @errors="form.errors.set('unit', null)"/>
        
        <p-separator></p-separator>

        <h3 class="">{{ $t('opening stock') | uppercase }}</h3>

        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Value</th>
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
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOpeningStockRow">
            <i class="fa fa-plus"/> Add
          </button>
        </p-block-inner>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
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
      loadingSaveButton: false,
      form: new Form({
        code: null,
        name: null,
        chart_of_account_id: null,
        units: [{
          label: null,
          name: null
        }],
        opening_stocks: [
          {
            warehouse_id: null,
            quantity: null,
            price: null,
            value: null
          }
        ]
      })
    }
  },
  watch: {
    'form.units': {
      handler: function(newValue) {
        this.form.units[0].name = this.form.units[0].label
      },
      deep: true      
    },
    'form.opening_stocks': {
      handler: function(newValue) {
        this.form.opening_stocks.forEach(function(element) {
          element.value = element.quantity * element.price
        })
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('Item', ['item'])
  },
  methods: {
    ...mapActions('Item', ['create']),
    addOpeningStockRow () {
      this.form.opening_stocks.push({
        warehouse_id: null,
        quantity: null,
        price: null,
        value: null
      })
    },
    onSubmit () {
      this.loadingSaveButton = true
      this.create(this.form)
        .then(response => {
          this.loadingSaveButton = false
          this.$notification.success('create success')          
          Object.assign(this.$data, this.$options.data.call(this));
        }).catch(error => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
