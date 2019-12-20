import ManufactureOutputIndex from '@/views/manufacture/process-io/output/Index'
import ManufactureOutputPending from '@/views/manufacture/process-io/output/Pending'
import ManufactureOutputCreateStep1 from '@/views/manufacture/process-io/output/CreateStep1'
import ManufactureOutputCreateStep2 from '@/views/manufacture/process-io/output/CreateStep2'
import ManufactureOutputShow from '@/views/manufacture/process-io/output/Show'
import ManufactureOutputEdit from '@/views/manufacture/process-io/output/Edit'

export default [
  { path: '/manufacture/process-io/:id/output', name: 'manufacture.process.io.output.index', component: ManufactureOutputIndex },
  { path: '/manufacture/process-io/:id/output/pending', name: 'manufacture.process.io.output.pending', component: ManufactureOutputPending },
  { path: '/manufacture/process-io/:id/output/create-step-1', name: 'manufacture.process.io.output.create.step.1', component: ManufactureOutputCreateStep1 },
  { path: '/manufacture/process-io/:id/output/create-step-2/:inputId', name: 'manufacture.process.io.output.create.step.2', component: ManufactureOutputCreateStep2 },
  { path: '/manufacture/process-io/:id/output/:outputId', name: 'manufacture.process.io.output.show', component: ManufactureOutputShow },
  { path: '/manufacture/process-io/:id/output/:outputId/edit', name: 'manufacture.process.io.output.edit', component: ManufactureOutputEdit }
]
