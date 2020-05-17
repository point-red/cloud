import Index from './Index'
import Code from './code/routes'
import Content from './content/routes'
import History from './histories/Index'

export default [
  { path: '/plugin/play-book/procedure', name: 'Procedure', component: Index },
  { path: '/plugin/play-book/procedure/:id/histories', name: 'ProcedureHistories', component: History },
  ...Code,
  ...Content
]
