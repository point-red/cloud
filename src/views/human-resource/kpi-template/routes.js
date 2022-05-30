import KpiIndex from '@/views/human-resource/kpi-template/Index'
import KpiShow from '@/views/human-resource/kpi-template/Show'

export default [
  { path: '/human-resource/kpi-template/:id', name: 'KpiTemplateShow', component: KpiShow },
  { path: '/human-resource/kpi-template', name: 'KpiTemplateIndex', component: KpiIndex }
]
