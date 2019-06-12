import ProjectIndex from '@/views/account/project/Index'
import ProjectCreate from '@/views/account/project/Create'
import ProjectJoin from '@/views/account/project/Join'
import ProjectShow from '@/views/account/project/Show'
import ProjectEdit from '@/views/account/project/Edit'
import ProjectInvitationCode from '@/views/account/project/InvitationCode'
import ProjectDatabase from '@/views/account/project/Database'
import ProjectPreferences from '@/views/account/project/Preferences'

export default [
  { path: 'project', name: 'project.index', component: ProjectIndex },
  { path: 'project/create', name: 'project.create', component: ProjectCreate },
  { path: 'project/join', name: 'project.join', component: ProjectJoin },
  { path: 'project/:id/edit', name: 'project.edit', component: ProjectEdit },
  { path: 'project/:id', name: 'project.show', component: ProjectShow },
  { path: 'project/:id/invitation-code', name: 'project.invitation.code', component: ProjectInvitationCode },
  { path: 'project/:id/database', name: 'project.database', component: ProjectDatabase },
  { path: 'project/:id/preferences', name: 'project.preferences', component: ProjectPreferences }
]
