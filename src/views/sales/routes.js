import Sales from '@/views/sales/Index'
import SalesQuotation from './quotation/routes'

export default [
  { path: '/sales', name: 'Sales', component: Sales },
  ...SalesQuotation
]
