<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Project</span>
    </breadcrumb>

    <tab-menu>
      <li class="nav-item" slot="right">
        <router-link
          :to="'/account/project/join'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="fa fa-building"></i> Join</span>
        </router-link>
      </li>
    </tab-menu>
    <br>
    <div class="row">
      <p-block :header="true" :is-loading="loading" title="Project">
        <p-table>
          <tr slot="p-head">
            <th>Company Id</th>
            <th>Company Name</th>
            <th></th>
          </tr>
          <tr
            v-for="(project, index) in projects"
            :key="index"
            slot="p-body">
            <td>{{ project.code | uppercase }}</td>
            <td>
              <template v-if="project.owner_id === userId">
                <router-link :to="{ path: '/account/project/' + project.id, params: { id: project.id }}">
                  {{ project.name }}
                </router-link>
              </template>
              <template v-else>{{ project.name }}</template>
            </td>
            <td class="text-right">
              <template v-if="project.joined == false && project.request_join_at == null">
                <button
                  type="button"
                  class="btn btn-sm btn-secondary"
                  :disabled="loadingSaveButton"
                  @click="joinProject(index)">
                  <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/>
                  <i v-show="!loadingSaveButton" class="fa fa-check-circle-o"/> Join
                </button>
              </template>
              <template v-if="project.joined == false && project.request_join_at != null && project.owner_id == userId">
                <a
                  class="btn btn-sm btn-secondary"
                  href="javascript:void(0)">
                  <i class="fa fa-users"/> Pending Request
                </a>
              </template>
              <template v-if="project.joined == true">
                <a
                  class="btn btn-sm btn-secondary"
                  :href="'//' + project.code + '.' + domain"
                  @click="redirectToProject(project)">
                  <i class="fa fa-globe"/> Open
                </a>
              </template>
            </td>
          </tr>
        </p-table>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu
  },
  data () {
    return {
      domain: process.env.VUE_APP_DOMAIN,
      loading: false,
      loadingSaveButton: false,
      userId: parseInt(localStorage.getItem('userId'))
    }
  },
  computed: {
    ...mapGetters('AccountProject', ['projects']),
    ...mapGetters('Auth', ['authUser'])
  },
  methods: {
    ...mapActions('AccountProject', {
      getProject: 'get'
    }),
    ...mapActions('UserInvitation', {
      updateProject: 'update'
    }),
    redirectToProject (project) {
      localStorage.setItem('tenantCode', project.code)
      localStorage.setItem('tenantName', project.name)
    },
    joinProject (index) {
      this.loadingSaveButton = true
      this.updateProject({
        id: this.projects[index].user_invitation_id,
        project_id: this.projects[index].id,
        user_id: this.projects[index].user_id
      })
        .then((response) => {
          this.loadingSaveButton = false
          this.projects[index].joined = true
          this.$notification.success('You joined into this project')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    if (this.projects.length == 0) {
      this.loading = true
    }
    this.getProject()
      .then(
        (response) => {
          this.loading = false
        },
        (error) => {
          this.loading = false
          console.log(JSON.stringify(error))
        })
  }
}
</script>
