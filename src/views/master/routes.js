import Master from '@/views/master/Index'
import User from './user/routes'
import Role from './role/routes'
import Customer from './customer/routes'
import Supplier from './supplier/routes'
import Warehouse from './warehouse/routes'
import Allocation from './allocation/routes'
import Service from './service/routes'
import Item from './item/routes'

export default [
  { path: '/master', name: 'Master', component: Master },
  ...User,
  ...Role,
  ...Customer,
  ...Supplier,
  ...Warehouse,
  ...Allocation,
  ...Service,
  ...Item
]
