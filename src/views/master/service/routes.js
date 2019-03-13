import ServiceIndex from '@/views/master/service/Index'
import ServiceCreate from '@/views/master/service/Create'
import ServiceShow from '@/views/master/service/Show'
import ServiceEdit from '@/views/master/service/Edit'

export default [
  { path: '/master/service', name: 'service.index', component: ServiceIndex },
  { path: '/master/service/create', name: 'service.create', component: ServiceCreate },
  { path: '/master/service/:id', name: 'service.show', component: ServiceShow },
  { path: '/master/service/:id/edit', name: 'service.edit', component: ServiceEdit }
]
