export default [
  { path: '/plugin/play-book/glossary', name: 'Glossary', component: () => import('./Index.vue') },
  { path: '/plugin/play-book/glossary/:id', name: 'GlossaryShow', component: () => import('./Show.vue') },
  { path: '/plugin/play-book/glossary/:id/histories', name: 'GlossaryHistories', component: () => import('./histories/Index.vue') }
]
