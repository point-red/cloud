<template>
  <div>
    <p-loading-block :message="loadingMessage" v-show="isLoading||isSaving"/>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">{{ $t('project') | uppercase }}</router-link>
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

    <div class="row">
      <p-block column="col-sm-3" class="text-center">
        <div class="font-size-h5 font-w300 text-center">
          {{ $t('invitation code') | titlecase }}
        </div>
        <hr/>
        <div class="font-w300 mt-30">
          <p>
            {{ $t('invitation code intro') | capitalize }}
          </p>
        </div>
        <p-form-check-box
          id="subscibe"
          name="subscibe"
          @click.native="invitationCodeToggle"
          :checked="form.invitation_code_enabled"
          :description="invitationCodeStatus"/>
        <hr v-show="form.invitation_code_enabled && !isSaving"/>
        <div class="text-center mb-30" v-show="form.invitation_code_enabled && !isSaving">
          <p
            id="referralCode"
            class="btn btn-outline-secondary"
            :value="form.invitation_code"
            @click="copyToClipboard">{{ form.invitation_code }}</p>
        </div>
      </p-block>
      <p-block column="col-sm-9">
        <p-block-inner :is-loading="isLoading" v-show="requestJoinProjects.length > 0">
          <h5>Pending Request</h5>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th></th>
            </tr>
            <tr
              v-for="(requestJoinProject, index) in requestJoinProjects"
              :key="index"
              slot="p-body">
              <td>{{ index + 1 }}.</td>
              <td>{{ requestJoinProject.user_name | titlecase }}</td>
              <td>{{ requestJoinProject.user_email | lowercase }}</td>
              <td class="text-right">
                <button class="btn btn-sm btn-primary mr-5" @click="acceptRequest(requestJoinProject)">Accept</button>
                <button class="btn btn-sm btn-danger" @click="rejectRequest(requestJoinProject)">Reject</button>
              </td>
            </tr>
          </point-table>
          <p-separator></p-separator>
        </p-block-inner>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(user, index) in project.users"
              :key="user.id"
              slot="p-body">
              <template>
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'UserShow', params: { id: user.id }}">
                  {{ user.name | titlecase }}
                </router-link>
              </td>
              <td>{{ user.first_name | lowercase }} {{ user.last_name | lowercase }}</td>
              <td>{{ user.email | lowercase }}</td>
              <td>{{ user.phone }}</td>
              </template>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
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
