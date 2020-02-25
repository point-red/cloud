import Master from '@/views/master/Index'
import User from './user/routes'
import Role from './role/routes'
import Customer from './customer/routes'
import CustomerGroup from './customer-group/routes'
import Supplier from './supplier/routes'
import SupplierGroup from './supplier-group/routes'
import Allocation from './allocation/routes'
import AllocationGroup from './allocation-group/routes'
import Service from './service/routes'
import ServiceGroup from './service-group/routes'
import Item from './item/routes'
import ItemGroup from './item-group/routes'
import ItemPriceList from './item-price-list/routes'
import Warehouse from './warehouse/routes'
import Branch from './branch/routes'

export default [
  { path: '/master', name: 'Master', component: Master },
  ...User,
  ...Role,
  ...Customer,
  ...CustomerGroup,
  ...Supplier,
  ...SupplierGroup,
  ...Allocation,
  ...AllocationGroup,
  ...Service,
  ...ServiceGroup,
  ...Item,
  ...ItemGroup,
  ...ItemPriceList,
  ...Warehouse,
  ...Branch
]
