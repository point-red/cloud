<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <router-link to="/finance/payment-order" class="breadcrumb-item">{{ $t('payment order') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('payment order')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('payment order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">{{ $t('date') | uppercase }}</td>
                  <td>
                    <p-date-picker
                      id="date"
                      name="date"
                      label="payment date"
                      v-model="form.date"
                      :errors="form.errors.get('date')"
                      @errors="form.errors.set('date', null)"/>
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">{{ $t('payment type') | uppercase }}</td>
                  <td>
                    <p-form-check-box
                      class="mb-0"
                      style="float:left"
                      id="payment-type"
                      name="payment-type"
                      @click.native="choosePaymentType('cash')"
                      :checked="form.payment_type == 'cash'"
                      :description="$t('cash') | uppercase"/>
                    <p-form-check-box
                      id="payment-type"
                      name="payment-type"
                      class="mb-0"
                      @click.native="choosePaymentType('bank')"
                      :checked="form.payment_type == 'bank'"
                      :description="$t('bank') | uppercase"/>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">{{ authUser.tenant_name | uppercase }}</h6>
              <template v-if="authUser.branch">
                <br v-if="authUser.branch.address">{{ authUser.branch.address | uppercase }}
                <br v-if="authUser.branch.phone">{{ authUser.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">{{ $t('to') | uppercase }} :</h6>
              <span @click="$refs.paymentable.open()" class="select-link">
                {{ form.paymentable_name || $t('select') | uppercase }}
              </span>
            </div>
          </div>

          <hr class="mt-30">

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Account</th>
              <th>Notes</th>
              <th>Amount</th>
              <th style="min-width: 120px">Allocation</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.details" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <span @click="$refs.chartOfAccountRef.open(index)" class="select-link">
                  {{ row.chart_of_account_name || $t('select') | uppercase }}
                </span>
                <m-chart-of-account
                  :id="'item-' + index"
                  :data-index="index"
                  v-model="row.item_id"
                  @choosen="chooseAccount($event, row)"
                  :label="row.item_name"/>
              </td>
              <td>
                <p-form-input
                  :id="'notes-' + index"
                  :name="'notes-' + index"
                  v-model="row.notes"/>
              </td>
              <td>
                <p-form-number
                  :id="'amount-' + index"
                  :name="'amount-' + index"
                  v-model="row.amount"
                  @keyup.native="calculate()"/>
              </td>
              <td>
                <span @click="$refs.allocation.open(index)" class="select-link">
                  {{ row.allocation_name || $t('select') | uppercase }}
                </span>
              </td>
              <td>
                <i class="btn btn-sm fa fa-times" @click="deleteRow(index)"></i>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td>
                <p-form-number
                  :id="'amount'"
                  :name="'amount'"
                  :readonly="true"
                  v-model="form.amount"/>
              </td>
              <td></td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button>

          <div class="row mt-50">
            <div class="col-sm-6">
              <textarea rows="5" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ Date.now() | dateFormat('DD MMMM YYYY') }}</div>
              {{ requestedBy | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">_______________</div>
              <span @click="$refs.approver.open()" class="select-link">{{ form.approver_name || $t('select') | uppercase }}</span><br>
              <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
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
    <m-chart-of-account ref="chartOfAccountRef" @choosen="onChoosenAccount" type="DIRECT EXPENSE"/>
    <m-user ref="approver" @choosen="chooseApprover($event)"/>
    <m-allocation ref="allocation" @choosen="chooseAllocation($event)"/>
    <m-paymentable id="paymentable" ref="paymentable" @choosen="choosePaymentTo"/>
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
  watch: {
    'form.date': function () {
      this.form.due_date = this.form.date
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
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
      let row = this.form.details[allocation.index]
      row.allocation_id = allocation.id
      row.allocation_name = allocation.name
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    onChoosenAccount (account) {
      let row = this.form.details[account.index]
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
  },
  created () {
  }
}
</script>
