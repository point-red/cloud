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
      <span class="breadcrumb-item">
        <router-link to="/finance/cash/out/create">{{
          $t('create cash out') | uppercase
        }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{
        $t('preview') | uppercase
      }}</span>
    </breadcrumb>

    <!-- Menu Cash Out Preview -->
    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <!-- Cash Out Preview Additional Information -->
          <div class="row">
            <!-- Table Cash Out Preview -->
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
                  <td>{{ form.reference_number }}</td>
                </tr>
                <!-- Cash Account -->
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('cash account') | uppercase }}
                  </td>
                  <td>
                    {{ form.payment_account_name | uppercase }}
                  </td>
                </tr>
              </table>
            </div>
            <!-- Cash Out Preview Information User -->
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
          <hr>
          <!-- Payment Menu -->
          <div>
            <h5 class="pl-1 pt-20">
              <!-- Payment Order -->
              <span v-if="form.referenceable_type === 'PaymentOrder'">
                {{ $t('payment order') | uppercase }}
              </span>
              <!-- Down Payment -->
              <span v-if="form.referenceable_type === 'PurchaseDownPayment'">
                {{ $t('down payment') | uppercase }}
              </span>
            </h5>
            <!-- Table Payment -->
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
                  <div v-if="form.referenceable_type == 'CashAdvance'">
                    <p-form-number
                      :id="'amount-' + index"
                      v-model="row.amount"
                      :name="'amount-' + index"
                      @keyup.native="calculate()"
                    />
                  </div>
                  <div v-else>
                    {{ row.amount | numberFormat }}
                  </div>
                </td>
              </tr>
            </point-table>
          </div>
          <!--  Cash Advance Menu -->
          <div>
            <h5 class="pl-1 pt-20">
              {{ $t('cash advance') | uppercase }}
            </h5>
            <!-- Table Cash Advance -->
            <point-table>
              <tr
                slot="p-head"
                class="text-left"
              >
                <th>Reference</th>
                <th>Notes</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Amount Remaining</th>
                <th class="text-center">
                  Close
                </th>
              </tr>
              <tr
                v-for="(row, index) in form.formCashAdvance.details"
                slot="p-body"
                :key="index"
                class="text-left"
              >
                <td>
                  <span> ca00123 </span>
                </td>
                <td>Notes</td>
                <td>kas kas kecil Lorem.</td>
                <td>100.000</td>
                <td>50.000</td>
                <td class="text-center">
                  <input
                    v-model="
                      form.formCashAdvance.details[index].cashAdvance_close
                    "
                    type="checkbox"
                    style="min-width: auto"
                    disabled
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
                      {{ form.amount | numberFormat }}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Cash Advance</th>
                    <td class="text-right">
                      {{ form.amount | numberFormat }}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Cash Out</th>
                    <td class="text-right">
                      {{ form.amount | numberFormat }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Cash Out Additional Information -->
          <div class="row mt-30">
            <!-- Cash Out Note -->
            <div class="col-sm-9 col-lg-5 pb-30">
              <h6>{{ $t('notes') | uppercase }}</h6>
              <pre>{{ form.notes }}</pre>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <!-- Cash Out Signature -->
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
                  <!-- Button Cash Out Go Back -->
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-10"
                    @click="goBack()"
                  >
                    {{ $t('Go Back') | uppercase }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
// Import Library & Components
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
// Import Vuex
import { mapGetters } from 'vuex'

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
      // Data Default From Preview
      isFromPreview: false,
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
        disbursed: true,
        notes: null,
        amount: 0,
        details: {},
        formCashAdvance: {
          details: [
            {
              cashAdvance_id: null,
              cashAdvance_reference: null,
              cashAdvance_account_name: null,
              cashAdvance_notes: null,
              cashAdvance_amount: 0,
              cashAdvance_amount_remaining: 0,
              cashAdvance_close: false
            }
          ]
        }
      })
    }
  },

  computed: {
    // Get Data from Vuex Store
    // Auth User
    ...mapGetters('auth', ['authUser'])
  },

  created () {
    // Created Data
    // Get Data from Local Storage
    this.getDataFromStorage()
  },

  mounted () {
    // Mounted Data
    // Initialization Data Source with Params Source
    this.source = this.$route.params.source
    console.log(this.source)
  },

  methods: {
    // Get Data From Local Storage
    getDataFromStorage () {
      var data = JSON.parse(localStorage.getItem('formData'))
      console.log(data)
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
        this.form.formCashAdvance.details = data.formCashAdvance.details
      }
    },
    // Go Back to Cash Out Create Page
    goBack () {
      this.$router.push('/finance/cash/out/create')
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
