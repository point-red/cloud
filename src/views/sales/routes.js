import Sales from '@/views/sales/Index'
import SalesQuotation from './quotation/routes'
import SalesOrder from './order/routes'
import SalesReport from './report/routes'

export default [
  { path: '/sales', name: 'Sales', component: Sales },
  ...SalesQuotation,
  ...SalesOrder,
  ...SalesReport
]
