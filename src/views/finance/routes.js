import Finance from '@/views/finance/Index'
import Cash from './cash/routes'

export default [
  { path: '/finance', name: 'Finance', component: Finance },
  ...Cash
]
