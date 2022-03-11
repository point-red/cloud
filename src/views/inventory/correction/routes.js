import InventoryCorrectionIndex from '@/views/inventory/correction/Index'
import InventoryCorrectionCreate from '@/views/inventory/correction/Create'
import InventoryCorrectionShow from '@/views/inventory/correction/Show'
import InventoryCorrectionEdit from '@/views/inventory/correction/Edit'

export default [
  { path: '/inventory/correction', name: 'inventory.correction.index', component: InventoryCorrectionIndex },
  { path: '/inventory/correction/create', name: 'inventory.correction.create', component: InventoryCorrectionCreate },
  { path: '/inventory/correction/:id', name: 'inventory.correction.show', component: InventoryCorrectionShow },
  { path: '/inventory/correction/:id/edit', name: 'inventory.correction.edit', component: InventoryCorrectionEdit }
]
