import ServiceGroupIndex from '@/views/master/service-group/Index'
import ServiceGroupCreate from '@/views/master/service-group/Create'
import ServiceGroupShow from '@/views/master/service-group/Show'
import ServiceGroupEdit from '@/views/master/service-group/Edit'

export default [
  { path: '/master/service-group', name: 'service-group.index', component: ServiceGroupIndex },
  { path: '/master/service-group/create', name: 'service-group.create', component: ServiceGroupCreate },
  { path: '/master/service-group/:id', name: 'service-group.show', component: ServiceGroupShow },
  { path: '/master/service-group/:id/edit', name: 'service-group.edit', component: ServiceGroupEdit }
]
