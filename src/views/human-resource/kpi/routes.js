import KpiIndex from '@/views/human-resource/kpi/Index'
import KpiShow from '@/views/human-resource/kpi/Show'

export default [
  { path: '/human-resource/kpi/:id', name: 'KpiShow', component: KpiShow },
  { path: '/human-resource/kpi', name: 'KpiIndex', component: KpiIndex }
]
