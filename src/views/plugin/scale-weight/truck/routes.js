import ScaleWeightTruckIndex from './Index'
import ScaleWeightTruckCreate from './Create'
import ScaleWeightTruckShow from './Show'
import ScaleWeightTruckEdit from './Edit'

export default [
  { path: '/plugin/scale-weight/truck', name: 'plugin.scale-weight.truck.index', component: ScaleWeightTruckIndex },
  { path: '/plugin/scale-weight/truck/create', name: 'plugin.scale-weight.truck.create', component: ScaleWeightTruckCreate },
  { path: '/plugin/scale-weight/truck/:id', name: 'plugin.scale-weight.truck.show', component: ScaleWeightTruckShow },
  { path: '/plugin/scale-weight/truck/:id/edit', name: 'plugin.scale-weight.truck.edit', component: ScaleWeightTruckEdit }
]
