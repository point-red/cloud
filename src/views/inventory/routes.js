import Inventory from '@/views/inventory/Index'
import InventoryAudit from '@/views/inventory/audit/routes'
import InventoryReport from '@/views/inventory/report/routes'
import InventoryUsage from '@/views/inventory/usage/routes'
import Correction from '@/views/inventory/correction/routes'

export default [
  { path: '/inventory', name: 'Inventory', component: Inventory },
  ...InventoryAudit,
  ...InventoryReport,
  ...InventoryUsage,
  ...Correction
]
