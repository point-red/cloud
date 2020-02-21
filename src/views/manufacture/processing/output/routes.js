import ManufactureOutputIndex from '@/views/manufacture/processing/output/Index'
import ManufactureOutputPending from '@/views/manufacture/processing/output/Pending'
import ManufactureOutputCreateStep1 from '@/views/manufacture/processing/output/CreateStep1'
import ManufactureOutputCreateStep2 from '@/views/manufacture/processing/output/CreateStep2'
import ManufactureOutputShow from '@/views/manufacture/processing/output/Show'
import ManufactureOutputEdit from '@/views/manufacture/processing/output/Edit'

export default [
  { path: '/manufacture/processing/output', name: 'manufacture.processing.output.index', component: ManufactureOutputIndex },
  { path: '/manufacture/processing/output/pending', name: 'manufacture.processing.output.pending', component: ManufactureOutputPending },
  { path: '/manufacture/processing/output/create-step-1', name: 'manufacture.processing.output.create.step.1', component: ManufactureOutputCreateStep1 },
  { path: '/manufacture/processing/output/create-step-2/:inputId', name: 'manufacture.processing.output.create.step.2', component: ManufactureOutputCreateStep2 },
  { path: '/manufacture/processing/output/:outputId', name: 'manufacture.processing.output.show', component: ManufactureOutputShow },
  { path: '/manufacture/processing/output/:outputId/edit', name: 'manufacture.processing.output.edit', component: ManufactureOutputEdit }
]
