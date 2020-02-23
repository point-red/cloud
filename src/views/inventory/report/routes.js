import InventoryReportIndex from '@/views/inventory/report/Index'
import InventoryReportShow from '@/views/inventory/report/Show'
import InventoryReportDetail from '@/views/inventory/report/Detail'

export default [
  { path: '/inventory/report', name: 'inventory.report.index', component: InventoryReportIndex },
  { path: '/inventory/report/:id', name: 'inventory.report.show', component: InventoryReportShow },
  { path: '/inventory/report/:id/warehouse/:warehouseId', name: 'inventory.report.detail', component: InventoryReportDetail }
]
