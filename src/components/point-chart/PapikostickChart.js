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
    chartTitle: {
      type: String,
      default: 'Chart'
    },
    maxData: {
      type: Array,
      default: []
    },
    minData: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        showAllTooltips: true,
        scales: {
          yAxes: [{
            ticks: {
              max: 15,
              stepSize: 1
            }
          }]
        }
      },
      cl: this.chartLabel,
      cd: this.chartData
    }
  },
  watch: {
    chartData (chartData) {
      if (chartData.length > 0) {
        this.$nextTick(() => {
          this.updateData()
        })
      }
    },
    maxData (maxData) {
      if (maxData.length > 0) {
        this.$nextTick(() => {
          this.updateData()
        })
      }
    },
    minData (minData) {
      if (minData.length > 0) {
        this.$nextTick(() => {
          this.updateData()
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.updateData()
    })
  },
  methods: {
    updateData () {
      this.renderChart({
        labels: this.cl,
        datasets: [
          {
            label: 'Max',
            backgroundColor: 'rgba(244, 67, 54, .7)',
            borderColor: 'rgba(244, 67, 54, .3)',
            fill: false,
            data: this.maxData
          },
          {
            label: 'Min',
            backgroundColor: 'rgba(0, 188, 212, .7)',
            borderColor: 'rgba(0, 188, 212, .3)',
            fill: false,
            data: this.minData
          },
          {
            label: 'Candidate',
            backgroundColor: 'rgba(96, 81, 3, .7)',
            borderColor: 'rgba(96, 81, 3, .3)',
            fill: false,
            data: this.cd
          }
        ]
      }, this.options)
    }
  }
}
