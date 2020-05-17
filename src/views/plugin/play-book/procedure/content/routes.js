import Index from './Index'
import Show from './Show'

export default [
  { path: '/plugin/play-book/procedure/content', name: 'ProcedureContentIndex', component: Index },
  { path: '/plugin/play-book/procedure/content/:id', name: 'ProcedureContentShow', component: Show }
]
