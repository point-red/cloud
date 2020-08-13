<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('balance sheet') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :title="$t('balance sheet')"
        :header="false"
      >
        <p-form-row
          id="date"
          :label="$t('date')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              v-model="date"
              name="date"
              @input="load"
            />
          </div>
        </p-form-row>
        <hr>
        <div
          class="block"
          :class="{ 'block-mode-loading' : isLoading }"
        >
          <div class="block-content block-content-inner row">
            <div class="col-sm-6">
              <p-table>
                <tr slot="p-head">
                  <th colspan="2">
                    Asset
                  </th>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    ASSET LANCAR
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'CASH'
                      || chartOfAccount.type.name === 'CASH-BANK TRANSFER'
                      || chartOfAccount.type.name === 'BANK'
                      || chartOfAccount.type.name === 'SUPPLIES'
                      || chartOfAccount.type.name === 'INVENTORY'
                      || chartOfAccount.type.name === 'NOTE RECEIVABLE'
                      || chartOfAccount.type.name === 'ACCOUNT RECEIVABLE'
                      || chartOfAccount.type.name === 'ACCOUNT RECEIVABLE OF MANAGEMENT'
                      || chartOfAccount.type.name === 'ACCOUNT RECEIVABLE OF EMPLOYEE'
                      || chartOfAccount.type.name === 'OTHER ACCOUNT RECEIVABLE'
                      || chartOfAccount.type.name === 'PURCHASE DOWN PAYMENT'
                      || chartOfAccount.type.name === 'INCOME TAX RECEIVABLE'
                      || chartOfAccount.type.name === 'OTHER CURRENT ASSET'"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ chartOfAccount.alias }}</td>
                    <td class="text-right">
                      {{ chartOfAccount.total | numberFormat }}
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <td />
                  <td class="text-right font-w600">
                    {{ totalCurrentAsset | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    ASSET TETAP
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'FIXED ASSET'
                      || chartOfAccount.type.name === 'FIXED ASSET DEPRECIATION'
                      || chartOfAccount.type.name === 'OTHER ASSET'
                      || chartOfAccount.type.name === 'OTHER ASSET AMORTIZATION'"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ chartOfAccount.alias }}</td>
                    <td class="text-right">
                      {{ chartOfAccount.total | numberFormat }}
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <td />
                  <td class="text-right font-w600">
                    {{ totalFixedAsset | numberFormat }}
                  </td>
                </tr>
              </p-table>
            </div>
            <div class="col-sm-6">
              <p-table>
                <tr slot="p-head">
                  <th colspan="2">
                    Kewajiban & Modal
                  </th>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    KEWAJIBAN
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'NOTE PAYABLE'
                      || chartOfAccount.type.name === 'ACCOUNT PAYABLE'
                      || chartOfAccount.type.name === 'SALES DOWN PAYMENT'
                      || chartOfAccount.type.name === 'INCOME TAX PAYABLE'
                      || chartOfAccount.type.name === 'OTHER CURRENT LIABILITY'
                      || chartOfAccount.type.name === 'LONG TERM LIABILITY'"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ chartOfAccount.alias }}</td>
                    <td class="text-right">
                      {{ chartOfAccount.total | numberFormat }}
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <td />
                  <td class="text-right font-w600">
                    {{ totalLiability | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    MODAL
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'OWNER EQUITY' ||
                      chartOfAccount.type.name === 'SHAREHOLDER DISTRIBUTION' ||
                      chartOfAccount.type.name === 'RETAINED EARNING'"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ chartOfAccount.alias }}</td>
                    <td class="text-right">
                      {{ chartOfAccount.total | numberFormat }}
                    </td>
                  </tr>
                  <tr
                    v-if="chartOfAccount.name === 'NET INCOME FOR THE MONTH'"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ chartOfAccount.alias }}</td>
                    <td class="text-right">
                      {{ totalProfitAndLossNet | numberFormat }}
                    </td>
                  </tr>
                  <tr
                    v-if="chartOfAccount.name === 'NET INCOME FOR THE YEAR'"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ chartOfAccount.alias }}</td>
                    <td class="text-right">
                      {{ chartOfAccount.total | numberFormat }}
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <td />
                  <td class="text-right font-w600">
                    {{ totalEquity + totalProfitAndLossNet | numberFormat }}
                  </td>
                </tr>
              </p-table>
            </div>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-sm-6">
            <p-table>
              <tr slot="p-head">
                <th>Total Asset</th>
                <th class="text-right font-w600">
                  {{ totalAsset | numberFormat }}
                </th>
              </tr>
            </p-table>
          </div>
          <div class="col-sm-6">
            <p-table>
              <tr slot="p-head">
                <th>Total Kewajiban & Modal</th>
                <th class="text-right font-w600">
                  {{ totalLiability + totalEquity + totalProfitAndLossNet | numberFormat }}
                </th>
              </tr>
            </p-table>
          </div>
        </div>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  data () {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      isLoading: false,
      totalAsset: 0,
      totalCurrentAsset: 0,
      totalFixedAsset: 0,
      totalLiability: 0,
      totalEquity: 0,
      totalSalesIncome: 0,
      totalCostOfSales: 0,
      totalFactoryOverheadCost: 0,
      totalDirectExpense: 0,
      totalOtherExpense: 0,
      totalOtherIncome: 0,
      totalProfitAndLossGross: 0,
      totalProfitAndLossOperation: 0,
      totalProfitAndLossNonOperation: 0,
      totalProfitAndLossNet: 0
    }
  },
  computed: {
    ...mapGetters('accountingBalanceSheet', ['chartOfAccounts'])
  },
  created () {
    this.load()
  },
  methods: {
    ...mapActions('accountingBalanceSheet', ['get']),
    load () {
      this.isLoading = true
      this.get({
        params: {
          date: this.date
        }
      }).then(response => {
        this.isLoading = false
        this.chartOfAccounts.forEach(element => {
          if (element.type.name === 'CASH' ||
            element.type.name === 'CASH-BANK TRANSFER' ||
            element.type.name === 'BANK' ||
            element.type.name === 'SUPPLIES' ||
            element.type.name === 'INVENTORY' ||
            element.type.name === 'NOTE RECEIVABLE' ||
            element.type.name === 'ACCOUNT RECEIVABLE' ||
            element.type.name === 'ACCOUNT RECEIVABLE OF MANAGEMENT' ||
            element.type.name === 'ACCOUNT RECEIVABLE OF EMPLOYEE' ||
            element.type.name === 'OTHER ACCOUNT RECEIVABLE' ||
            element.type.name === 'PURCHASE DOWN PAYMENT' ||
            element.type.name === 'INCOME TAX RECEIVABLE' ||
            element.type.name === 'OTHER CURRENT ASSET') {
            this.totalCurrentAsset += element.total
          } else if (element.type.name === 'FIXED ASSET' ||
            element.type.name === 'FIXED ASSET DEPRECIATION' ||
            element.type.name === 'OTHER ASSET' ||
            element.type.name === 'OTHER ASSET AMORTIZATION') {
            this.totalFixedAsset += element.total
          } else if (element.type.name === 'NOTE PAYABLE' ||
            element.type.name === 'ACCOUNT PAYABLE' ||
            element.type.name === 'SALES DOWN PAYMENT' ||
            element.type.name === 'INCOME TAX PAYABLE' ||
            element.type.name === 'OTHER CURRENT LIABILITY' ||
            element.type.name === 'LONG TERM LIABILITY') {
            this.totalLiability += element.total
          } else if (element.type.name === 'OWNER EQUITY' ||
            element.type.name === 'SHAREHOLDER DISTRIBUTION' ||
            element.type.name === 'RETAINED EARNING' ||
            element.type.name === 'NET INCOME') {
            this.totalEquity += element.total
          } else if (element.type.name === 'SALES INCOME') {
            this.totalSalesIncome += element.total
          } else if (element.type.name === 'COST OF SALES') {
            this.totalCostOfSales += element.total
          } else if (element.type.name === 'DIRECT EXPENSE') {
            this.totalDirectExpense += element.total
          } else if (element.type.name === 'OTHER INCOME') {
            this.totalOtherIncome += element.total
          } else if (element.type.name === 'OTHER EXPENSE') {
            this.totalOtherExpense += element.total
          } else if (element.type.name === 'FACTORY OVERHEAD COST') {
            this.totalFactoryOverheadCost += element.total
          }
        })

        this.totalProfitAndLossGross = this.totalSalesIncome - this.totalCostOfSales
        this.totalProfitAndLossOperation = this.totalProfitAndLossGross - this.totalDirectExpense - this.totalFactoryOverheadCost
        this.totalProfitAndLossNet = this.totalProfitAndLossOperation + this.totalOtherIncome - this.totalOtherExpense
        this.totalAsset = this.totalCurrentAsset + this.totalFixedAsset
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
