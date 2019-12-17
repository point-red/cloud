import ManufactureInputIndex from '@/views/manufacture/process-io/input/Index'
import ManufactureInputPending from '@/views/manufacture/process-io/input/Pending'
import ManufactureInputCreate from '@/views/manufacture/process-io/input/Create'
import ManufactureInputChooseFormula from '@/views/manufacture/process-io/input/ChooseFormula'
import ManufactureInputUseFormula from '@/views/manufacture/process-io/input/UseFormula'
import ManufactureInputShow from '@/views/manufacture/process-io/input/Show'

export default [
  { path: '/manufacture/process-io/:id/input', name: 'manufacture.process.io.input.index', component: ManufactureInputIndex },
  { path: '/manufacture/process-io/:id/input/pending', name: 'manufacture.process.io.input.pending', component: ManufactureInputPending },
  { path: '/manufacture/process-io/:id/input/create', name: 'manufacture.process.io.input.create', component: ManufactureInputCreate },
  { path: '/manufacture/process-io/:id/input/choose-formula', name: 'manufacture.process.io.input.choose.formula', component: ManufactureInputChooseFormula },
  { path: '/manufacture/process-io/:id/input/use-formula/:formulaId', name: 'manufacture.process.io.input.use.formula', component: ManufactureInputUseFormula },
  { path: '/manufacture/process-io/:id/input/:inputId', name: 'manufacture.process.io.input.show', component: ManufactureInputShow }
]
