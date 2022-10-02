import InventoryUsageIndex from '@/views/inventory/usage/Index'
import InventoryUsageCreate from '@/views/inventory/usage/Create'
import InventoryUsageShow from '@/views/inventory/usage/Show'
import InventoryUsageEdit from '@/views/inventory/usage/Edit'
import InventoryUsageHistories from '@/views/inventory/usage/Histories'

export default [
  { path: '/inventory/usage', name: 'inventory.usage.index', component: InventoryUsageIndex },
  { path: '/inventory/usage/create', name: 'inventory.usage.create', component: InventoryUsageCreate },
  { path: '/inventory/usage/:id', name: 'inventory.usage.show', component: InventoryUsageShow },
  { path: '/inventory/usage/:id/edit', name: 'inventory.usage.edit', component: InventoryUsageEdit },
  { path: '/inventory/usage/:id/histories', name: 'inventory.usage.histories', component: InventoryUsageHistories }
]
