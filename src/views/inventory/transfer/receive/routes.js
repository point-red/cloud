import InventoryTransferReceiveIndex from '@/views/inventory/transfer/receive/Index'
import InventoryTransferReceiveCreate from '@/views/inventory/transfer/receive/Create'
import InventoryTransferReceiveShow from '@/views/inventory/transfer/receive/Show'
import InventoryTransferReceiveEdit from '@/views/inventory/transfer/receive/Edit'

export default [
  { path: '/inventory/transfer/receive', name: 'inventory.transfer.receive.index', component: InventoryTransferReceiveIndex },
  { path: '/inventory/transfer/receive/create', name: 'inventory.transfer.receive.create', component: InventoryTransferReceiveCreate },
  { path: '/inventory/transfer/receive/:id', name: 'inventory.transfer.receive.show', component: InventoryTransferReceiveShow },
  { path: '/inventory/transfer/receive/:id/edit', name: 'inventory.transfer.receive.edit', component: InventoryTransferReceiveEdit }
]
