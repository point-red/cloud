import ManufactureInputIndex from '@/views/manufacture/processing/input/Index'
import ManufactureInputPending from '@/views/manufacture/processing/input/Pending'
import ManufactureInputCreate from '@/views/manufacture/processing/input/Create'
import ManufactureInputChooseFormula from '@/views/manufacture/processing/input/ChooseFormula'
import ManufactureInputUseFormula from '@/views/manufacture/processing/input/UseFormula'
import ManufactureInputShow from '@/views/manufacture/processing/input/Show'
import ManufactureInputEdit from '@/views/manufacture/processing/input/Edit'

export default [
  { path: '/manufacture/processing/input', name: 'manufacture.processing.input.index', component: ManufactureInputIndex },
  { path: '/manufacture/processing/input/pending', name: 'manufacture.processing.input.pending', component: ManufactureInputPending },
  { path: '/manufacture/processing/input/create', name: 'manufacture.processing.input.create', component: ManufactureInputCreate },
  { path: '/manufacture/processing/input/choose-formula', name: 'manufacture.processing.input.choose.formula', component: ManufactureInputChooseFormula },
  { path: '/manufacture/processing/input/use-formula/:formulaId', name: 'manufacture.processing.input.use.formula', component: ManufactureInputUseFormula },
  { path: '/manufacture/processing/input/:id', name: 'manufacture.processing.input.show', component: ManufactureInputShow },
  { path: '/manufacture/processing/input/:id/edit', name: 'manufacture.processing.input.edit', component: ManufactureInputEdit }
]
