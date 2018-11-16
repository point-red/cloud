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
    }
  },
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        showAllTooltips: true
      },
      cl: this.chartLabel,
      cd: this.chartData
    }
  },
  methods: {
    updateData () {
      this.renderChart({
        labels: this.cl,
        datasets: [
          {
            label: this.chartTitle,
            backgroundColor: '#605103A6',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF2',
            data: this.cd
          }
        ]
      }, this.options)
    }
  }
}
