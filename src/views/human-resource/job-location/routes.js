import JobLocationIndex from '@/views/human-resource/job-location/Index'
import JobLocationShow from '@/views/human-resource/job-location/Show'
import JobLocationCreate from '@/views/human-resource/job-location/Create'
import JobLocationEdit from '@/views/human-resource/job-location/Edit'

export default [
  { path: '/human-resource/job-location', name: 'JobLocationIndex', component: JobLocationIndex },
  { path: '/human-resource/job-location/create', name: 'JobLocationCreate', component: JobLocationCreate },
  { path: '/human-resource/job-location/:id', name: 'JobLocationShow', component: JobLocationShow },
  { path: '/human-resource/job-location/:id/edit', name: 'JobLocationEdit', component: JobLocationEdit }
]
