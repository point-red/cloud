<template>
  <div>
    <!-- Breadcrumb -->
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item">
        <router-link to="/finance/cash">{{
          $t('cash') | uppercase
        }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ payment.form.number }}</span>
    </breadcrumb>

    <!-- Form Delete Status -->
    <p-show-form-cancellation-status
      v-if="renderComponent"
      :form="'cash'"
      :is-loading="isLoading"
      :cancellation-status="payment.form.cancellation_status"
      :approved-by="payment.paymentable_name"
      :request-cancellation-reason="payment.form.request_cancellation_reason"
      :cancellation-approval-reason="payment.form.cancellation_approval_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <!-- Menu Cash Out Show -->
    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <!-- Button Actions Menu Cash Out Show -->
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <!-- Button Create Cash Out -->
                <router-link
                  v-if="$permission.has('create cash')"
                  :to="{ name: 'finance.cash.out.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <!-- Button Request Delete Cash Out -->
                <button
                  v-if="
                    payment.form.cancellation_status == null ||
                      payment.form.cancellation_status == -1
                  "
                  class="btn btn-sm btn-outline-secondary mr-5"
                  :disabled="isDeleting"
                  @click="$refs.formRequestDelete.open()"
                >
                  <i
                    v-show="isDeleting"
                    class="fa fa-asterisk fa-spin"
                  />
                  {{ $t('delete') | uppercase }}
                </button>
              </div>
            </div>
          </div>
          <hr>
          <!-- Cash Out Show Additional Information -->
          <!-- Table Cash Out Show -->
          <div class="row pt-10">
            <div class="col-sm-6">
              <h4>{{ $t('cash out') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <!-- Form Number -->
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>
                    {{ payment.form.number | uppercase }}
                  </td>
                </tr>
                <!-- Date -->
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>
                    {{ payment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </td>
                </tr>
                <!-- Cash Account -->
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
            <!-- Cash Out Show Information User -->
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="payment.form.branch">
                {{ payment.form.branch.address | uppercase }}
                <br v-if="payment.form.branch.phone">{{
                  payment.form.branch.phone | uppercase
                }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('to') | uppercase }} :
              </h6>
              {{ payment.paymentable_name }}
            </div>
          </div>
          <hr>
          <!-- Payment Menu -->
          <div>
            <h5 class="pl-1 pt-20">
              <span v-if="form.referenceableType === 'PaymentOrder'">
                {{ $t('payment order') | uppercase }}
              </span>
              <span v-if="form.referenceableType === 'PurchaseDownPayment'">
                {{ $t('down payment') | uppercase }}
              </span>
            </h5>
            <!-- Table Payment -->
            <point-table>
              <tr slot="p-head">
                <th style="min-width: 120px">
                  {{ $t('account') }}
                </th>
                <th>{{ $t('notes') }}</th>
                <th>
                  {{ $t('allocation') }}
                </th>
                <th class="text-right">
                  {{ $t('amount') }}
                </th>
              </tr>
              <tr
                v-for="(row, index) in payment.details"
                slot="p-body"
                :key="index"
              >
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
            </point-table>
          </div>
          <!--  Cash Advance Menu -->
          <div v-if="payment.cash_advance">
            <h5 class="pl-1 pt-20">
              {{ $t('cash advance') | uppercase }}
            </h5>
            <!-- Table Cash Advance -->
            <point-table>
              <tr
                slot="p-head"
                class="text-left"
              >
                <th>{{ $t('reference') }}</th>
                <th>{{ $t('notes') }}</th>
                <th>{{ $t('amount') }}</th>
                <th>{{ $t('amount remaining') }}</th>
                <th>{{ $t('amount usage') }}</th>
                <th class="text-center">
                  {{ $t('close') }}
                </th>
              </tr>
              <tr
                slot="p-body"
                class="text-left"
              >
                <th>
                  <span>
                    {{
                      payment.cash_advance.cash_advance.form.number | uppercase
                    }}
                  </span>
                </th>
                <td>{{ payment.cash_advance.cash_advance.form.notes }}</td>
                <td>
                  {{ payment.cash_advance.cash_advance.amount | numberFormat }}
                </td>
                <td>
                  {{
                    payment.cash_advance.cash_advance.amount_remaining
                      | numberFormat
                  }}
                </td>
                <td>
                  {{ payment.cash_advance.amount | numberFormat }}
                </td>
                <td class="text-center">
                  <span
                    v-if="payment.cash_advance.cash_advance.form.done === 0"
                  >
                    {{ $t('opened') }}
                  </span>
                  <span
                    v-if="payment.cash_advance.cash_advance.form.done === 1"
                  >
                    {{ $t('closed') }}
                  </span>
                </td>
              </tr>
            </point-table>
          </div>
          <!-- Table Total Cash Out -->
          <div class="row d-flex justify-content-end">
            <div class="col-lg-5">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th v-if="form.referenceableType === 'PaymentOrder'">
                      Total Payment Order
                    </th>
                    <th v-if="form.referenceableType === 'PurchaseDownPayment'">
                      Total Down Payment
                    </th>
                    <td class="text-right">
                      <p-form-number
                        :id="'amount'"
                        v-model="form.amount"
                        class="input-readonly"
                        :name="'amount'"
                        :readonly="true"
                        @input="calculate()"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Total Cash Advance</th>
                    <td class="text-right">
                      <p-form-number
                        :id="'amount_cash_advance'"
                        v-model="form.amount_cash_advance"
                        class="input-readonly"
                        :name="'amount_cash_advance'"
                        :readonly="true"
                        @input="calculate()"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Total Cash Out</th>
                    <td class="text-right">
                      <p-form-number
                        :id="'amount_cash_out'"
                        v-model="form.amount_cash_out"
                        :name="'amount_cash_out'"
                        :readonly="true"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Cash Out Show Information -->
          <div class="row mt-30">
            <!-- Cash Out Note -->
            <div class="col-sm-9">
              <h6>{{ $t('notes') | uppercase }}</h6>
              <pre>{{ payment.form.notes }}</pre>
            </div>
            <!-- Cash Out Signature -->
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('created by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size: 11px"
              >
                {{ payment.form.created_at | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ createdBy | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <!-- Form Request Delete Cash Out Modal Component -->
    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />
  </div>
</template>

<script>
// Import Library & Components
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'

import PointTable from 'point-table-vue'
// Import Vuex
import { mapGetters, mapActions } from 'vuex'

export default {
  // Use Library & Components
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },

  data () {
    return {
      // Data Default Render Component
      renderComponent: true,
      // Data Default Id
      id: this.$route.params.id,
      // Data Default Loading
      isLoading: false,
      // Data Default Deleting
      isDeleting: false,
      // Data Default Create By
      createdBy: localStorage.getItem('fullName'),
      // Data Default Form
      form: {
        referenceableType: null,
        amount: 0,
        amount_cash_advance: 0,
        amount_cash_out: 0
      }
    }
  },

  computed: {
    // Get Data from Vuex Store
    // Payment
    ...mapGetters('financePayment', ['payment']),
    // Auth User
    ...mapGetters('auth', ['authUser'])
  },

  watch: {
    // Watch Data for Date
    'form.date': function () {
      this.form.due_date = this.form.date
    }
  },

  created () {
    // Created Data
    // Get Data from Search Methods
    this.search()
  },

  methods: {
    // Force Render Component
    forceRerender () {
      // Removing my-component from the DOM
      this.renderComponent = false

      this.$nextTick(() => {
        // Adding the component back in
        this.renderComponent = true
      })
    },
    // Action Data from Vuex Store
    // Find, Delete, Cancel Approve & Reject Data Payment
    ...mapActions('financePayment', {
      find: 'find',
      delete: 'delete',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    // Filter Params Payment
    search () {
      // Loading
      this.isLoading = true
      // Find Data Payment with Params
      this.find({
        // Id
        id: this.id,
        params: {
          // Includes
          includes:
            'form;form.branch;paymentAccount;details.chartOfAccount;details.allocation;paymentable;details.referenceable.form;cashAdvance.cashAdvance.form'
        }
      })
        // Success
        .then((response) => {
          // Initialization Data Referenceable Type Payment
          this.form.referenceableType =
            this.payment.details[0].referenceable_type
          // Initialization Data Amount Payment
          this.form.amount = this.payment.amount
          this.form.amount_cash_advance = this.payment.cash_advance.amount
          // Loading
          this.isLoading = false
        })
        // Fail
        .catch((error) => {
          // Loading
          this.isLoading = false
        })
    },
    // Delete Data Payment
    onDelete (reason) {
      // Deleting
      this.isDeleting = true
      // Delete Data to Push API
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      })
        // Success Delete
        .then((response) => {
          // Delete
          this.isDeleting = false
          // Get Notification Success
          this.$notification.success('request delete success')
          // Force Render Component
          this.forceRerender()
          // Get Data from Search Method
          this.search()
        })
        // Fail Delete
        .catch((error) => {
          // Delete
          this.isDeleting = false
          // Get Notification Fail
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    // Cancel Approve for Delete Data Payment
    onCancellationApprove () {
      // Cancel Approve Delete Data to Push API
      this.cancellationApprove({
        id: this.id
      })
        // Success
        .then((response) => {
          // Get Notification Success
          this.$notification.success('cancellation approved')
          // Go To Cash Index Page
          this.$router.push('/finance/cash')
        })
        // Fail
        .catch((error) => {
          console.log(error.message)
        })
    },
    // Cancel Reject for Delete Data Payment
    onCancellationReject (reason) {
      // Cancel Rejected Delete Data to Push API
      this.cancellationReject({
        id: this.id,
        reason: reason
      })
        // Success
        .then((response) => {
          // Get Notification Success
          this.$notification.success('cancellation rejected')
          // Get Data from Search Method
          this.search()
        })
        // Fail
        .catch((error) => {
          console.log(error.message)
        })
    },
    // Calculate Data Amount Payment
    calculate: debounce(function () {
      // Initialization Data Amount Payment
      this.form.amount_cash_out =
        parseFloat(this.form.amount) - parseFloat(this.form.amount_cash_advance)
    }, 300)
  }
}
</script>
