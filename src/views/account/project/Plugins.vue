<template>
  <div>
    <p-loading-block v-show="isLoading"/>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">{{ $t('project') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <project-widget :project="project"></project-widget>

    <hr>

    <h3>{{ $t('erp package') | uppercase }}</h3>

    <div class="row gutters-tiny">
      <div class="col-md-6 col-xl-3">
        <div class="block block-link-shadow">
          <div class="block-content block-content-full clearfix">
            <div class="font-size-h5 font-w600">
              COMMUNITY EDITION
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia rem aliquid odit esse ipsa facilis, dignissimos consequuntur, repudiandae reiciendis eius accusantium assumenda, deleniti et eligendi sapiente dolorem atque at similique?
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              FREE
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              <button type="button" class="btn btn-sm btn-primary">SUBSCRIBED</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="block block-link-shadow">
          <div class="block-content block-content-full clearfix">
            <div class="font-size-h5 font-w600">
              SILVER
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia rem aliquid odit esse ipsa facilis, dignissimos consequuntur, repudiandae reiciendis eius accusantium assumenda, deleniti et eligendi sapiente dolorem atque at similique?
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              IDR 299,000 / month
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              <button type="button" class="btn btn-sm btn-secondary">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="block block-link-shadow">
          <div class="block-content block-content-full clearfix">
            <div class="font-size-h5 font-w600">
              GOLD
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia rem aliquid odit esse ipsa facilis, dignissimos consequuntur, repudiandae reiciendis eius accusantium assumenda, deleniti et eligendi sapiente dolorem atque at similique?
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              IDR 999,000 / month
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              <button type="button" class="btn btn-sm btn-secondary">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="block block-link-shadow">
          <div class="block-content block-content-full clearfix">
            <div class="font-size-h5 font-w600">
              PLATINUM
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia rem aliquid odit esse ipsa facilis, dignissimos consequuntur, repudiandae reiciendis eius accusantium assumenda, deleniti et eligendi sapiente dolorem atque at similique?
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              IDR 2,999,000 / month
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              <button type="button" class="btn btn-sm btn-secondary">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <h3>{{ $t('plugins') | uppercase }}</h3>

    <div class="row gutters-tiny">
      <template v-for="(plugin, index) in plugins">
        <div class="col-md-6 col-xl-3" :key="index">
          <div class="block block-link-shadow">
            <div class="block-content block-content-full clearfix">
              <div class="font-size-h5 font-w600">
                {{ plugin.name }}
              </div>
              <hr>
              <div class="font-size-sm font-w600 text-uppercase text-muted">
                {{ plugin.description }}
              </div>
              <hr>
              <div v-if="plugin.price" class="font-size-sm font-w600 text-uppercase text-muted">
                IDR {{ plugin.price | numberFormat }} / month
              </div>
              <div v-else class="font-size-sm font-w600 text-uppercase text-muted">
                IDR {{ plugin.price_per_user | numberFormat }} / user / month
              </div>
              <hr>
              <div class="font-size-sm font-w600 text-uppercase text-muted">
                <button type="button" class="btn btn-sm btn-secondary">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>
      </template>
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
      isLoading: false,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        project_id: this.$route.params.id,
        mail_driver: null,
        mail_host: null,
        mail_username: null,
        mail_password: null,
        mail_from_name: null,
        mail_from_address: null,
        mail_port: null,
        mail_encryption: null,
        mail_domain: null,
        mail_secret: null
      })
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
    ...mapGetters('accountPlugin', ['plugins']),
    ...mapGetters('accountProjectPreference', ['preferences'])
  },
  created () {
    this.isLoading = true

    this.findProject({ id: this.id })
      .then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })

    this.findPreference({ id: this.id })
      .then(response => {
        this.isLoading = false
        if (response.data) {
          this.form.mail_driver = response.data.mail_driver
          this.form.mail_host = response.data.mail_host
          this.form.mail_username = response.data.mail_username
          this.form.mail_password = response.data.mail_password
          this.form.mail_from_name = response.data.mail_from_name
          this.form.mail_from_address = response.data.mail_from_address
          this.form.mail_port = response.data.mail_port
          this.form.mail_encryption = response.data.mail_encryption
          this.form.mail_domain = response.data.mail_domain
          this.form.mail_secret = response.data.mail_secret
        }
      }).catch(error => {
        this.isLoading = false
        // this.$notification.error(error.message)
      })

    this.getPlugin({
      params: {
        is_active: true
      }
    }).then(response => {
      //
    }).catch(error => {
      //
    })
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find'
    }),
    ...mapActions('accountProjectPreference', {
      findPreference: 'find',
      updatePreference: 'update'
    }),
    ...mapActions('accountPlugin', {
      getPlugin: 'get'
    }),
    onSubmit () {
      this.isSaving = true
      this.updatePreference(this.form).then(response => {
        this.isSaving = false
        this.$notification.success('Update success')
        this.$router.push('/account/project/' + this.id + '/preferences')
      }).catch(error => {
        this.isSaving = false
        this.$notification.error('Update failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
