import Index from './Index'
import Create from './Create'
import Demo from './Demo'
import Show from './Show'
import Edit from './Edit'

export default [
  { path: '/plugin/pin-point/sales-visitation-form', name: 'PinPointIndex', component: Index },
  { path: '/plugin/pin-point/sales-visitation-form/create', name: 'PinPointCreate', component: Create },
  { path: '/plugin/pin-point/sales-visitation-form/demo', name: 'PinPointDemo', component: Demo },
  { path: '/plugin/pin-point/sales-visitation-form/:id', name: 'PinPointShow', component: Show },
  { path: '/plugin/pin-point/sales-visitation-form/:id/edit', name: 'PinPointEdit', component: Edit }
]
