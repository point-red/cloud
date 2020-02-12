<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">{{ $t('profit & loss') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block title="Profit & Loss" :header="false">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <p-form-row
                id="date-from"
                :label="$t('date from')">
                <div slot="body" class="col-lg-9">
                  <p-month-picker
                    name="date_from"
                    v-model="date"/>
                </div>
              </p-form-row>
              <p-form-row
                id="date-to"
                :label="$t('date to')">
                <div slot="body" class="col-lg-9">
                  <p-month-picker
                    name="date_to"
                    v-model="date"/>
                </div>
              </p-form-row>
              <hr>
              <p-table>
                <tr slot="p-head">
                  <th></th>
                  <th class="text-right">FEB 2020</th>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">PENDAPATAN OPERATIONAL</td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                <tr
                  v-if="chartOfAccount.type.name === 'sales income'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                </template>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalSalesIncome | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">BEBAN POKOK PENJUALAN</td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                <tr
                  v-if="chartOfAccount.type.name === 'cost of sales'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                </template>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalCostOfSales | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr slot="p-body">
                  <td class="font-w600">LABA (RUGI) KOTOR</td>
                  <td class="text-right font-w600">{{ totalProfitAndLossGross | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">BEBAN OPERASIONAL</td>
                </tr>
                <tr
                  v-for="(chartOfAccount, index) in chartOfAccounts"
                  v-if="chartOfAccount.type.name === 'direct expense'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalDirectExpense | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr slot="p-body">
                  <td class="font-w600">LABA (RUGI) OPERATIONAL</td>
                  <td class="text-right font-w600">{{ totalProfitAndLossOperation | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">PENDAPATAN NON OPERATIONAL</td>
                </tr>
                <tr
                  v-for="(chartOfAccount, index) in chartOfAccounts"
                  v-if="chartOfAccount.type.name === 'other income'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalOtherIncome | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">BEBAN NON OPERATIONAL</td>
                </tr>
                <tr
                  v-for="(chartOfAccount, index) in chartOfAccounts"
                  v-if="chartOfAccount.type.name === 'other expense'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalOtherExpense | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr slot="p-body">
                  <td class="font-w600">LABA (RUGI) BERSIH</td>
                  <td class="text-right font-w600">{{ totalProfitAndLossNet | numberFormat }}</td>
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
  data () {
    return {
      isLoading: false,
      date: new Date(),
      totalSalesIncome: 0,
      totalCostOfSales: 0,
      totalDirectExpense: 0,
      totalOtherExpense: 0,
      totalOtherIncome: 0,
      totalProfitAndLossGross: 0,
      totalProfitAndLossOperation: 0,
      totalProfitAndLossNonOperation: 0,
      totalProfitAndLossNet: 0
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  computed: {
    ...mapGetters('accountingBalanceSheet', ['chartOfAccounts'])
  },
  methods: {
    ...mapActions('accountingBalanceSheet', {
      getChartOfAccounts: 'get'
    })
  },
  created () {
    this.isLoading = true
    this.getChartOfAccounts()
      .then((response) => {
        this.isLoading = false
        this.chartOfAccounts.forEach(element => {
          if (element.type.name === 'sales income') {
            this.totalSalesIncome += element.total
          } else if (element.type.name === 'cost of sales') {
            this.totalCostOfSales += element.total
          } else if (element.type.name === 'direct expense') {
            this.totalDirectExpense += element.total
          } else if (element.type.name === 'other income') {
            this.totalOtherIncome += element.total
          } else if (element.type.name === 'other expense') {
            this.totalOtherExpense += element.total
          }
        })

        this.totalProfitAndLossGross = this.totalSalesIncome - this.totalCostOfSales
        this.totalProfitAndLossOperation = this.totalProfitAndLossGross - this.totalDirectExpense
        this.totalProfitAndLossNet = this.totalProfitAndLossOperation + this.totalOtherIncome - this.totalOtherExpense
      })
  }
}
</script>
