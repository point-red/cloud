<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item">
        <router-link to="/finance/cash">{{ $t('cash') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item">
        <router-link to="/finance/cash/out">{{ $t('out') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('cash out') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('required date') | uppercase }}
                  </td>
                  <td>{{ Date.now() | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ form.reference_number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('cash account') | uppercase }}
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.chartOfAccountCashRef.open()"
                    >
                      {{ form.payment_account_name || $t('select') | uppercase }}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="authUser.branch">
                <br v-if="authUser.branch.address">{{ authUser.branch.address | uppercase }}
                <br v-if="authUser.branch.phone">{{ authUser.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('to') | uppercase }} :
              </h6>
              {{ form.paymentable_name }}
            </div>
          </div>

          <hr>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Account
              </th>
              <th>Notes</th>
              <th style="min-width: 120px">
                Allocation
              </th>
              <th class="text-right">
                Amount
              </th>
            </tr>
            <tr
              v-for="(row, index) in form.details"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>{{ row.chart_of_account_label }}</td>
              <td>{{ row.notes }}</td>
              <td>{{ row.allocation_name }}</td>
              <td class="text-right">
                {{ row.amount | numberFormat }}
              </td>
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                {{ form.amount | numberFormat }}
              </td>
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-9">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ form.notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('created by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                {{ form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ authUser.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-12">
              <hr>
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
    <m-chart-of-account
      ref="chartOfAccountCashRef"
      type="CASH"
      @choosen="onChoosenAccountCash"
    />
  </div>
</template>

<script>
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
        payment_type: 'cash',
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
  created () {
    console.log(this.payment)
    this.form.payment_type = 'cash'
    this.form.disbursed = true
    this.form.referenceable_id = this.payment.referenceable_id
    this.form.referenceable_type = this.payment.referenceable_type
    this.form.reference_number = this.payment.reference_number
    this.form.paymentable_id = this.payment.paymentable_id
    this.form.paymentable_type = this.payment.paymentable_type
    this.form.paymentable_name = this.payment.paymentable_name
    this.form.notes = this.payment.notes
    this.form.amount = this.payment.amount
    this.payment.details.forEach(element => {
      this.form.details.push({
        chart_of_account_id: element.chart_of_account_id,
        chart_of_account_label: element.chart_of_account_label,
        amount: element.amount,
        allocation_id: element.allocation_id,
        allocation_name: element.allocation_name,
        notes: element.notes
      })
    })
  },
  methods: {
    ...mapActions('financePaymentOrder', {
      find: 'find'
    }),
    ...mapActions('financePayment', {
      create: 'create'
    }),
    onChoosenAccountCash (account) {
      this.form.payment_account_id = account.id
      this.form.payment_account_name = account.label
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
          this.$router.push('/finance/cash/out/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
