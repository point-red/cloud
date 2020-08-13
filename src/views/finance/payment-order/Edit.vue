<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :title="$t('payment order')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-date-picker
                id="date"
                v-model="form.date"
                name="date"
                label="Date"
                :errors="form.errors.get('date')"
                @errors="form.errors.set('date', null)"
              />
            </div>
          </p-form-row>

          <p-form-row
            id="payment-type"
            name="payment-type"
            :label="$t('payment type')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <template v-if="form.payment_type">
                <p-form-check-box
                  id="payment-type"
                  class="mb-0"
                  style="float:left"
                  name="payment-type"
                  :checked="form.payment_type.toLowerCase() == 'cash'"
                  :description="$t('cash')"
                  @click.native="choosePaymentType('cash')"
                />
                <p-form-check-box
                  id="payment-type"
                  name="payment-type"
                  :checked="form.payment_type.toLowerCase() == 'bank'"
                  :description="$t('bank')"
                  @click.native="choosePaymentType('bank')"
                />
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="payment-to"
            name="payment-to"
            :label="$t('payment to')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              <m-paymentable
                id="paymentable"
                v-model="form.paymentable_id"
                :label="form.paymentable_name"
                @choosen="choosePaymentTo"
              />
            </div>
          </p-form-row>

          <p-separator />

          <h5>Detail</h5>
          <hr>
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
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="row.allocation_id"
                  :label="row.allocation_name"
                  @choosen="chooseAllocation($event, row)"
                />
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

          <p-separator />

          <div class="row">
            <div class="col-sm-6">
              <textarea
                v-model="form.notes"
                rows="10"
                class="form-control"
                placeholder="Notes"
              />
            </div>
            <div class="col-sm-6">
              <h5>Approver</h5>
              <hr>
              <p-form-row
                id="approver"
                name="approver"
                :label="$t('approver')"
              >
                <div
                  slot="body"
                  class="col-lg-9 mt-5"
                >
                  <m-user
                    :id="'user'"
                    v-model="form.approver_id"
                    :errors="form.errors.get('approver_id')"
                    @errors="form.errors.set('approver_id', null)"
                  />
                </div>
              </p-form-row>
            </div>
          </div>

          <p-separator />

          <div class="form-group row">
            <div class="col-md-12">
              <button
                type="submit"
                class="btn btn-sm btn-primary"
                :disabled="isSaving"
              >
                <i
                  v-show="isSaving"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('update') | uppercase }}
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapActions } from 'vuex'

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
      form: new Form({
        id: null,
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
  created () {
    this.find({
      id: this.id,
      params: {
        includes: 'details.account;details.allocation;form.approvals.requestedBy;form.approvals.requestedTo'
      }
    }).then(response => {
      console.log(response)
      this.form.increment_group = this.$moment().format('YYYYMM')
      this.form.id = response.data.id
      this.form.date = response.data.form.date
      this.form.due_date = response.data.due_date
      this.form.payment_type = response.data.payment_type
      this.form.paymentable_id = response.data.paymentable_id
      this.form.paymentable_type = response.data.paymentable_type
      this.form.paymentable_name = response.data.paymentable_name
      this.form.approver_id = null
      this.form.disbursed = true
      this.form.notes = response.data.form.notes
      this.form.amount = response.data.amount
      this.form.details = response.data.details
    })
  },
  methods: {
    ...mapActions('financePaymentOrder', ['update', 'find']),
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
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
        })
        return
      }
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
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
