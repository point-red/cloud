import SupplierIndex from '@/views/master/supplier/Index'
import SupplierShow from '@/views/master/supplier/Show'

export default [
  { path: '/master/supplier', name: 'supplier.index', component: SupplierIndex },
  { path: '/master/supplier/:id', name: 'supplier.show', component: SupplierShow }
]
