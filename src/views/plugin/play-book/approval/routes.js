import Procedure from './Procedure'
import ProcedureSend from './ProcedureSend'
import Instruction from './Instruction'
import InstructionSend from './InstructionSend'

export default [
  { path: '/plugin/play-book/approval/procedure', name: 'Procedure', component: Procedure },
  { path: '/plugin/play-book/approval/procedure/send', name: 'ProcedureSend', component: ProcedureSend },
  { path: '/plugin/play-book/approval/instruction', name: 'Instruction', component: Instruction },
  { path: '/plugin/play-book/approval/instruction/send', name: 'InstructionSend', component: InstructionSend }
]
