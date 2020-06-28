export default [
  { path: '/plugin/play-book/approval/procedure', name: 'ProcedureApproval', component: () => import('./Procedure.vue') },
  { path: '/plugin/play-book/approval/procedure/send', name: 'ProcedureSend', component: () => import('./ProcedureSend.vue') },
  { path: '/plugin/play-book/approval/instruction', name: 'InstructionApproval', component: () => import('./Instruction.vue') },
  { path: '/plugin/play-book/approval/instruction/send', name: 'InstructionSend', component: () => import('./InstructionSend.vue') }
]
