<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('ratio report') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-xl-3">
        <div class="block block-rounded block-themed">
          <div class="block-header bg-gray-darker">
            <h5 class="block-title" />
          </div>
          <div class="block-content block-content-full block-content-sm">
            <ul class="nav nav-pills flex-column push">
              <li class="nav-item">
                <span class="nav-link d-flex align-items-center">
                  LIQUIDITY RATIO
                </span>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="currentRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Current Ratio</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="cashRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Cash Ratio</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="acidTestRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Acid Test Ratio</span>
                </a>
              </li>
              <li class="nav-item">
                <span class="nav-link d-flex align-items-center">
                  PROFITABILITY RATIO
                </span>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="grossProfitRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Gross Profit Ratio</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="netProfitMargin"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Net Profit Margin</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="rateOfReturnInvestment"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Rate of Return Investment (ROI)</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="returnOnEquity"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Return on Equity (ROE)</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="rateOfReturnOnNetWorth"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Rate of Return on Net Worth</span>
                </a>
              </li>
              <li class="nav-item">
                <span class="nav-link d-flex align-items-center">
                  LEVERAGE RATIO
                </span>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="totalDebtToAssetRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Total Debt to Asset Ratio</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="totalDebtToEquityRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Total Debt to Equity Ratio</span>
                </a>
              </li>
              <li class="nav-item">
                <span class="nav-link d-flex align-items-center">
                  ACTIVITY RATIO
                </span>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="totalAssetTurnOver"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Total Asset Turn Over</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="workingCapitalTurnOver"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Working Capital Turn Over</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="fixedAssetTurnOver"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Fixed Asset Turn Over</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="inventoryTurnOver"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Inventory Turn Over</span>
                </a>
              </li><li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link d-flex align-items-center"
                  @click="averageCollectionPeriodRatio"
                >
                  <i class="fa fa-angle-right fa-fw mr-5" /><span>Average Collection Period Ratio</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p-block
        title="Ratio Report"
        :header="true"
        column="col-xl-9"
      >
        <p-form-row
          id="date-from"
          :label="$t('date from')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-month-picker
              v-model="date"
              name="date"
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
              v-model="dateB"
              name="date"
            />
          </div>
        </p-form-row>
        <hr>
        <h2 class="content-heading">
          {{ ratioTitle }}
        </h2>
        <p>{{ ratioDescription }}</p>
        <line-chart
          ref="linechart"
          chart-box="Ratio"
          :chart-label="chartLabel"
          :chart-data="chartData"
        />
        <hr>
        <p>{{ ratioResult }}</p>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import LineChart from '@/components/point-chart/LineChart'
import { mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    LineChart
  },
  data () {
    return {
      isLoading: false,
      date: new Date(),
      dateB: new Date(),
      chartLabel: [],
      chartData: [],
      ratioTitle: '',
      ratioDescription: '',
      ratioResult: ''
    }
  },
  mounted () {
    this.date.setMonth(this.date.getMonth() - 6)
    this.$refs.linechart.updateData()
  },
  methods: {
    ...mapActions('accountingRatioReportCurrentRatio', {
      getCurrentRatio: 'get'
    }),
    ...mapActions('accountingRatioReportCashRatio', {
      getCashRatio: 'get'
    }),
    ...mapActions('accountingRatioReportAcidTestRatio', {
      getAcidTestRatio: 'get'
    }),
    ...mapActions('accountingRatioReportGrossProfitRatio', {
      getGrossProfitRatio: 'get'
    }),
    ...mapActions('accountingRatioReportRateOfReturnInvestment', {
      getRateOfReturnInvestment: 'get'
    }),
    ...mapActions('accountingRatioReportNetProfitMargin', {
      getNetProfitMargin: 'get'
    }),
    ...mapActions('accountingRatioReportRateOfReturnOnNetWorth', {
      getRateOfReturnOnNetWorth: 'get'
    }),
    ...mapActions('accountingRatioReportReturnOnEquity', {
      getReturnOnEquity: 'get'
    }),
    ...mapActions('accountingRatioReportTotalDebtToAssetRatio', {
      getTotalDebtToAssetRatio: 'get'
    }),
    ...mapActions('accountingRatioReportTotalDebtToEquityRatio', {
      getTotalDebtToEquityRatio: 'get'
    }),
    ...mapActions('accountingRatioReportTotalAssetTurnOver', {
      getTotalAssetTurnOver: 'get'
    }),
    ...mapActions('accountingRatioReportWorkingCapitalTurnOver', {
      getWorkingCapitalTurnOver: 'get'
    }),
    ...mapActions('accountingRatioReportFixedAssetTurnOver', {
      getFixedAssetTurnOver: 'get'
    }),
    ...mapActions('accountingRatioReportInventoryTurnOver', {
      getInventoryTurnOver: 'get'
    }),
    ...mapActions('accountingRatioReportAverageCollectionPeriodRatio', {
      getAverageCollectionPeriodRatio: 'get'
    }),
    currentRatio () {
      this.getCurrentRatio({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'CURRENT RATIO'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    cashRatio () {
      this.getCashRatio({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'CASH RATIO'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    acidTestRatio () {
      this.getAcidTestRatio({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'QUICK RATIO / ACID TEST RATIO'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    grossProfitRatio () {
      this.getGrossProfitRatio({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'GROSS PROFIT RATIO'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    rateOfReturnInvestment () {
      this.getRateOfReturnInvestment({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'RATE OF RETURN INVESTMENT'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    netProfitMargin () {
      this.getNetProfitMargin({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'NET PROFIT MARGIN'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    rateOfReturnOnNetWorth () {
      this.getRateOfReturnOnNetWorth({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'RATE OF RETURN ON NET WORTH'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    returnOnEquity () {
      this.getReturnOnEquity({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'RETURN ON EQUITY'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    totalDebtToAssetRatio () {
      this.getTotalDebtToAssetRatio({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'TOTAL DEBT TO ASSET RATIO'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    totalDebtToEquityRatio () {
      this.getTotalDebtToEquityRatio({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'TOTAL DEBT TO EQUITY RATIO'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    totalAssetTurnOver () {
      this.getTotalAssetTurnOver({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'TOTAL ASSET TURN OVER'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    workingCapitalTurnOver () {
      this.getWorkingCapitalTurnOver({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'WORKING CAPITAL TURN OVER'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    fixedAssetTurnOver () {
      this.getFixedAssetTurnOver({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'FIXED ASSET TURN OVER'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    inventoryTurnOver () {
      this.getInventoryTurnOver({
        date_from: this.date,
        date_to: this.dateB
      })
        .then((response) => {
          this.ratioTitle = 'INVENTORY TURN OVER'
          this.ratioDescription = response.data.description
          this.ratioResult = response.data.result
          response.data.labels.forEach((value, index) => {
            this.chartLabel[index] = value
          })
          response.data.values.forEach((value, index) => {
            this.chartData[index] = value
          })
          this.$refs.linechart.updateData()
        })
    },
    averageCollectionPeriodRatio () {
      this.getAverageCollectionPeriodRatio({
        date_from: this.date,
        date_to: this.dateB
      }).then((response) => {
        this.ratioTitle = 'AVERAGE COLLECTION PERIOD RATIO'
        this.ratioDescription = response.data.description
        this.ratioResult = response.data.result
        response.data.labels.forEach((value, index) => {
          this.chartLabel[index] = value
        })
        response.data.values.forEach((value, index) => {
          this.chartData[index] = value
        })
        this.$refs.linechart.updateData()
      })
    }
  }
}
</script>
