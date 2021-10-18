import CustomerIndex from '@/views/master/customer/Index'
import CustomerShow from '@/views/master/customer/Show'
import CustomerImport from '@/views/master/customer/Import'

export default [
  { path: '/master/customer', name: 'customer.index', component: CustomerIndex },
  { path: '/master/customer/import', name: 'customer.import', component: CustomerImport },
  { path: '/master/customer/:id', name: 'customer.show', component: CustomerShow }
]
