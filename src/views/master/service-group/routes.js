import ServiceGroupIndex from '@/views/master/service-group/Index'
import ServiceGroupShow from '@/views/master/service-group/Show'

export default [
  { path: '/master/service-group', name: 'service-group.index', component: ServiceGroupIndex },
  { path: '/master/service-group/:id', name: 'service-group.show', component: ServiceGroupShow }
]
