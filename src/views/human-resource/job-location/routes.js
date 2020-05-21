import JobLocationIndex from '@/views/human-resource/job-location/Index'
import JobLocationShow from '@/views/human-resource/job-location/Show'

export default [
  { path: '/human-resource/job-location', name: 'job-location.index', component: JobLocationIndex },
  { path: '/human-resource/job-location/:id', name: 'job-location.show', component: JobLocationShow }
]
