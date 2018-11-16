import PerformanceReport from './PerformanceReport'
import SalesReport from './SalesReport'
import AccumulationReport from './AccumulationReport'

export default [
  { path: '/plugin/pin-point/report/performance', component: PerformanceReport },
  { path: '/plugin/pin-point/report/sales', component: SalesReport },
  { path: '/plugin/pin-point/report/accumulation', component: AccumulationReport }
]
