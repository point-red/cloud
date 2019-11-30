import SupplierGroupIndex from '@/views/master/supplier-group/Index'
import SupplierGroupCreate from '@/views/master/supplier-group/Create'
import SupplierGroupShow from '@/views/master/supplier-group/Show'
import SupplierGroupEdit from '@/views/master/supplier-group/Edit'

export default [
  { path: '/master/supplier-group', name: 'supplier-group.index', component: SupplierGroupIndex },
  { path: '/master/supplier-group/create', name: 'supplier-group.create', component: SupplierGroupCreate },
  { path: '/master/supplier-group/:id', name: 'supplier-group.show', component: SupplierGroupShow },
  { path: '/master/supplier-group/:id/edit', name: 'supplier-group.edit', component: SupplierGroupEdit }
]
