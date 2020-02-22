import InventoryReportIndex from '@/views/inventory/report/Index'
import InventoryReportShow from '@/views/inventory/report/Show'

export default [
  { path: '/inventory/report', name: 'inventory.report.index', component: InventoryReportIndex },
  { path: '/inventory/report/:id', name: 'inventory.report.show', component: InventoryReportShow }
]
