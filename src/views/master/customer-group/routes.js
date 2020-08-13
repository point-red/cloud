import CustomerGroupIndex from '@/views/master/customer-group/Index'
import CustomerGroupShow from '@/views/master/customer-group/Show'

export default [
  { path: '/master/customer-group', name: 'customer-group.index', component: CustomerGroupIndex },
  { path: '/master/customer-group/:id', name: 'customer-group.show', component: CustomerGroupShow }
]
