<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/cash"
        class="breadcrumb-item"
      >
        {{ $t('cash') | uppercase }}
      </router-link>
      <span class="breadcrumb-item">
        <router-link to="/finance/cash/out">{{ $t('out') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ payment.form.number }}</span>
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
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>
                    {{ payment.form.number | uppercase }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>
                    {{ payment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('cash account') | uppercase }}
                  </td>
                  <td>
                    {{ payment.payment_account.label | uppercase }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="payment.form.branch">
                {{ payment.form.branch.address | uppercase }}
                <br v-if="payment.form.branch.phone">{{ payment.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('to') | uppercase }} :
              </h6>
              {{ payment.paymentable_name }}
            </div>
          </div>

          <hr class="mt-30">

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Account
              </th>
              <th>Notes</th>
              <th>Allocation</th>
              <th class="text-right">
                Amount
              </th>
            </tr>
            <tr
              v-for="(row, index) in payment.details"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                {{ row.chart_of_account.label | uppercase }}
              </td>
              <td>
                {{ row.notes }}
              </td>
              <td>
                {{ row.allocation ? row.allocation.name : '' }}
              </td>
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
                {{ payment.amount | numberFormat }}
              </td>
            </tr>
          </point-table>

          <div class="row mt-50">
            <div class="col-sm-9">
              <h6>{{ $t('notes') | uppercase }}</h6>
              <pre>{{ payment.form.notes }}</pre>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('created by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                {{ payment.form.created_at | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ createdBy | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
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
      isSaving: false,
      isLoading: false,
      createdBy: localStorage.getItem('fullName'),
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        due_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'cash',
        payment_account_id: null,
        payment_account_name: null,
        paymentable_id: null,
        paymentable_type: null,
        paymentable_name: null,
        disbursed: false,
        notes: null,
        amount: 0,
        details: [{
          chart_of_account_id: null,
          chart_of_account_name: null,
          amount: null,
          allocation_id: null,
          allocation_name: null,
          notes: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('financePayment', ['payment']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    'form.date': function () {
      this.form.due_date = this.form.date
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('financePayment', ['find']),
    search () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'form.branch;' +
            'paymentAccount;' +
            'details.chartOfAccount;' +
            'details.allocation'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    calculate: debounce(function () {
      var totalAmount = 0
      this.form.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.form.amount = totalAmount
    }, 300)
  }
}
</script>
