<template>
  <div>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">{{ $t('project') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <project-widget :project="project"></project-widget>

    <hr>

    <div class="row">
      <p-block :is-loading="isLoading">
        <div class="text-right">
          <button
            v-if="project.is_generated == true"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="redirectToProject(project)">
            <i class="fa fa-globe"></i> {{ $t('open') | uppercase }}
          </button>
          <router-link
            tag="button"
            :to="{ path: '/account/project/create' }"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            tag="button"
            :to="{ path: '/account/project/' + project.id + '/edit', params: { id: project.id }}"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            :disabled="isSaving"
            class="btn btn-sm btn-outline-secondary">
            <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>
            {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-form-row
          id="code"
          name="code"
          v-model="project.code"
          :disabled="true"
          :label="$t('company identifier')"
          :help="'WEBSITE URL : ' + project.code + '.cloud.point.red'">
        </p-form-row>

        <p-form-row
          id="name"
          name="name"
          v-model="project.name"
          :disabled="true"
          :label="$t('company name')">
        </p-form-row>

        <p-form-row
          id="total-user"
          name="total-user"
          v-model="project.total_user"
          :disabled="true"
          :label="$t('total user')">
        </p-form-row>

        <p-separator></p-separator>

        <p-form-row
          id="group"
          name="group"
          v-model="project.group"
          :disabled="true"
          :label="$t('company group')">
        </p-form-row>

        <p-form-row
          id="address"
          name="address"
          v-model="project.address"
          :disabled="true"
          :label="$t('company address')">
        </p-form-row>

        <p-form-row
          id="phone"
          name="phone"
          v-model="project.phone"
          :disabled="true"
          :label="$t('company phone')">
        </p-form-row>

        <p-form-row
          id="whatsapp"
          name="whatsapp"
          v-model="project.whatsapp"
          :disabled="true"
          :label="$t('company whatsapp')">
        </p-form-row>

        <p-form-row
          id="website"
          name="website"
          v-model="project.website"
          :disabled="true"
          :label="$t('company website')">
        </p-form-row>

        <p-form-row
          id="marketplace-notes"
          name="marketplace-notes"
          v-model="project.marketplace_notes"
          :disabled="true"
          :label="$t('marketplace notes')">
        </p-form-row>

        <p-form-row
          id="vat-id-number"
          name="vat_id_number"
          v-model="project.vat_id_number"
          :disabled="true"
          :label="$t('vat identification number')">
        </p-form-row>

        <p-form-row
          id="timezone"
          name="timezone"
          :label="$t('timezone')">
          <div slot="body" class="col-form-label col-lg-9">
            {{ project.timezone }}
          </div>
        </p-form-row>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import ProjectWidget from './Widget'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu,
    ProjectWidget
  },
  computed: {
    ...mapGetters('accountProject', ['project', 'projects'])
  },
  created () {
    this.isLoading = true
    // Without parsing this.id into int it will always return false
    // Even this.id should be int already
    if (this.project.id === parseInt(this.id)) {
      this.isLoading = false
    }
    this.projects.find((element) => {
      // Without parsing this.id into int it will always return false
      // Even this.id should be int already
      if (element.id === parseInt(this.id)) {
        this.$store.commit('accountProject/FETCH_OBJECT', element)
        this.isLoading = false
      }
    })
    // Fetch new data
    this.findProject({ id: this.id })
      .then((response) => {
        this.isLoading = false
      }, (error) => {
        this.$router.replace('/account/whoops')
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find',
      deleteProject: 'delete'
    }),
    redirectToProject (project) {
      window.location.href = '//' + project.code + '.' + process.env.VUE_APP_DOMAIN
      localStorage.setItem('tenantCode', project.code)
      localStorage.setItem('tenantName', project.name)
    },
    onDelete () {
      this.$alert.confirm('DELETE').then(response => {
        this.isSaving = true
        this.deleteProject({ id: this.id })
          .then(response => {
            this.$notification.success('delete success')
            this.isSaving = false
            this.$router.push('/account/project')
          }).catch(error => {
            this.isSaving = false
          })
      }).catch(error => {
        this.$alert.error(error.message)
        this.isSaving = false
      })
    }
  }
}
</script>
