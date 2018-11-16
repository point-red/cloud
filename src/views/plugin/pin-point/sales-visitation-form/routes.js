import PinPointIndex from './Index'
import PinPointCreate from './Create'
import PinPointShow from './Show'
import PinPointEdit from './Edit'

export default [
  { path: '/plugin/pin-point/sales-visitation-form', name: 'PinPointIndex', component: PinPointIndex },
  { path: '/plugin/pin-point/sales-visitation-form/create', name: 'PinPointCreate', component: PinPointCreate },
  { path: '/plugin/pin-point/sales-visitation-form/:id', name: 'PinPointShow', component: PinPointShow },
  { path: '/plugin/pin-point/sales-visitation-form/:id/edit', name: 'PinPointEdit', component: PinPointEdit }
]
