import SupplierIndex from '@/views/master/supplier/Index'
import SupplierCreate from '@/views/master/supplier/Create'
import SupplierShow from '@/views/master/supplier/Show'
import SupplierEdit from '@/views/master/supplier/Edit'

export default [
  { path: '/master/supplier', name: 'supplier.index', component: SupplierIndex },
  { path: '/master/supplier/create', name: 'supplier.create', component: SupplierCreate },
  { path: '/master/supplier/:id', name: 'supplier.show', component: SupplierShow },
  { path: '/master/supplier/:id/edit', name: 'supplier.edit', component: SupplierEdit }
]
