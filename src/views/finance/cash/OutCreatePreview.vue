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
                <th>{{ $t('payment') }}</th>
                <th style="min-width: 120px">
                  {{ $t('account') }}
                </th>
                <th>{{ $t('notes') }}</th>
                <th style="min-width: 120px">
                  {{ $t('allocation') }}
                </th>
                <th class="text-right">
                  {{ $t('amount') }}
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
          <div v-if="form.cash_advance.reference_number">
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
                  <span v-if="form.cash_advance.close === true">
                    {{ $t('closed') }}
                  </span>
                  <span v-if="form.cash_advance.close === false">
                    {{ $t('opened') }}
                  </span>
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
                      {{ $t('total payment order') | titlecase }}
                    </th>
                    <th
                      v-if="form.referenceable_type === 'PurchaseDownPayment'"
                    >
                      {{ $t('total down payment') | titlecase }}
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
                    <th>{{ $t('total cash advance') | titlecase }}</th>
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
                    <th>{{ $t('total cash out') | titlecase }}</th>
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
                    {{ $t('go back') | uppercase }}
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
import debounce from 'lodash/debounce'
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
        amount_cash_advance: 0,
        amount_cash_out: 0,
        details: {},
        cash_advance: {}
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
  },

  methods: {
    // Get Data From Local Storage
    getDataFromStorage () {
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
      }
    },
    // Calculate Data Amount Cash Out
    calculate: debounce(function () {
      // Initialization Data Cash Out Amount Cash Out
      this.form.amount_cash_out =
        parseFloat(this.form.amount) - parseFloat(this.form.amount_cash_advance)
    }, 300),
    // Go Back to create cash out Page
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
