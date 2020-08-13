import PinPointSales from './sales-visitation-form/routes'
import PinPointReport from './report/routes'

export default [
  { path: '/plugin/pin-point', name: 'PinPoint', component: () => import('./Index') },
  ...PinPointSales,
  ...PinPointReport
]
