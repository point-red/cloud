<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">{{ $t('balance sheet') | titlecase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :title="$t('balance sheet')"
        :header="true"
        column="col-sm-12">
        <p-form-row
          id="date"
          :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              name="date"
              @input="load"
              v-model="date"/>
          </div>
        </p-form-row>
        <hr>
        <div class="block" :class="{ 'block-mode-loading' : loading }">
          <div class="block-content block-content-inner row">
            <div class="col-sm-6">
              <p-table>
                <tr slot="p-head">
                  <th colspan="2">Asset</th>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">ASSET LANCAR</td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                <tr v-if="chartOfAccount.type.name === 'cash'
                    || chartOfAccount.type.name === 'bank'
                    || chartOfAccount.type.name === 'note receivable'
                    || chartOfAccount.type.name === 'inventory'
                    || chartOfAccount.type.name === 'account receivable'
                    || chartOfAccount.type.name === 'other account receivable'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                </template>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalCurrentAsset | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">ASSET TETAP</td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                <tr v-if="chartOfAccount.type.name === 'fixed asset'
                    || chartOfAccount.type.name === 'fixed asset depreciation'
                    || chartOfAccount.type.name === 'other asset'
                    || chartOfAccount.type.name === 'other asset amortization'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                </template>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalFixedAsset | numberFormat }}</td>
                </tr>
              </p-table>
            </div>
            <div class="col-sm-6">
              <p-table>
                <tr slot="p-head">
                  <th colspan="2">Kewajiban & Modal</th>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">KEWAJIBAN</td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                <tr v-if="chartOfAccount.type.name === 'current liability'
                    || chartOfAccount.type.name === 'other current liability'
                    || chartOfAccount.type.name === 'long term liability'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                </template>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalLiability | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td colspan="2" class="font-w600">MODAL</td>
                </tr>
                <template v-for="(chartOfAccount, index) in chartOfAccounts">
                <tr v-if="chartOfAccount.type.name === 'owner equity' || chartOfAccount.type.name === 'shareholder distribution'"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.alias }}</td>
                  <td class="text-right">{{ chartOfAccount.total | numberFormat }}</td>
                </tr>
                </template>
                <tr slot="p-body">
                  <td></td>
                  <td class="text-right font-w600">{{ totalEquity | numberFormat }}</td>
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
                <th class="text-right font-w600">{{ totalAsset | numberFormat }}</th>
              </tr>
            </p-table>
          </div>
          <div class="col-sm-6">
            <p-table>
              <tr slot="p-head">
                <th>Total Kewajiban & Modal</th>
                <th class="text-right font-w600">{{ totalLiability + totalEquity | numberFormat }}</th>
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
  data () {
    return {
      date: this.$moment(),
      loading: false,
      totalAsset: 0,
      totalCurrentAsset: 0,
      totalFixedAsset: 0,
      totalLiability: 0,
      totalEquity: 0,
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
    ...mapActions('accountingBalanceSheet', ['get']),
    load () {
      this.loading = true
      this.get({
        params: {
          date: this.date
        }
      }).then((response) => {
        this.loading = false
        this.chartOfAccounts.forEach(element => {
          if (element.type.name === 'cash' || element.type.name === 'bank' || element.type.name === 'note receivable' || element.type.name === 'inventory' || element.type.name === 'account receivable' || element.type.name === 'other account receivable') {
            this.totalCurrentAsset += element.total
          } else if (element.type.name === 'fixed asset' || element.type.name === 'fixed asset depreciation' || element.type.name === 'other asset' || element.type.name === 'other asset amortization') {
            this.totalFixedAsset += element.total
          } else if (element.type.name === 'current liability' || element.type.name === 'other current liability' || element.type.name === 'long term liability') {
            this.totalLiability += element.total
          } else if (element.type.name === 'owner equity' || element.type.name === 'shareholder distribution' || element.type.name === 'retained earning') {
            this.totalEquity += element.total
          } else if (element.type.name === 'sales income') {
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

        this.totalEquity = this.totalProfitAndLossNet
        this.totalAsset = this.totalCurrentAsset + this.totalFixedAsset
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.load()
  }
}
</script>
