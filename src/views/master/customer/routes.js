import CustomerIndex from '@/views/master/customer/Index'
import CustomerPriority from '@/views/master/customer/Priority'
import CustomerCreate from '@/views/master/customer/Create'
import CustomerShow from '@/views/master/customer/Show'
import CustomerEdit from '@/views/master/customer/Edit'

export default [
  { path: '/master/customer', name: 'customer.index', component: CustomerIndex },
  { path: '/master/customer/priority', name: 'customer.priority', component: CustomerPriority },
  { path: '/master/customer/create', name: 'customer.create', component: CustomerCreate },
  { path: '/master/customer/:id', name: 'customer.show', component: CustomerShow },
  { path: '/master/customer/:id/edit', name: 'customer.edit', component: CustomerEdit }
]
