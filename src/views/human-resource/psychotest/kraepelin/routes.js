import KraepelinIndex from '@/views/human-resource/psychotest/kraepelin/Index'
import KraepelinShow from '@/views/human-resource/psychotest/kraepelin/Show'

export default [
  {
    path: '/human-resource/psychotest/kraepelin',
    name: 'KraepelinIndex',
    component: KraepelinIndex
  },
  {
    path: '/human-resource/psychotest/kraepelin/:id',
    name: 'KraepelinShow',
    component: KraepelinShow
  }
]
