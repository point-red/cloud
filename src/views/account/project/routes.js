import ProjectIndex from '@/views/account/project/Index'
import ProjectCreate from '@/views/account/project/Create'
import ProjectJoin from '@/views/account/project/Join'
import ProjectShow from '@/views/account/project/Show'
import ProjectEdit from '@/views/account/project/Edit'
import ProjectInvitationCode from '@/views/account/project/InvitationCode'

export default [
  { path: 'project', name: 'ProjectIndex', component: ProjectIndex },
  { path: 'project/create', name: 'ProjectCreate', component: ProjectCreate },
  { path: 'project/join', name: 'ProjectJoin', component: ProjectJoin },
  { path: 'project/:id/edit', name: 'ProjectEdit', component: ProjectEdit },
  { path: 'project/:id', name: 'ProjectShow', component: ProjectShow },
  { path: 'project/:id/invitation-code', name: 'ProjectInvitationCode', component: ProjectInvitationCode }
]
