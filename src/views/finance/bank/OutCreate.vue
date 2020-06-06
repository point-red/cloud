<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <span class="breadcrumb-item active">
        <router-link to="/finance/bank">{{ $t('bank') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">
        <router-link to="/finance/bank/out">{{ $t('out') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ paymentOrder.form.number }}</span>
    </breadcrumb>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('bank out') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">{{ $t('required date') | uppercase }}</td>
                  <td>{{ paymentOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">{{ $t('bank account') | uppercase }}</td>
                  <td>
                    <span @click="$refs.chartOfAccountBankRef.open()" class="select-link">
                      {{ form.payment_account_name || $t('select') | uppercase }}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">{{ authUser.tenant_name | uppercase }}</h6>
              <template v-if="paymentOrder.form.branch">
                {{ paymentOrder.form.branch.address | uppercase }} <br v-if="paymentOrder.form.branch.address">
                {{ paymentOrder.form.branch.phone | uppercase }} <br v-if="paymentOrder.form.branch.phone">
              </template>
              <h6 class="mt-30 mb-5">{{ $t('to') | uppercase }} :</h6>
              {{ paymentOrder.paymentable.label }}
            </div>
          </div>

          <hr>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Account</th>
              <th>Notes</th>
              <th style="min-width: 120px">Allocation</th>
              <th class="text-right">Amount</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in paymentOrder.details" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.account.number }} - {{ row.account.alias }}</td>
              <td>{{ row.notes }}</td>
              <td>
                <template v-if="row.allocation">
                  {{ row.allocation.name }}
                </template>
              </td>
              <td class="text-right">{{ row.amount | numberFormat }}</td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right">{{ paymentOrder.amount | numberFormat }}</td>
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ paymentOrder.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('created by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ authUser.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="paymentOrder.form.approval_at">
                  {{ paymentOrder.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ paymentOrder.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:9px">{{ paymentOrder.form.request_approval_to.email | uppercase }}</div>
            </div>
            <div class="col-sm-12">
              <hr>
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
    <m-chart-of-account ref="chartOfAccountBankRef" @choosen="onChoosenAccountBank" type="BANK"/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'bank',
        payment_account_id: null,
        payment_account_name: null,
        paymentable_id: null,
        paymentable_type: null,
        paymentable_name: null,
        disbursed: true,
        notes: null,
        amount: 0,
        details: []
      })
    }
  },
  computed: {
    ...mapGetters('financePaymentOrder', ['paymentOrder']),
    ...mapGetters('financePayment', ['payment']),
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('financePaymentOrder', {
      find: 'find'
    }),
    ...mapActions('financePayment', {
      create: 'create'
    }),
    onChoosenAccountBank (account) {
      this.form.payment_account_id = account.id
      this.form.payment_account_name = account.label
    },
    calculate: debounce(function () {
      var totalAmount = 0
      this.paymentOrder.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.paymentOrder.amount = totalAmount
    }, 300),
    search () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'form;' +
            'paymentable;' +
            'details.account;' +
            'details.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.isLoading = false
        this.form.payment_type = 'bank'
        this.form.disbursed = true
        this.form.payment_account_id = response.data.payment_account_id
        this.form.payment_account_name = response.data.payment_account_name
        this.form.paymentable_id = response.data.paymentable_id
        this.form.paymentable_type = response.data.paymentable_type
        this.form.paymentable_name = response.data.paymentable_name
        this.form.notes = response.data.notes
        this.form.amount = response.data.amount
        response.data.details.forEach(element => {
          this.form.details.push({
            chart_of_account_id: element.chart_of_account_id,
            chart_of_account_name: element.chart_of_account_name,
            amount: element.amount,
            allocation_id: element.allocation_id,
            allocation_name: element.allocation_name,
            notes: element.notes
          })
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.payment_order_id = this.id
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/finance/bank/out/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.search()
  }
}
</script>
