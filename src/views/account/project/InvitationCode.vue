<template>
  <div>
    <p-loading-block :message="loadingMessage" v-show="loading||loadingSaveButton"/>
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item">Project
      </router-link>
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
      <li class="nav-item">
        <router-link
          :to="'/account/project/' + id + '/invitation-code'"
          exact
          class="nav-link"
          active-class="active">
          <span>Invitation Code</span>
        </router-link>
      </li>
    </tab-menu>

    <div class="row">
      <p-block column="col-sm-12 offset-md-2 col-md-8">
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
        <hr v-show="form.invitation_code_enabled && !loadingSaveButton"/>
        <div class="text-center mb-30" v-show="form.invitation_code_enabled && !loadingSaveButton">
          <p
            id="referralCode"
            class="btn btn-outline-secondary"
            :value="form.invitation_code"
            @click="copyToClipboard">{{ form.invitation_code }}</p>
        </div>
        <h3 v-show="requestJoinProjects.length > 0">Pending Request</h3>
        <p-table>
          <tr
            v-for="(requestJoinProject, index) in requestJoinProjects"
            :key="index"
            slot="p-body">
            <td>{{ index + 1 }}.</td>
            <td>
              {{ requestJoinProject.user_name | titlecase }} <br/>
              {{ requestJoinProject.user_email | lowercase }}
            </td>
            <td class="text-right">
              <button class="btn btn-sm btn-primary" @click="acceptRequest(requestJoinProject)">Accept</button>
              <button class="btn btn-sm btn-danger" @click="rejectRequest(requestJoinProject)">Reject</button>
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
import Form from '@/utils/Form'
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
      loading: false,
      loadingSaveButton: false,
      invitationCodeStatus: '',
      loadingMessage: 'Checking invitation code status'
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  computed: {
    ...mapGetters('AccountProject', ['project']),
    ...mapGetters('accountRequestJoinProject', ['requestJoinProjects'])
  },
  created () {
    this.form = this.project
    this.updateCheckBoxDescription()
    this.loading = true
    if (this.form.name !== undefined) {
      this.loading = false
    }
    this.findProject({ id: this.id })
      .then((response) => {
        this.form = this.project
        this.updateCheckBoxDescription()
        this.loading = false
      }, (error) => {
        this.$router.replace('/account/whoops')
        this.loading = false
        this.$notification.error(error.message)
      })
    this.getRequest({ project_id: this.id })
      .then((response) => {
        //
      }, (error) => {
        this.$router.replace('/account/whoops')
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('AccountProject', {
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
        this.invitationCodeStatus = 'This Invitation Code Active'
      } else {
        this.invitationCodeStatus = 'This Invitation Code Inactive'
      }
    },
    invitationCodeToggle () {
      this.loadingSaveButton = true
      this.loadingMessage = 'Checking invitation code status'
      this.form.invitation_code_enabled = !this.form.invitation_code_enabled
      this.updateProject(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.updateCheckBoxDescription()
        }, (error) => {
          this.loadingSaveButton = false
          console.log(error)
        })
    },
    acceptRequest (requestJoinProject) {
      this.loadingSaveButton = true
      this.loadingMessage = 'Loading'
      this.updateRequest(requestJoinProject)
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.success('Request accepted')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          console.log(error)
        })
    },
    rejectRequest (requestJoinProject) {
      this.loadingSaveButton = true
      this.loadingMessage = 'Loading'
      this.deleteRequest(requestJoinProject)
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.error('Request rejected')
        }, (error) => {
          this.loadingSaveButton = false
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
