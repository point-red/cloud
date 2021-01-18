import InventoryAuditIndex from '@/views/inventory/audit/Index'
import InventoryAuditCreate from '@/views/inventory/audit/Create'
import InventoryAuditShow from '@/views/inventory/audit/Show'
import InventoryAuditEdit from '@/views/inventory/audit/Edit'

export default [
  { path: '/inventory/audit', name: 'inventory.audit.index', component: InventoryAuditIndex },
  { path: '/inventory/audit/create', name: 'inventory.audit.create', component: InventoryAuditCreate },
  { path: '/inventory/audit/:id', name: 'inventory.audit.show', component: InventoryAuditShow },
  { path: '/inventory/audit/:id/edit', name: 'inventory.audit.edit', component: InventoryAuditEdit }
]
