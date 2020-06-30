import AccumulationReport from './accumulation/routes'

export default [
  { path: '/plugin/pin-point/report/performance', component: () => import('./PerformanceReport') },
  { path: '/plugin/pin-point/report/sales', component: () => import('./SalesReport') },
  ...AccumulationReport
]
