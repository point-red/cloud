<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | uppercase }}
      </router-link>
    </breadcrumb>

    <purchase-menu />

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('purchase payment order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ number }}</td>
                </tr>
                <tr>
                  <td
                    v-if="form.payment_type"
                    class="font-weight-bold"
                  >
                    {{ $t('payment method') | uppercase }}
                  </td>
                  <td>{{ form.payment_type | uppercase }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <h6 class="mt-30 mb-5">
                {{ $t('supplier') | uppercase }} : {{ form.supplier_name | uppercase }}
              </h6>
            </div>
          </div>
          <hr>

          <div v-if="form.invoices.length > 0">
            <h5>{{ $t('invoice collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="20%">
                  Date
                </th>
                <th width="20%">
                  Form Number
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Available Invoice
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Amount Order
                </th>
              </tr>
              <template v-for="(row, index) in form.invoices">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.form_number }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.available_amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="form.downPayments.length > 0">
            <h5>{{ $t('down payment collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="20%">
                  Date
                </th>
                <th width="20%">
                  Form Number
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Available Down Payment
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Amount Order
                </th>
              </tr>
              <template v-for="(row, index) in form.downPayments">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.form_number }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.available_amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="form.returns.length > 0">
            <h5>{{ $t('return collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="20%">
                  Date
                </th>
                <th width="20%">
                  Form Number
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Available Return
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Amount Order
                </th>
              </tr>
              <template v-for="(row, index) in form.returns">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.form_number }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.available_amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="form.others.length > 0">
            <h5>{{ $t('other collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="25%">
                  Account
                </th>
                <th width="25%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Amount
                </th>
                <th
                  width="25%"
                  class="text-right"
                >
                  Allocation
                </th>
              </tr>
              <template v-for="(row, index) in form.others">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.coaName }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.allocationName | uppercase }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div class="row">
            <div class="col-sm-7" />
            <div class="col-sm-5">
              <point-table>
                <tr slot="p-body">
                  <td>Total Invoice</td>
                  <td class="text-right">
                    {{ form.total_invoice | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Down Payment</td>
                  <td class="text-right">
                    {{ form.total_down_payment | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Return</td>
                  <td class="text-right">
                    {{ form.total_return | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Other</td>
                  <td class="text-right">
                    {{ form.total_other | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Amount</td>
                  <td class="text-right">
                    {{ form.total_amount | numberFormat }}
                  </td>
                </tr>
              </point-table>
            </div>
          </div>

          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ form.notes }}
              </div>
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
                {{ form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ requestedBy | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('approved by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                &nbsp;
              </div>
              <div>{{ form.approver_name | uppercase }}</div>
              <div>{{ form.approver_email | lowercase }}</div>
            </div>

            <div class="col-sm-12">
              <hr>
              <button
                type="button"
                class="btn btn-block btn-sm btn-outline-secondary"
                @click="back()"
              >
                {{ $t('back') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import PurchaseMenu from '../Menu'
import PointTable from 'point-table-vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase,
    PurchaseMenu,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      requestedBy: localStorage.getItem('fullName'),
      form: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.getDataFromStorage()
  },
  methods: {
    getDataFromStorage () {
      this.isLoading = true
      this.form = JSON.parse(localStorage.getItem('purchasePaymentOrderData'))
      this.isLoading = false
    },
    back () {
      this.$router.push('/purchase/payment-order/create')
    }
  }
}
</script>
