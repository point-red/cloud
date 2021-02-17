<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block :title="$t('payment order')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('payment order') | uppercase }}</h4>
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
                      label="payment date"
                      :errors="form.errors.get('date')"
                      @errors="form.errors.set('date', null)"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('payment type') | uppercase }}
                  </td>
                  <td>
                    <p-form-check-box
                      id="payment-type"
                      class="mb-0"
                      style="float:left"
                      name="payment-type"
                      :checked="form.payment_type == 'cash'"
                      :description="$t('cash') | uppercase"
                      @click.native="choosePaymentType('cash')"
                    />
                    <p-form-check-box
                      id="payment-type"
                      name="payment-type"
                      class="mb-0"
                      :checked="form.payment_type == 'bank'"
                      :description="$t('bank') | uppercase"
                      @click.native="choosePaymentType('bank')"
                    />
                  </td>
                </tr>
              </table>
            </div>
            <div class="text-right col-sm-6">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="authUser.branch">
                <br v-if="authUser.branch.address">{{ authUser.branch.address | uppercase }}
                <br v-if="authUser.branch.phone">{{ authUser.branch.phone | uppercase }}
              </template>
              <h6 class="mb-5 mt-30">
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
            <div class="col-sm-6">
              <textarea
                v-model="form.notes"
                rows="5"
                class="form-control"
                placeholder="Notes"
              />
              <div class="mt-10 d-sm-block d-md-none" />
            </div>
            <div class="text-center col-sm-3">
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
              <div class="mt-10 d-sm-block d-md-none" />
            </div>
            <div class="text-center col-sm-3">
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
    <m-user
      ref="approver"
      :permission="'approve payment order'"
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
import Coa from './Coa'
import { mapGetters, mapActions } from 'vuex'

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
      requestedBy: localStorage.getItem('fullName'),
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        due_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'cash',
        paymentable_id: null,
        paymentable_type: null,
        paymentable_name: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
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
  created () {
  },
  methods: {
    ...mapActions('financePaymentOrder', ['create']),
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
    choosePaymentType (type) {
      if (type == this.form.payment_type) {
        this.form.payment_type = null
      } else {
        this.form.payment_type = type
      }
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
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/finance/payment-order')
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
