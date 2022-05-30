import InventoryTransferSendIndex from '@/views/inventory/transfer/send/Index'
import InventoryTransferSendCreate from '@/views/inventory/transfer/send/Create'
import InventoryTransferSendShow from '@/views/inventory/transfer/send/Show'
import InventoryTransferSendEdit from '@/views/inventory/transfer/send/Edit'
import InventoryTransferSendApproval from '@/views/inventory/transfer/send/Approval'
import InventoryTransferSendHistories from '@/views/inventory/transfer/send/Histories'

export default [
  { path: '/inventory/transfer/send', name: 'inventory.transfer.send.index', component: InventoryTransferSendIndex },
  { path: '/inventory/transfer/send/create', name: 'inventory.transfer.send.create', component: InventoryTransferSendCreate },
  { path: '/inventory/transfer/send/approval', name: 'inventory.transfer.send.approval', component: InventoryTransferSendApproval },
  { path: '/inventory/transfer/send/:id', name: 'inventory.transfer.send.show', component: InventoryTransferSendShow },
  { path: '/inventory/transfer/send/:id/edit', name: 'inventory.transfer.send.edit', component: InventoryTransferSendEdit },
  { path: '/inventory/transfer/send/:id/histories', name: 'inventory.transfer.send.histories', component: InventoryTransferSendHistories }
]
