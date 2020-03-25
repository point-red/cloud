import SupplierGroupIndex from '@/views/master/supplier-group/Index'
import SupplierGroupShow from '@/views/master/supplier-group/Show'

export default [
  { path: '/master/supplier-group', name: 'supplier-group.index', component: SupplierGroupIndex },
  { path: '/master/supplier-group/:id', name: 'supplier-group.show', component: SupplierGroupShow }
]
