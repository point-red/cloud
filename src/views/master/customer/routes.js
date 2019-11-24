import CustomerIndex from '@/views/master/customer/Index'
import CustomerGroup from '@/views/master/customer/Group'
import CustomerCreate from '@/views/master/customer/Create'
import CustomerShow from '@/views/master/customer/Show'
import CustomerEdit from '@/views/master/customer/Edit'

export default [
  { path: '/master/customer', name: 'customer.index', component: CustomerIndex },
  { path: '/master/customer/group', name: 'customer.group', component: CustomerGroup },
  { path: '/master/customer/create', name: 'customer.create', component: CustomerCreate },
  { path: '/master/customer/:id', name: 'customer.show', component: CustomerShow },
  { path: '/master/customer/:id/edit', name: 'customer.edit', component: CustomerEdit }
]
