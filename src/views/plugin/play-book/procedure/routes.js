import Index from './Index'
import Show from './Show'
import History from './histories/Index'

export default [
  { path: '/plugin/play-book/procedure', name: 'Procedure', component: Index },
  { path: '/plugin/play-book/procedure/:id/histories', name: 'ProcedureHistories', component: History },
  { path: '/plugin/play-book/procedure/:id', name: 'ProcedureContentShow', component: Show }
]
