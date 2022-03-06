<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/cash-advance"
        class="breadcrumb-item"
      >
        {{ $t('cash advance') | uppercase }}
      </router-link>
      <router-link
        :to="'/finance/cash-advance/' + cashAdvance.id"
        class="breadcrumb-item"
      >
        {{ cashAdvance.form.number }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block :title="$t('cash advance')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('cash advance') | uppercase }}</h4>
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
                {{ $t('employee') | uppercase }} :
              </h6>
              <span
                class="select-link"
                @click="$refs.employee.show()"
              >
                {{ form.employee_name || $t('select') | uppercase }}
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
              <th>Amount</th>
              <th>Notes</th>
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
                <p-form-number
                  :id="'amount-' + index"
                  v-model="row.amount"
                  :name="'amount-' + index"
                  @keyup.native="calculate()"
                />
              </td>
              <td>
                <p-form-input
                  :id="'notes-' + index"
                  v-model="row.notes"
                  :name="'notes-' + index"
                />
              </td>
            </tr>
          </point-table>
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
                {{ $t('created by') | uppercase }}
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
      :type="form.payment_type"
      @choosen="onChoosenAccount"
    />
    <m-user
      ref="approver"
      :permission="'approve cash advance'"
      @choosen="chooseApprover($event)"
    />
    <m-employee
      id="employee"
      ref="employee"
      @input="chooseEmployeeToId"
      @choosen="chooseEmployeeToName"
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
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      form: new Form({
        id: this.$route.params.id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'cash',
        employee_id: null,
        employee_name: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        notes: null,
        number: null,
        amount_remaining: null,
        activity: 'Update Form',
        details: [{
          chart_of_account_id: null,
          chart_of_account_name: null,
          amount: null,
          notes: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('financeCashAdvance', ['cashAdvance']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('financeCashAdvance', ['update']),
    ...mapActions('financeCashAdvance', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    addRow () {
      this.form.details.push({
        chart_of_account_id: null,
        chart_of_account_name: null,
        amount: null,
        notes: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.details, index)
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
        this.form.details.forEach((details) => {
          details.chart_of_account_id = null
          details.chart_of_account_name = null
        })
      }
    },
    chooseEmployeeToId (id) {
      this.form.employee_id = id
    },
    chooseEmployeeToName (name) {
      this.form.employee_name = name
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
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          this.$router.push('/finance/cash-advance/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    search () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'form;' +
            'employee;' +
            'details.account;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.mapForm(response.data)
        this.isLoading = false
        this.calculate()
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    mapForm (data) {
      this.form.date = data.form.date
      this.form.payment_type = data.payment_type.toLowerCase()
      this.form.employee_id = data.employee.id
      this.form.employee_name = data.employee.name
      this.form.request_approval_to = data.form.request_approval_to.id
      this.form.approver_name = data.form.request_approval_to.name
      this.form.approver_email = data.form.request_approval_to.email
      this.form.notes = data.form.notes
      this.form.number = data.form.number
      this.form.amount_remaining = data.form.amount_remaining
      this.form.details[0].chart_of_account_id = data.details[0].account.id
      this.form.details[0].chart_of_account_name = '[' + data.details[0].account.number + '] ' + data.details[0].account.alias
      this.form.details[0].amount = data.details[0].amount
      this.form.details[0].notes = data.details[0].notes
    }
  }
}
</script>
