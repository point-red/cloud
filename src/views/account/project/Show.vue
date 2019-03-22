<template>
  <div>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">Project</router-link>
      <span class="breadcrumb-item active">{{ project.code }}</span>
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
    
    <div class="row gutters-tiny">
      <div class="col-md-6 col-xl-3">
        <a class="block block-link-shadow text-right" href="javascript:void(0)">
          <div class="block-content block-content-full clearfix">
            <div class="float-left mt-10 d-none d-sm-block">
              <i class="fa fa-database fa-3x text-body-bg-dark"></i>
            </div>
            <div class="font-size-h3 font-w600">
              {{ project.db_size }}
            </div>
            <div class="font-size-sm font-w600 text-uppercase text-muted">DB Storage</div>
          </div>
        </a>
      </div>
      <div class="col-md-6 col-xl-3">
        <a class="block block-link-shadow text-right" href="javascript:void(0)">
          <div class="block-content block-content-full clearfix">
            <div class="float-left mt-10 d-none d-sm-block">
              <i class="fa fa-users fa-3x text-body-bg-dark"></i>
            </div>
            <div class="font-size-h3 font-w600" v-if="project.users">
              {{ project.users.length }}
            </div>
            <div class="font-size-sm font-w600 text-uppercase text-muted">Users</div>
          </div>
        </a>
      </div>
    </div>

    <hr>

    <div class="row">
      <p-block :is-loading="loading">
        <h2>Project</h2>
        <p-table>
          <tr slot="p-body">
            <td class="font-w700" width="300">{{ $t('company group') | titlecase }}</td>
            <td>{{ project.group }}</td>
          </tr>
          <tr slot="p-body">
            <td class="font-w700">{{ $t('company identifier') | titlecase }}</td>
            <td>{{ project.code | uppercase }}</td>
          </tr>
          <tr slot="p-body">
            <td class="font-w700">{{ $t('company name') | titlecase }}</td>
            <td>{{ project.name }}</td>
          </tr>                
          <tr slot="p-body">
            <td class="font-w700">{{ $t('company address') | titlecase }}</td>
            <td>{{ project.address }}</td>
          </tr>
          <tr slot="p-body">
            <td class="font-w700">{{ $t('company phone') | titlecase }}</td>
            <td>{{ project.phone }}</td>
          </tr>
          <tr slot="p-body">
            <td class="font-w700">{{ $t('vat identification number') | titlecase }}</td>
            <td>{{ project.vat_id_number }}</td>
          </tr>
          <tr slot="p-body">
            <td class="font-w700">{{ $t('timezone') | titlecase }}</td>
            <td>{{ project.timezone }}</td>
          </tr>
        </p-table>
        <div class="mb-20">
          <button
            class="btn btn-sm btn-primary mr-5"
            @click="redirectToProject(project)">
            <i class="fa fa-globe"/> OPEN
          </button>
          <router-link
            tag="button"
            :to="{ path: '/account/project/' + project.id + '/edit', params: { id: project.id }}"
            class="btn btn-sm btn-primary mr-5">
            <i class="fa fa-edit"/> EDIT
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            :disabled="loadingSaveButton"
            class="btn btn-sm btn-danger">
            <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/>
            <i v-show="!loadingSaveButton" class="fa fa-trash"/> DELETE
          </button>
        </div>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingSaveButton: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  computed: {
    ...mapGetters('AccountProject', ['project', 'projects'])
  },
  created () {
    this.loading = true
    // Without parsing this.id into int it will always return false
    // Even this.id should be int already
    if (this.project.id === parseInt(this.id)) {
      this.loading = false
    }
    this.projects.find((element) => {
      // Without parsing this.id into int it will always return false
      // Even this.id should be int already
      if (element.id === parseInt(this.id)) {
        this.$store.commit('AccountProject/FETCH_OBJECT', element)
        this.loading = false
      }
    })
    // Fetch new data
    this.findProject({ id: this.id })
      .then((response) => {
        this.loading = false
      }, (error) => {
        this.$router.replace('/account/whoops')
        this.loading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('AccountProject', {
      findProject: 'find',
      deleteProject: 'delete'
    }),
    redirectToProject (project) {
      window.location.href = '//' + project.code + '.' + process.env.VUE_APP_DOMAIN
      localStorage.setItem('tenantCode', project.code)
      localStorage.setItem('tenantName', project.name)
    },
    onDelete () {
      this.loadingSaveButton = true
      this.deleteProject({ id: this.id })
        .then(response => {
          this.loadingSaveButton = false
          this.$notification.success('Delete success')
          this.$router.push('/account/project')
        }).catch(error => {
          this.$notification.error('Delete failed')
          this.form.errors.record(error.errors)
          this.loadingSaveButton = false
        })
    }
  }
}
</script>
