import WarehouseIndex from '@/views/master/warehouse/Index'
import WarehouseShow from '@/views/master/warehouse/Show'

export default [
  { path: '/master/warehouse', name: 'warehouse.index', component: WarehouseIndex },
  { path: '/master/warehouse/:id', name: 'warehouse.show', component: WarehouseShow }
]
