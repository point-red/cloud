import Index from './Index'
import Show from './Show'

export default [
  { path: '/human-resource/job-value/master', name: 'MasterJobValueIndex', component: Index },
  { path: '/human-resource/job-value/master/:id', name: 'MasterJobValueShow', component: Show }
]
