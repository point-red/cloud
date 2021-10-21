import Sales from '@/views/sales/Index'
import SalesQuotation from './quotation/routes'
import SalesOrder from './order/routes'
import SalesDeliveryOrder from './delivery-order/routes'
import SalesDeliveryNote from './delivery-note/routes'
import SalesDownPayment from './down-payment/routes'
import SalesReport from './report/routes'
import SalesInvoice from './invoice/routes'
import SalesSummary from './summary/routes'

export default [
  { path: '/sales', name: 'Sales', component: Sales },
  ...SalesQuotation,
  ...SalesOrder,
  ...SalesDownPayment,
  ...SalesDeliveryOrder,
  ...SalesDeliveryNote,
  ...SalesReport,
  ...SalesInvoice,
  ...SalesSummary
]
