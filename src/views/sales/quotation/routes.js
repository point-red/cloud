import SalesOrderIndex from '@/views/sales/quotation/Index'
import SalesOrderCreate from '@/views/sales/quotation/Create'
import SalesOrderShow from '@/views/sales/quotation/Show'
import SalesOrderEdit from '@/views/sales/quotation/Edit'

export default [
  { path: '/sales/quotation', name: 'sales.quotation.index', component: SalesOrderIndex },
  { path: '/sales/quotation/create', name: 'sales.quotation.create', component: SalesOrderCreate },
  { path: '/sales/quotation/:id', name: 'sales.quotation.show', component: SalesOrderShow },
  { path: '/sales/quotation/:id/edit', name: 'sales.quotation.edit', component: SalesOrderEdit }
]
