import ManufactureMachineIndex from '@/views/manufacture/machine/Index'
import ManufactureMachineCreate from '@/views/manufacture/machine/Create'
import ManufactureMachineShow from '@/views/manufacture/machine/Show'
import ManufactureMachineEdit from '@/views/manufacture/machine/Edit'

export default [
  { path: '/manufacture/machine', name: 'manufacture.machine.index', component: ManufactureMachineIndex },
  { path: '/manufacture/machine/create', name: 'manufacture.machine.create', component: ManufactureMachineCreate },
  { path: '/manufacture/machine/:id', name: 'manufacture.machine.show', component: ManufactureMachineShow },
  { path: '/manufacture/machine/:id/edit', name: 'manufacture.machine.edit', component: ManufactureMachineEdit }
]
