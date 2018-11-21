import PerformanceReport from './PerformanceReport'
import SalesReport from './SalesReport'
import AccumulationReport from './accumulation/routes'

export default [
  { path: '/plugin/pin-point/report/performance', component: PerformanceReport },
  { path: '/plugin/pin-point/report/sales', component: SalesReport },
  ...AccumulationReport
]
