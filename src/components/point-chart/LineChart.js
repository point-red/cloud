import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartData: {
      type: Array,
      required: false
    },
    chartLabel: {
      type: Array,
      required: false
    },
    chartDataB: {
      type: Array,
      required: false
    },
    chartTitle: {
      type: String,
      default: 'Chart'
    },
    lineColor: {
      type: String,
      default: '#605103A6'
    }
  },
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        showAllTooltips: true,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label
              const value = this.formatNumber(tooltipItem.yLabel)
              return `${label}: ${value}`
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: (value) => {
                  return this.formatNumber(value)
                },
                beginAtZero: true
              },
              scaleLabel: {
                display: true
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    cl () {
      return this.chartLabel
    },
    cd () {
      return this.chartData
    }
  },
  watch: {
    chartLabel () {
      this.updateData()
    }
  },
  methods: {
    updateData () {
      this.renderChart({
        labels: this.cl,
        datasets: [
          {
            label: this.chartTitle,
            backgroundColor: this.lineColor,
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF2',
            data: this.cd
          }
        ]
      }, this.options)
    },
    formatNumber (value) {
      return this.$options.filters.numberFormat(value)
    }
  }
}
