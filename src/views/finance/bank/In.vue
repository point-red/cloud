<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/bank"
        class="breadcrumb-item"
      >
        {{ $t('bank') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('in') | uppercase }}</span>
    </breadcrumb>

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block :title="$t('bank in')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('bank in') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>
                    <!-- <p-date-picker
                      id="date"
                      name="date"
                      label="payment date"
                      v-model="form.date"
                      :errors="form.errors.get('date')"
                      @errors="form.errors.set('date', null)"/> -->
                    {{ form.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('bank account') | uppercase }}
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.chartOfAccountBankRef.open()"
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
              <span
                class="select-link"
                @click="$refs.paymentable.open()"
              >
                {{ form.paymentable_name || $t('select') | uppercase }}
              </span>
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
              <th>Amount</th>
              <th style="min-width: 120px">
                Allocation
              </th>
              <th />
            </tr>
            <tr
              v-for="(row, index) in form.details"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <span
                  class="select-link"
                  @click="$refs.chartOfAccountRef.open(index)"
                >
                  {{ row.chart_of_account_name || $t('select') | uppercase }}
                </span>
                <m-chart-of-account
                  :id="'item-' + index"
                  v-model="row.item_id"
                  :data-index="index"
                  :label="row.item_name"
                  @choosen="chooseAccount($event, row)"
                />
              </td>
              <td>
                <p-form-input
                  :id="'notes-' + index"
                  v-model="row.notes"
                  :name="'notes-' + index"
                />
              </td>
              <td>
                <p-form-number
                  :id="'amount-' + index"
                  v-model="row.amount"
                  :name="'amount-' + index"
                  @keyup.native="calculate()"
                />
              </td>
              <td>
                <span
                  class="select-link"
                  @click="$refs.allocation.open(index)"
                >
                  {{ row.allocation_name || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <i
                  class="btn btn-sm fa fa-times"
                  @click="deleteRow(index)"
                />
              </td>
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td>
                <p-form-number
                  :id="'amount'"
                  v-model="form.amount"
                  :name="'amount'"
                  :readonly="true"
                />
              </td>
              <td />
            </tr>
          </point-table>
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            @click="addRow"
          >
            <i class="fa fa-plus" /> {{ $t('add') | uppercase }}
          </button>

          <div class="row mt-50">
            <div class="col-sm-9">
              <textarea
                v-model="form.notes"
                rows="5"
                class="form-control"
                placeholder="Notes"
              />
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
                {{ Date.now() | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ createdBy | uppercase }}
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
    <Coa
      ref="chartOfAccountRef"
      @choosen="onChoosenAccount"
    />
    <m-chart-of-account
      ref="chartOfAccountBankRef"
      type="BANK"
      @choosen="onChoosenAccountBank"
    />
    <m-user
      ref="approver"
      @choosen="chooseApprover($event)"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <m-paymentable
      id="paymentable"
      ref="paymentable"
      @choosen="choosePaymentTo"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
import Coa from './Coa'

export default {
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbFinance,
    Coa
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      createdBy: localStorage.getItem('fullName'),
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        due_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'bank',
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
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    'form.date': function () {
      this.form.due_date = this.form.date
    }
  },
  methods: {
    ...mapActions('financePayment', ['create']),
    addRow () {
      this.form.details.push({
        chart_of_account_id: null,
        chart_of_account_name: null,
        amount: null,
        allocation_id: null,
        allocation_name: null,
        notes: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.details, index)
    },
    chooseAllocation (allocation) {
      const row = this.form.details[allocation.index]
      row.allocation_id = allocation.id
      row.allocation_name = allocation.name
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    onChoosenAccount (account) {
      const row = this.form.details[account.index]
      row.chart_of_account_id = account.id
      row.chart_of_account_name = account.label
    },
    onChoosenAccountBank (account) {
      console.log(account.id)
      this.form.payment_account_id = account.id
      console.log(this.form.payment_account_id)
      this.form.payment_account_name = account.label
    },
    choosePaymentTo (choosen) {
      this.form.paymentable_id = choosen.id
      this.form.paymentable_name = choosen.label
      this.form.paymentable_type = choosen.type
    },
    calculate: debounce(function () {
      var totalAmount = 0
      this.form.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.form.amount = totalAmount
    }, 300),
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/finance/bank/in/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
