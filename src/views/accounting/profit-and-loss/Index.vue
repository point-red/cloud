<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('profit & loss') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <p-form-row
                id="date-from"
                :label="$t('date from')"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-month-picker
                    v-model="date.start"
                    name="date_from"
                  />
                </div>
              </p-form-row>
              <p-form-row
                id="date-to"
                :label="$t('date to')"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-month-picker
                    v-model="date.end"
                    name="date_to"
                  />
                </div>
              </p-form-row>
              <hr>
              <p-table>
                <tr slot="p-head">
                  <th />
                  <th class="text-right" />
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    PENDAPATAN OPERATIONAL
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'SALES INCOME'"
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
                    {{ totalSalesIncome | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    BEBAN POKOK PENJUALAN
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'COST OF SALES'"
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
                    {{ totalCostOfSales | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">
&nbsp;
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    FACTORY OVERHEAD COST
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'FACTORY OVERHEAD COST'"
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
                    {{ totalFactoryOverheadCost | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">
&nbsp;
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="font-w600">
                    LABA (RUGI) KOTOR
                  </td>
                  <td class="text-right font-w600">
                    {{ totalProfitAndLossGross | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">
&nbsp;
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    BEBAN OPERASIONAL
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'DIRECT EXPENSE'"
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
                    {{ totalDirectExpense | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">
&nbsp;
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="font-w600">
                    LABA (RUGI) OPERATIONAL
                  </td>
                  <td class="text-right font-w600">
                    {{ totalProfitAndLossOperation | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">
&nbsp;
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    PENDAPATAN NON OPERATIONAL
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'OTHER INCOME'"
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
                    {{ totalOtherIncome | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td
                    colspan="2"
                    class="font-w600"
                  >
                    BEBAN NON OPERATIONAL
                  </td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                  <tr
                    v-if="chartOfAccount.type.name === 'OTHER EXPENSE'"
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
                    {{ totalOtherExpense | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">
&nbsp;
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="font-w600">
                    LABA (RUGI) BERSIH
                  </td>
                  <td class="text-right font-w600">
                    {{ totalProfitAndLossNet | numberFormat }}
                  </td>
                </tr>
              </p-table>
            </div>
          </div>
        </p-block-inner>
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
      isLoading: false,
      date: {
        start: this.$moment().format('YYYY-MM'),
        end: this.$moment().format('YYYY-MM')
      },
      totalSalesIncome: 0,
      totalCostOfSales: 0,
      totalDirectExpense: 0,
      totalOtherExpense: 0,
      totalFactoryOverheadCost: 0,
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
    this.isLoading = true
    this.getChartOfAccounts({
      params: {
        date_from: this.serverDateTime(this.date.start, 'start'),
        date_to: this.serverDateTime(this.date.end, 'end')
      }
    }).then(response => {
      this.totalSalesIncome = 0
      this.totalCostOfSales = 0
      this.totalDirectExpense = 0
      this.totalOtherIncome = 0
      this.totalOtherExpense = 0
      this.totalFactoryOverheadCost = 0

      this.chartOfAccounts.forEach(element => {
        if (element.type.name === 'SALES INCOME') {
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
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions('accountingBalanceSheet', {
      getChartOfAccounts: 'get'
    })
  }
}
</script>
