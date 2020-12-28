import ExpeditionIndex from '@/views/master/expedition/Index'
import ExpeditionShow from '@/views/master/expedition/Show'

export default [
  { path: '/master/expedition', name: 'expedition.index', component: ExpeditionIndex },
  { path: '/master/expedition/:id', name: 'expedition.show', component: ExpeditionShow }
]
