export default [
  { path: '/plugin/play-book/instruction', name: 'Instruction', component: () => import('./Index.vue') },
  { path: '/plugin/play-book/instruction/:id/histories', name: 'InstructionHistories', component: () => import('./histories/Index.vue') }
]
