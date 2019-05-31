<template>
  <div>
    <p-loading-block :message="loadingMessage" v-show="isLoading||isSaving"/>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">Project</router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu>
      <li class="nav-item">
        <router-link
          :to="'/account/project/' + id"
          exact
          class="nav-link"
          active-class="active">
          <span>Project</span>
        </router-link>
      </li>
    </tab-menu>

    <project-widget :project="project"></project-widget>

    <hr>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import ProjectWidget from './Widget'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      form: new Form({
        name: null,
        address: null,
        phone: null,
        code: null,
        vat_id_number: null
      }),
      isLoading: false,
      isSaving: false,
      invitationCodeStatus: '',
      loadingMessage: 'Checking invitation code status'
    }
  },
  components: {
    Breadcrumb,
    TabMenu,
    ProjectWidget,
    PointTable
  },
  computed: {
    ...mapGetters('accountProject', ['project']),
    ...mapGetters('accountRequestJoinProject', ['requestJoinProjects'])
  },
  created () {
    this.form = this.project
    this.updateCheckBoxDescription()
    this.isLoading = true
    if (this.form.name !== undefined) {
      this.isLoading = false
    }
    this.findProject({ id: this.id })
      .then(response => {
        this.form = this.project
        this.updateCheckBoxDescription()
        this.isLoading = false
      }).catch(error => {
        this.$router.replace('/account/whoops')
        this.isLoading = false
        this.$notification.error(error.message)
      })
    this.getRequest({
      params: {
        project_id: this.id
      }
    }).then(response => {
      //
    }).catch(error => {
      this.$router.replace('/account/whoops')
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find',
      updateProject: 'update'
    }),
    ...mapActions('accountRequestJoinProject', {
      getRequest: 'get',
      updateRequest: 'update',
      deleteRequest: 'delete'
    }),
    updateCheckBoxDescription () {
      if (this.project.invitation_code_enabled == true) {
        this.invitationCodeStatus = 'Invitation Active'
      } else {
        this.invitationCodeStatus = 'Invitation Inactive'
      }
    },
    invitationCodeToggle () {
      this.isSaving = true
      this.isLoadingMessage = 'Checking invitation code status'
      this.form.invitation_code_enabled = !this.form.invitation_code_enabled
      this.updateProject(this.form)
        .then(response => {
          this.isSaving = false
          this.updateCheckBoxDescription()
        }).catch(error => {
          this.isSaving = false
          console.log(error)
        })
    },
    acceptRequest (requestJoinProject) {
      this.isSaving = true
      this.isLoadingMessage = 'Loading'
      this.updateRequest(requestJoinProject)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Request accepted')
          this.getRequest({
            params: {
              project_id: this.id
            }
          })
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          console.log(error)
        })
    },
    rejectRequest (requestJoinProject) {
      this.isSaving = true
      this.isLoadingMessage = 'Loading'
      this.deleteRequest(requestJoinProject)
        .then(response => {
          this.isSaving = false
          this.$notification.error('Request rejected')
          this.getRequest({
            params: {
              project_id: this.id
            }
          })
        }).catch(error => {
          this.isSaving = false
          console.log(error)
        })
    },
    copyToClipboard () {
      var self = this
      this.$copyText(this.form.invitation_code).then(function (e) {
        console.log(e)
        /* Send notification */
        self.$notification.info('Copied to clipboard')
      }, function (e) {
        console.log(e)
      })
    }
  }
}
</script>
