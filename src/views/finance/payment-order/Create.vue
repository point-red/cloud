<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('payment order') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('payment order')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="date"
                name="date"
                label="Date"
                v-model="form.date"
                :errors="form.errors.get('date')"
                @errors="form.errors.set('date', null)"/>
            </div>
          </p-form-row>

          <p-form-row
            id="payment-type"
            name="payment-type"
            :label="$t('payment type')">
            <div slot="body" class="col-lg-9">                
              <p-form-check-box
                class="mb-0"
                style="float:left"
                id="payment-type"
                name="payment-type"
                @click.native="choosePaymentType('cash')"
                :checked="form.payment_type == 'cash'"
                :description="$t('cash')"/>
              <p-form-check-box
                id="payment-type"
                name="payment-type"
                @click.native="choosePaymentType('bank')"
                :checked="form.payment_type == 'bank'"
                :description="$t('bank')"/>
            </div>
          </p-form-row>

          <p-form-row
            id="payment-to"
            name="payment-to"
            :label="$t('payment to')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-paymentable id="paymentable" v-model="form.paymentable_id" @choosen="choosePaymentTo" :label="form.paymentable_name"/>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h3>Detail</h3>
          <hr>
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
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="row.allocation_id"
                  :label="row.allocation_name"
                  @choosen="chooseAllocation($event, row)"/>
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
            <i class="fa fa-plus"/> Add
          </button>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-6">
              <textarea rows="10" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
            </div>
            <div class="col-sm-6">
              <h3>Approver</h3>
              <hr>
              <p-form-row
                id="approver"
                name="approver"
                :label="$t('approver')">
                <div slot="body" class="col-lg-9 mt-5">
                  <m-user
                    :id="'user'"
                    v-model="form.approver_id"
                    :errors="form.errors.get('approver_id')"
                    @errors="form.errors.set('approver_id', null)"/>
                </div>
              </p-form-row>
            </div>
          </div>

          <p-separator></p-separator>

          <div class="form-group row">
            <div class="col-md-12">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
              </button>
            </div>
          </div>
        </p-block-inner>        
      </p-block>
    </form>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        due_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: null,
        paymentable_id: null,
        paymentable_type: null,
        paymentable_name: null,
        approver_id: null,
        disbursed: true,
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
    chooseAllocation (allocation, row) {
      row.allocation_name = allocation
    },
    chooseAccount (account, row) {
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
    calculate: debounce (function () {
      var totalAmount = 0
      this.form.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.form.amount = totalAmount
    }, 300),
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
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
