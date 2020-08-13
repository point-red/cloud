import Glossary from './glossary/routes'
import Procedure from './procedure/routes'
import Intrusction from './instruction/routes'
import Approval from './approval/routes'

export default [
  { path: '/plugin/play-book', name: 'PlayBook', component: () => import('./Index.vue') },
  ...Glossary,
  ...Procedure,
  ...Intrusction,
  ...Approval
]
