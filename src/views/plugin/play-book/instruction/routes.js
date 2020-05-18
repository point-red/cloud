import Instruction from './Index'
import Histories from './histories/Index'

export default [
  { path: '/plugin/play-book/instruction', name: 'Instruction', component: Instruction },
  { path: '/plugin/play-book/instruction/:id/histories', name: 'InstructionHistories', component: Histories }
]
