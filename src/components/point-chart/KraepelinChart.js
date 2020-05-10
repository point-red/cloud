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
  mounted () {
    this.updateData()
  },
  methods: {
    updateData () {
      this.renderChart({
        labels: this.cl,
        datasets: [
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
