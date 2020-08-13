export default [
  { path: '/plugin/play-book/procedure', name: 'Procedure', component: () => import('./Index.vue') },
  { path: '/plugin/play-book/procedure/:id/histories', name: 'ProcedureHistories', component: () => import('./histories/Index.vue') },
  { path: '/plugin/play-book/procedure/:id', name: 'ProcedureContentShow', component: () => import('./Show.vue') }
]
