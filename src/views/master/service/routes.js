import ServiceIndex from '@/views/master/service/Index'
import ServiceShow from '@/views/master/service/Show'

export default [
  { path: '/master/service', name: 'service.index', component: ServiceIndex },
  { path: '/master/service/:id', name: 'service.show', component: ServiceShow }
]
