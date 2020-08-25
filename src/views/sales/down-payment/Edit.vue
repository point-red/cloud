<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/down-payment"
        class="breadcrumb-item"
      >
        {{ $t('down payment') | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
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
                      {{ $t('form number') | uppercase }}
                    </td>
                    <td>
                      {{ downPayment.form.number }}
                    </td>
                  </tr>
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
                      {{ downPayment.downpaymentable.form.number }}
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
                        :max="downPayment.amount ? downPayment.amount : 0"
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
                    {{ $t('from') | uppercase }}: {{ form.customer_label | uppercase }}
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
                  <template v-for="(row, index) in downPayment.downpaymentable.items">
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
                      <b>{{ downPayment.downpaymentable.discount_value | numberFormat }}</b>
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
                      <b>{{ downPayment.downpaymentable.amount - downPayment.downpaymentable.tax | numberFormat }}</b>
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
                      <b>{{ downPayment.downpaymentable.tax | numberFormat }}</b>
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
                      <b>{{ downPayment.downpaymentable.amount | numberFormat }}</b>
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
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      form: new Form({
        id: this.$route.params.id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        sales_order_id: null,
        customer_id: null,
        customer_name: null,
        customer_label: null,
        customer_address: null,
        customer_phone: null,
        customer_email: null,
        notes: null,
        amount: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      })
    }
  },
  computed: {
    ...mapGetters('salesDownPayment', { downPayment: 'downPayment' }),
    ...mapGetters('auth', ['authUser']),
    subtotal () {
      return this.downPayment.downpaymentable.items.reduce((carry, item) => {
        return carry + item.quantity * (item.price - item.discount_value)
      }, 0)
    }
  },
  created () {
    this.salesDownPaymentRequest()
  },
  methods: {
    ...mapActions('salesDownPayment', ['find', 'update']),
    ...mapActions('salesOrder', { getSalesOrder: 'find' }),
    salesDownPaymentRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'downpaymentable.form;' +
            'downpaymentable.items.item;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.form.sales_order_id = this.downPayment.downpaymentable_id
        this.form.customer_id = this.downPayment.customer_id
        this.form.customer_name = this.downPayment.customer_name
        this.form.customer_label = this.downPayment.customer_name
        this.form.customer_phone = this.downPayment.customer_phone
        this.form.notes = this.downPayment.notes
        this.form.amount = this.downPayment.amount
        this.form.request_approval_to = this.downPayment.form.request_approval_to.id
        this.form.approver_name = this.downPayment.form.request_approval_to.full_name
        this.form.approver_email = this.downPayment.form.request_approval_to.email

        this.setSalesOrder()
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    setSalesOrder () {
      this.getSalesOrder({
        id: this.form.sales_order_id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'form;items.item'
        }
      }).then(response => {
        this.chooseSalesOrder(response.data)
      })
    },
    chooseSalesOrder (salesOrder) {
      this.salesOrder = salesOrder
      this.form.sales_order_id = salesOrder.id
      this.form.customer_id = this.salesOrder.customer_id
      this.form.customer_name = this.salesOrder.customer_name
      this.form.customer_label = this.salesOrder.customer_name
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
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
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
