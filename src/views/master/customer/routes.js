import CustomerIndex from '@/views/master/customer/Index'
import CustomerShow from '@/views/master/customer/Show'

export default [
  { path: '/master/customer', name: 'customer.index', component: CustomerIndex },
  { path: '/master/customer/:id', name: 'customer.show', component: CustomerShow }
]
