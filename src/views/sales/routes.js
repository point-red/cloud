import Sales from '@/views/sales/Index'
import SalesQuotation from './quotation/routes'
import SalesOrder from './order/routes'

export default [
  { path: '/sales', name: 'Sales', component: Sales },
  ...SalesQuotation,
  ...SalesOrder
]
