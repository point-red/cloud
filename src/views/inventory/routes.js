import Inventory from '@/views/inventory/Index'
import InventoryReport from '@/views/inventory/report/routes'

export default [
  { path: '/inventory', name: 'Inventory', component: Inventory },
  ...InventoryReport
]
