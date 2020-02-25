import Inventory from '@/views/inventory/Index'
import InventoryReport from '@/views/inventory/report/routes'
import InventoryUsage from '@/views/inventory/usage/routes'

export default [
  { path: '/inventory', name: 'Inventory', component: Inventory },
  ...InventoryReport,
  ...InventoryUsage
]
