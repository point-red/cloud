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
      <span class="breadcrumb-item active">{{
        $t('cash out create') | uppercase
      }}</span>
    </breadcrumb>

    <!-- Menu Cash Out Create -->
    <!-- Form -->
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <!-- Cash Out Create Additional Information -->
          <div class="row">
            <!-- Table Cash Out -->
            <div class="col-sm-6">
              <h4>{{ $t('cash out') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <!-- Required Date -->
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('required date') | uppercase }}
                  </td>
                  <td>{{ Date.now() | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <!-- Reference Cash Out -->
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.selectReferenceCashOut.open()"
                    >
                      {{ form.reference_number || $t('select') | uppercase }}
                    </span>
                  </td>
                </tr>
                <!-- Cash Account -->
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('cash account') | uppercase }}
                  </td>
                  <td>
                    <span
                      v-if="form.reference_number"
                      class="select-link"
                      multiple
                      @click="$refs.chartOfAccountCashRef.open()"
                    >
                      {{
                        form.payment_account_name || $t('select') | uppercase
                      }}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <!-- Cash Out Create Information User -->
            <div class="col-sm-6 text-right py-20 py-sm-0">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="authUser.branch">
                <br v-if="authUser.branch.address">{{
                  authUser.branch.address | uppercase
                }}
                <br v-if="authUser.branch.phone">{{
                  authUser.branch.phone | uppercase
                }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('to') | uppercase }} :
              </h6>
              {{ form.paymentable_name }}
            </div>
          </div>

          <div v-if="form.reference_number && form.payment_account_name">
            <!-- Button Sub Menu Cash Out -->
            <div class="row mt-10 mb-20">
              <div class="col">
                <!-- Payment -->
                <button
                  type="button"
                  class="btn btn-md btn-light mr-10"
                  :class="{ active: isShowPayment === true }"
                  href="javascript:void(0)"
                  @click="showPayment()"
                >
                  <!-- Payment Order -->
                  <span v-if="form.referenceable_type === 'PaymentOrder'">
                    {{ $t('Payment Order') }}
                  </span>
                  <!-- Down Payment -->
                  <span
                    v-if="form.referenceable_type === 'PurchaseDownPayment'"
                  >
                    {{ $t('Down Payment') }}
                  </span>
                </button>
                <!-- Cash Advance -->
                <button
                  v-if="form.referenceable_type === 'PaymentOrder'"
                  type="button"
                  class="btn btn-md btn-light"
                  :class="{ active: isShowCashAdvance === true }"
                  href="javascript:void(0)"
                  @click="showCashAdvance()"
                >
                  Cash Advance
                </button>
              </div>
            </div>
            <hr>
            <!-- Payment Order Menu -->
            <div v-show="isShowPayment">
              <!-- Table Payment Order -->
              <point-table>
                <tr slot="p-head">
                  <th>Payment</th>
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
                  <th>{{ form.reference_number }}</th>
                  <td>{{ row.chart_of_account_label }}</td>
                  <td>{{ row.notes }}</td>
                  <td>{{ row.allocation_name }}</td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </point-table>
            </div>
            <!--  Cash Advance Menu -->
            <div v-show="isShowCashAdvance">
              <!-- Table Cash Advance -->
              <point-table>
                <tr
                  slot="p-head"
                  class="text-left"
                >
                  <th>Reference</th>
                  <th>Notes</th>
                  <th>Amount</th>
                  <th>Amount Remaining</th>
                  <th>Amount Usage</th>
                  <th class="text-center">
                    Close
                  </th>
                </tr>
                <tr
                  slot="p-body"
                  class="text-left"
                >
                  <th>
                    <span
                      class="select-link"
                      @click="$refs.selectReferenceCashAdvance.open()"
                    >
                      {{
                        form.cash_advance.reference_number ||
                          $t('select') | uppercase
                      }}
                    </span>
                  </th>
                  <td>{{ form.cash_advance.notes }}</td>
                  <td>{{ form.cash_advance.amount | numberFormat }}</td>
                  <td>
                    {{ form.cash_advance.amount_remaining | numberFormat }}
                  </td>
                  <td>
                    {{ form.cash_advance.amount_usage | numberFormat }}
                  </td>
                  <td class="text-center">
                    <input
                      v-model="form.cash_advance.close"
                      type="checkbox"
                      style="min-width: auto"
                      :disabled="boxDisabled"
                    >
                  </td>
                </tr>
              </point-table>
            </div>
            <br>
            <!-- Table Total Cash Out -->
            <div class="row d-flex justify-content-end">
              <div class="col-lg-5">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <th v-if="form.referenceable_type === 'PaymentOrder'">
                        Total Payment Order
                      </th>
                      <th
                        v-if="form.referenceable_type === 'PurchaseDownPayment'"
                      >
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
            <!-- Cash Out Create Additional Information -->
            <div class="row mt-30">
              <!-- Cash Out Create Note -->
              <div class="col-sm-9 col-lg-5 pb-30">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <!-- Cash Out Create Signature -->
              <div class="col-sm-3 ml-auto text-center">
                <h6 class="mb-0">
                  {{ $t('created by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size: 11px"
                >
                  {{ form.date | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ authUser.full_name | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <!-- Button Cash Out -->
              <div class="col-sm-12">
                <hr>
                <div class="row text-center text-sm-left mt-20">
                  <div class="col">
                    <!-- Button Cash Out Save -->
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-10"
                      @click="toPreview()"
                    >
                      {{ $t('preview') | uppercase }}
                    </button>
                    <!-- Button Cash Out Preview -->
                    <button
                      type="submit"
                      class="btn btn-sm btn-primary"
                      :disabled="isSaving"
                    >
                      <i
                        v-show="isSaving"
                        class="fa fa-asterisk fa-spin"
                      />
                      {{ $t('save') | uppercase }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>

    <!-- Select Reference Cash Out Modal Component -->
    <m-select-reference-cash-out
      ref="selectReferenceCashOut"
      @choosen="chooseReferenceCashOut"
    />

    <!-- Select Cash Account Modal Component -->
    <m-chart-of-account
      ref="chartOfAccountCashRef"
      type="CASH"
      @choosen="onChoosenAccountCash"
    />

    <!-- Select Cash Advance Modal Component -->
    <m-select-reference-cash-advance
      ref="selectReferenceCashAdvance"
      @choosen="chooseReferenceCashAdvance"
    />
  </div>
</template>

<script>
// Import Library & Components
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
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
      // Data Default Loading
      isLoading: false,
      // Data Default Show Button Sub Menu Cash Out
      isShowPayment: true,
      isShowCashAdvance: false,
      // Data Default Disable Box
      boxDisabled: true,
      // Data Default Saving
      isSaving: false,
      // Data Default Form
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'cash',
        payment_account_id: null,
        payment_account_name: null,
        paymentable_id: null,
        paymentable_type: null,
        paymentable_name: null,
        notes: null,
        disbursed: true,
        amount: 0,
        amount_cash_advance: 0,
        amount_cash_out: 0,
        details: {},
        cash_advance: {
          id: null,
          reference_number: null,
          notes: null,
          amount: 0,
          amount_remaining: 0,
          amount_usage: 0,
          close: false
        }
      })
    }
  },

  computed: {
    // Get Data from Vuex Store
    // Payment Order
    ...mapGetters('financePaymentOrder', ['paymentOrder']),
    // Cash Advance
    ...mapGetters('financeCashAdvance', ['cashAdvances', 'pagination']),
    // Payment
    ...mapGetters('financePayment', ['payment']),
    // Auth User
    ...mapGetters('auth', ['authUser'])
  },

  created () {
    // Created Data
    // Get Data from Local Storage
    this.getDataFromStorage()
  },

  methods: {
    // Action Data from Vuex Store
    // Find Payment Order
    ...mapActions('financePaymentOrder', {
      find: 'find'
    }),
    // Create Payment
    ...mapActions('financePayment', {
      create: 'create'
    }),
    // Get Data From Local Storage
    getDataFromStorage () {
      // Get Data
      var data = JSON.parse(localStorage.getItem('formData'))
      // If Have Data In Local Storage
      if (data) {
        // Initialization Data from Local Storage for Reference Cash Out
        this.form.payment_type = 'cash'
        this.form.disbursed = true
        this.form.referenceable_id = data.referenceable_id
        this.form.referenceable_type = data.referenceable_type
        this.form.reference_number = data.reference_number
        this.form.paymentable_id = data.paymentable_id
        this.form.paymentable_type = data.paymentable_type
        this.form.paymentable_name = data.paymentable_name
        this.form.notes = data.notes
        this.form.amount = data.amount
        this.form.details = data.details
        // Initialization Data from Local Storage for Cash Account
        this.form.payment_account_id = data.payment_account_id
        this.form.payment_account_name = data.payment_account_name
        // Initialization Data from Local Storage for Cash Advance
        this.form.amount_cash_advance = data.amount_cash_advance
        this.form.amount_cash_out = data.amount_cash_out
        this.form.cash_advance = data.cash_advance
        // Initialization Data Disable Box to Active
        if (data.cash_advance.id && data.cash_advance.close === false) {
          this.boxDisabled = false
        } else if (
          data.cash_advance.amount_usage < data.cash_advance.amount_remaining
        ) {
          this.boxDisabled = false
        }
        // Remove Data from Local Storage
        localStorage.removeItem('formData')
      }
    },
    // Choose Reference Cash Out
    chooseReferenceCashOut () {
      // Initialization Data from Cash Out
      this.form.payment_type = 'cash'
      this.form.disbursed = true
      this.form.referenceable_id = this.payment.referenceable_id
      this.form.referenceable_type = this.payment.referenceable_type
      this.form.reference_number = this.payment.reference_number
      this.form.paymentable_id = this.payment.paymentable_id
      this.form.paymentable_type = this.payment.paymentable_type
      this.form.paymentable_name = this.payment.paymentable_name
      this.form.amount = this.payment.amount
      this.form.details = this.payment.details
      // Initialization Reset Data from Cash Account
      this.form.payment_account_id = null
      this.form.payment_account_name = null
      // Initialization Reset Data from Cash Advance
      this.form.cash_advance.id = null
      this.form.cash_advance.reference_number = null
      this.form.cash_advance.notes = null
      this.form.cash_advance.amount = 0
      this.form.cash_advance.amount_remaining = 0
      this.form.cash_advance.amount_usage = 0
      this.form.cash_advance.close = false
      // Initialization Reset Data from Cash Out
      this.form.amount_cash_advance = 0
      this.form.amount_cash_out = 0
      // Show Payment Menu
      this.showPayment()
    },
    // Choose Cash Account
    onChoosenAccountCash (account) {
      // Initialization Data from Cash Account
      this.form.payment_account_id = account.id
      this.form.payment_account_name = account.label
      // Initialization Reset Data from Cash Advance
      this.form.cash_advance.id = null
      this.form.cash_advance.reference_number = null
      this.form.cash_advance.notes = null
      this.form.cash_advance.amount = 0
      this.form.cash_advance.amount_remaining = 0
      this.form.cash_advance.amount_usage = 0
      this.form.cash_advance.close = false
      // Initialization Reset Data from Cash Out
      this.form.amount_cash_advance = 0
      this.form.amount_cash_out = 0
    },
    // Show Payment Menu
    showPayment () {
      this.isShowPayment = true
      this.isShowCashAdvance = false
    },
    // Show Cash Advance Menu
    showCashAdvance () {
      this.isShowPayment = false
      this.isShowCashAdvance = true
    },
    // Choose Cash Advance
    chooseReferenceCashAdvance (cashAdvance) {
      // Initialization Data from Cash Advance
      this.form.cash_advance.id = cashAdvance.id
      this.form.cash_advance.reference_number = cashAdvance.form.number
      this.form.cash_advance.notes = cashAdvance.details[0].notes
      this.form.cash_advance.amount = cashAdvance.amount
      this.form.cash_advance.amount_remaining = cashAdvance.amount_remaining
      this.form.cash_advance.amount_usage = 0
      this.form.cash_advance.close = false
      // Initialization Data from Cash Out
      this.form.amount_cash_advance = 0
      this.form.amount_cash_out = 0
      // Initialization Conditional Data from Cash Out
      if (this.form.cash_advance.amount_remaining >= this.form.amount) {
        // Initialization Data Cash Advance Amount Usage
        this.form.cash_advance.amount_usage = this.form.amount
        // Initialization Data Disable Box to Disable
        this.boxDisabled = false
      } else if (
        this.form.cash_advance.amount_remaining < this.form.amount &&
        this.form.cash_advance.amount_remaining > 0
      ) {
        // Initialization Data Cash Advance Amount Usage
        this.form.cash_advance.amount_usage =
          this.form.cash_advance.amount_remaining
        // Initialization Data Disable Box to Active
        this.boxDisabled = true
        // Check Closed Box
        this.check()
      }
      // Initialization Data Cash Out Amount Cash Advance
      this.form.amount_cash_advance = this.form.cash_advance.amount_usage
    },
    // Check Closed Box
    check () {
      this.form.cash_advance.close = true
    },
    // Calculate Data Amount Cash Out
    calculate: debounce(function () {
      // Initialization Data Amount Cash Out
      this.form.amount_cash_out =
        parseFloat(this.form.amount) - parseFloat(this.form.amount_cash_advance)
    }, 300),
    // Go to Preview Page
    toPreview () {
      // Save Data to Local Storage
      localStorage.setItem('formData', JSON.stringify(this.form))
      // Go to Preview Page with Params
      this.$router.push({
        name: 'finance.cash.out.create.preview',
        params: { source: 'create' }
      })
    },
    // Submit Data to Create Cash Out
    onSubmit () {
      // Is Saving
      this.isSaving = true
      // Push Date & Time when Saving
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      // Create Data to Push API
      this.create(this.form)
        // Success Create
        .then((response) => {
          // Is Saving
          this.isSaving = false
          // Get Notification Success
          this.$notification.success('create success')
          // Object Assign to Copy Data
          Object.assign(this.$data, this.$options.data.call(this))
          // Go to Show Page
          this.$router.push('/finance/cash/out/' + response.data.id)
        })
        // Fail Create
        .catch((error) => {
          // Is Saving
          this.isSaving = false
          // Get Notification Fail
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>

<style scoped>
/* Style for 0 Padding in Medium Layout */
@media screen and (min-width: 576px) {
  .py-sm-0 {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>
