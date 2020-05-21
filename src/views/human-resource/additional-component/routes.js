import AdditionalComponentIndex from '@/views/human-resource/additional-component/Index'
import AdditionalComponentShow from '@/views/human-resource/additional-component/Show'

export default [
  { path: '/human-resource/additional-component', name: 'additional-component.index', component: AdditionalComponentIndex },
  { path: '/human-resource/additional-component/:id', name: 'additional-component.show', component: AdditionalComponentShow }
]
