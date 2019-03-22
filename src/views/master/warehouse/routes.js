import WarehouseIndex from '@/views/master/warehouse/Index'
import WarehouseCreate from '@/views/master/warehouse/Create'
import WarehouseShow from '@/views/master/warehouse/Show'
import WarehouseEdit from '@/views/master/warehouse/Edit'

export default [
  { path: '/master/warehouse', name: 'warehouse.index', component: WarehouseIndex },
  { path: '/master/warehouse/create', name: 'warehouse.create', component: WarehouseCreate },
  { path: '/master/warehouse/:id', name: 'warehouse.show', component: WarehouseShow },
  { path: '/master/warehouse/:id/edit', name: 'warehouse.edit', component: WarehouseEdit }
]
