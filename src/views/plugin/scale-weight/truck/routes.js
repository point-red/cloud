import ScaleWeightTruckIndex from './Index'
import ScaleWeightTruckShow from './Show'
import ScaleWeightTruckEdit from './Edit'

export default [
  { path: '/plugin/scale-weight/truck', name: 'plugin.scale-weight.truck.index', component: ScaleWeightTruckIndex },
  { path: '/plugin/scale-weight/truck/:id', name: 'plugin.scale-weight.truck.show', component: ScaleWeightTruckShow },
  { path: '/plugin/scale-weight/truck/:id/edit', name: 'plugin.scale-weight.truck.edit', component: ScaleWeightTruckEdit }
]
