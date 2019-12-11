import ManufactureFormulaIndex from '@/views/manufacture/formula/Index'
import ManufactureFormulaPending from '@/views/manufacture/formula/Pending'
import ManufactureFormulaCreate from '@/views/manufacture/formula/Create'
import ManufactureFormulaShow from '@/views/manufacture/formula/Show'
import ManufactureFormulaEdit from '@/views/manufacture/formula/Edit'

export default [
  { path: '/manufacture/formula', name: 'manufacture.formula.index', component: ManufactureFormulaIndex },
  { path: '/manufacture/formula/pending', name: 'manufacture.formula.pending', component: ManufactureFormulaPending },
  { path: '/manufacture/formula/create', name: 'manufacture.formula.create', component: ManufactureFormulaCreate },
  { path: '/manufacture/formula/:id', name: 'manufacture.formula.show', component: ManufactureFormulaShow },
  { path: '/manufacture/formula/:id/edit', name: 'manufacture.formula.edit', component: ManufactureFormulaEdit }
]
