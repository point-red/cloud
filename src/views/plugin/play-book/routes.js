import PlayBook from './Index'
import Glossary from './glossary/routes'
import Procedure from './procedure/routes'
import Intrusction from './instruction/routes'
import Approval from './approval/routes'

export default [
  { path: '/plugin/play-book', name: 'PlayBook', component: PlayBook },
  ...Glossary,
  ...Procedure,
  ...Intrusction,
  ...Approval
]
