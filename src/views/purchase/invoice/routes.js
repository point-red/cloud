import PurchaseInvoiceIndex from '@/views/purchase/invoice/Index'
import PurchaseInvoiceCreate from '@/views/purchase/invoice/Create'
import PurchaseInvoiceShow from '@/views/purchase/invoice/Show'
import PurchaseInvoiceEdit from '@/views/purchase/invoice/Edit'

export default [
  { path: '/purchase/invoice', name: 'purchase.invoice.index', component: PurchaseInvoiceIndex },
  { path: '/purchase/invoice/create', name: 'purchase.invoice.create', component: PurchaseInvoiceCreate },
  { path: '/purchase/invoice/:id', name: 'purchase.invoice.show', component: PurchaseInvoiceShow },
  { path: '/purchase/invoice/:id/edit', name: 'purchase.invoice.edit', component: PurchaseInvoiceEdit }
]
