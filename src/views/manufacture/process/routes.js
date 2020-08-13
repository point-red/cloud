import ManufactureProcessIndex from '@/views/manufacture/process/Index'
import ManufactureProcessCreate from '@/views/manufacture/process/Create'
import ManufactureProcessShow from '@/views/manufacture/process/Show'
import ManufactureProcessEdit from '@/views/manufacture/process/Edit'

export default [
  { path: '/manufacture/process', name: 'manufacture.process.index', component: ManufactureProcessIndex },
  { path: '/manufacture/process/create', name: 'manufacture.process.create', component: ManufactureProcessCreate },
  { path: '/manufacture/process/:id', name: 'manufacture.process.show', component: ManufactureProcessShow },
  { path: '/manufacture/process/:id/edit', name: 'manufacture.process.edit', component: ManufactureProcessEdit }
]
