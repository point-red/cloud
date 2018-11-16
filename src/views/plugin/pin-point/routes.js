import PinPoint from './Index'
import PinPointSales from './sales-visitation-form/routes'
import PinPointReport from './report/routes'

export default [
  { path: '/plugin/pin-point', name: 'PinPoint', component: PinPoint },
  ...PinPointSales,
  ...PinPointReport
]
