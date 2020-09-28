import SalaryNonSales from './non-sales/routes'

export default [
  { path: '/plugin/salary', name: 'Salary', component: () => import('./Index.vue') },
  ...SalaryNonSales
]
