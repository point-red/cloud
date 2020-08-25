<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/down-payment"
        class="breadcrumb-item"
      >
        {{ $t('down payment') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('down payment') | uppercase }}</h4>
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
                      {{ $t('reference') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectSalesOrder.open()"
                      >
                        <template v-if="salesOrder && salesOrder.form.number != null">
                          {{ salesOrder.form.number }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('amount') | uppercase }}
                    </td>
                    <td>
                      <p-form-number
                        :id="'amount'"
                        v-model.number="form.amount"
                        :name="'amount'"
                        :is-text-right="false"
                        :max="salesOrder.amount ? salesOrder.amount : 0"
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
                <div>
                  <h6 class="mb-0">
                    {{ $t('from') | uppercase }}:
                    <template v-if="form.customer_code">
                      [{{ form.customer_code | uppercase }}]
                    </template>
                    {{ form.customer_name | uppercase }}
                  </h6>
                  <div v-if="form.customer_address">
                    <i class="fa fa-home fa-fw" /> {{ form.customer_address | uppercase }}
                  </div>
                  <div v-if="form.customer_phone">
                    <i class="fa fa-phone fa-fw" /> {{ form.customer_phone | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-12">
                <point-table class="mt-20">
                  <tr slot="p-head">
                    <th class="text-center">
                      #
                    </th>
                    <th>Item</th>
                    <th class="text-right">
                      Quantity
                    </th>
                    <th class="text-right">
                      Price
                    </th>
                    <th class="text-right">
                      Discount
                    </th>
                    <th class="text-right">
                      Total
                    </th>
                    <th width="50px" />
                  </tr>
                  <template v-for="(row, index) in salesOrder.items">
                    <tr
                      slot="p-body"
                      :key="index"
                    >
                      <th class="text-center">
                        {{ index + 1 }}
                      </th>
                      <td>{{ row.item.label }}</td>
                      <td class="text-right">
                        {{ row.quantity | numberFormat }} {{ row.unit }}
                      </td>
                      <td class="text-right">
                        {{ row.price | numberFormat }}
                      </td>
                      <td class="text-right">
                        {{ row.discount_value | numberFormat }}
                      </td>
                      <td class="text-right">
                        {{ row.quantity * (row.price - row.discount_value) | numberFormat }}
                      </td>
                      <td />
                    </tr>
                  </template>
                  <tr slot="p-body">
                    <th />
                    <td />
                    <td />
                    <td />
                    <td class="text-right">
                      <b>{{ $t('subtotal') | uppercase }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ subtotal | numberFormat }}</b>
                    </td>
                    <td />
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td />
                    <td />
                    <td />
                    <td class="text-right">
                      <b>{{ $t('discount') | uppercase }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ salesOrder.discount_value | numberFormat }}</b>
                    </td>
                    <td />
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td />
                    <td />
                    <td />
                    <td class="text-right">
                      <b>{{ $t('tax base') | uppercase }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ salesOrder.amount - salesOrder.tax | numberFormat }}</b>
                    </td>
                    <td />
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td />
                    <td />
                    <td />
                    <td class="text-right">
                      <b>{{ $t('tax') | uppercase }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ salesOrder.tax | numberFormat }}</b>
                    </td>
                    <td />
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td />
                    <td />
                    <td />
                    <td class="text-right">
                      <b>{{ $t('total') | uppercase }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ salesOrder.amount | numberFormat }}</b>
                    </td>
                    <td />
                  </tr>
                </point-table>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
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
                {{ requestedBy | uppercase }}
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

              <div class="col-sm-12">
                <hr>
                <button
                  type="submit"
                  class="btn btn-block btn-sm btn-primary"
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
      </div>
    </form>
    <m-user
      ref="approver"
      :permission="'approve sales down payment'"
      @choosen="chooseApprover"
    />
    <select-sales-order
      ref="selectSalesOrder"
      @choosen="chooseSalesOrder"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectSalesOrder from './SelectSalesOrder'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SalesMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbSales,
    SelectSalesOrder
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      salesOrder: {
        form: {
          number: null
        },
        items: []
      },
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        sales_order_id: null,
        customer_id: null,
        customer_code: null,
        customer_name: null,
        customer_address: null,
        customer_phone: null,
        customer_email: null,
        notes: null,
        amount: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        sales_request_id: null
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    subtotal () {
      return this.salesOrder.items.reduce((carry, item) => {
        return carry + item.quantity * (item.price - item.discount_value)
      }, 0)
    }
  },
  methods: {
    ...mapActions('salesDownPayment', ['create']),
    chooseSalesOrder (salesOrder) {
      this.salesOrder = salesOrder
      this.form.sales_order_id = salesOrder.id
      this.form.customer_id = this.salesOrder.customer_id
      this.form.customer_code = this.salesOrder.customer_code
      this.form.customer_name = this.salesOrder.customer_name
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/sales/down-payment/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
