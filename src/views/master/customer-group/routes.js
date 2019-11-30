import CustomerGroupIndex from '@/views/master/customer-group/Index'
import CustomerGroupCreate from '@/views/master/customer-group/Create'
import CustomerGroupShow from '@/views/master/customer-group/Show'
import CustomerGroupEdit from '@/views/master/customer-group/Edit'

export default [
  { path: '/master/customer-group', name: 'customer-group.index', component: CustomerGroupIndex },
  { path: '/master/customer-group/create', name: 'customer-group.create', component: CustomerGroupCreate },
  { path: '/master/customer-group/:id', name: 'customer-group.show', component: CustomerGroupShow },
  { path: '/master/customer-group/:id/edit', name: 'customer-group.edit', component: CustomerGroupEdit }
]
