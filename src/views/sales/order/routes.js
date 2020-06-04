import SalesOrderIndex from '@/views/sales/order/Index'
import SalesOrderCreate from '@/views/sales/order/Create'
import SalesOrderShow from '@/views/sales/order/Show'
import SalesOrderEdit from '@/views/sales/order/Edit'

export default [
  { path: '/sales/order', name: 'sales.order.index', component: SalesOrderIndex },
  { path: '/sales/order/create', name: 'sales.order.create', component: SalesOrderCreate },
  { path: '/sales/order/:id', name: 'sales.order.show', component: SalesOrderShow },
  { path: '/sales/order/:id/edit', name: 'sales.order.edit', component: SalesOrderEdit }
]
