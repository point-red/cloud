<template>
  <div>
    <p-loading-block v-show="isLoading" />
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item"
      >
        {{ $t('project') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <project-widget :project="project" />

    <hr>

    <h5>{{ $t('choose package') | uppercase }}</h5>

    <hr>

    <div class="row gutters-tiny">
      <div
        v-for="packageErp in packages"
        :key="packageErp.code"
        class="col-md-6 col-xl-3"
      >
        <div class="block block-link-shadow">
          <div class="block-content block-content-full clearfix">
            <div class="font-size-h5 font-w600">
              {{ packageErp.name }}
            </div>
            <hr>
            <div
              class="font-size-sm plugin-description"
              style="height:70px"
            >
              <pre>{{ packageErp.description }}</pre>
            </div>
            <hr>
            <div class="text-uppercase">
              <span class="font-size-lg">IDR {{ packageErp.price | numberFormat }}</span> <small>/ month</small>
            </div>
            <hr>
            <div class="font-size-sm font-w600 text-uppercase text-muted">
              <button
                v-if="project.package_id == packageErp.id"
                type="button"
                class="btn btn-sm btn-primary"
                @click="choosePackage(packageErp, 'unsubscribe')"
              >
                SUBSCRIBED
              </button>
              <button
                v-else
                type="button"
                class="btn btn-sm btn-secondary"
                @click="choosePackage(packageErp, 'subscribe')"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <h5>{{ $t('choose plugin') | uppercase }}</h5>

    <hr>

    <div class="row gutters-tiny">
      <template v-for="(plugin, index) in plugins">
        <div
          v-if="plugin.is_active"
          :key="index"
          class="col-md-6 col-xl-3"
        >
          <div class="block block-link-shadow">
            <div class="block-content block-content-full clearfix">
              <div class="font-size-h5 font-w600">
                {{ plugin.name === "PIN POINT" ? "SALES VISITATION" : plugin.name }}
              </div>
              <hr>
              <div class="font-size-sm plugin-description">
                {{ plugin.description }}
              </div>
              <hr>
              <div class="text-uppercase">
                <span
                  v-if="plugin.price != 0"
                  class="font-size-lg"
                >IDR {{ plugin.price | numberFormat }}</span> <small v-if="plugin.is_monthly_price">/ month</small>
                <span
                  v-if="plugin.price_per_user != 0"
                  class="font-size-lg"
                >IDR {{ plugin.price_per_user | numberFormat }}</span> <small v-if="plugin.is_monthly_price_per_user">/ user / month</small>
                <span
                  v-if="plugin.price == 0 && plugin.price_per_user == 0"
                  class="font-size-lg"
                >FREE</span>
              </div>
              <hr>
              <div class="font-size-sm font-w600 text-uppercase text-muted">
                <button
                  v-if="project.plugins.length > 0 && project.plugins.findIndex(element => element.id == plugin.id) >= 0"
                  type="button"
                  class="btn btn-sm btn-primary"
                  @click="choosePlugin(plugin, 'unsubscribe')"
                >
                  SUBSCRIBED
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-sm btn-secondary"
                  @click="choosePlugin(plugin, 'subscribe')"
                >
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <sweet-modal
      ref="subscribed"
      icon="success"
    >
      Thankyou for subscribe, please click this <a
        href="javascript:void(0)"
        @click="redirectToPluginUrl()"
      >LINK</a> to open the app
    </sweet-modal>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import ProjectWidget from './Widget'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu,
    ProjectWidget
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        project_id: this.$route.params.id,
        plugins: []
      }),
      plugin_url: ''
    }
  },
  computed: {
    ...mapGetters('accountProject', ['project']),
    ...mapGetters('accountPlugin', ['plugins', 'pagination']),
    ...mapGetters('accountPackage', ['packages'])
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

    this.getPlugin({
      params: {
        is_active: true
      }
    }).then(response => {
      //
    }).catch(error => {
      //
    })

    this.getPackage()
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find'
    }),
    ...mapActions('accountPlugin', {
      getPlugin: 'get',
      subscribe: 'subscribe',
      unsubscribe: 'unsubscribe'
    }),
    ...mapActions('accountPackage', {
      getPackage: 'get',
      subscribePackage: 'subscribe',
      unsubscribePackage: 'unsubscribe'
    }),
    redirectToPluginUrl () {
      window.open(this.plugin_url, '_self')
    },
    calculate () {
      this.form.sub_total_price = 0
      this.form.vat = 0
      this.form.total_price = 0
      this.form.plugins.forEach(el => {
        this.form.sub_total_price += el.price_per_user_proportional * this.form.total_user
      })
      this.form.vat = this.form.sub_total_price * 10 / 100
      this.form.total_price = this.form.sub_total_price + this.form.vat
    },
    choosePackage (packageErp, method) {
      const self = this
      if (method == 'subscribe') {
        this.$alert.confirm(this.$t('subscribe'), 'will you update your package ?').then(response => {
          this.subscribePackage({
            id: packageErp.id,
            project_id: this.project.id
          }).then(response => {
            this.isLoading = true
            this.findProject({ id: this.id })
              .then(response => {
                this.isLoading = false
              }).catch(error => {
                this.isLoading = false
                this.$notification.error(error.message)
              })
          })
        })
      } else if (method == 'unsubscribe') {
        this.$alert.confirm(this.$t('unsubscribe'), 'are you sure to unsubscribe from this package ?').then(response => {
          this.unsubscribePackage({
            id: packageErp.id,
            project_id: this.project.id
          }).then(response => {
            self.isLoading = true
            self.findProject({ id: self.id })
              .then(response => {
                self.isLoading = false
              }).catch(error => {
                self.isLoading = false
                self.$notification.error(error.message)
              })
          })
        })
      }
    },
    choosePlugin (plugin, method) {
      if (method == 'subscribe') {
        this.subscribe({
          id: plugin.id,
          project_id: this.project.id
        }).then(response => {
          this.isLoading = true
          this.findProject({ id: this.id })
            .then(response => {
              this.isLoading = false
              if (plugin.app_url) {
                this.plugin_url = plugin.app_url
                this.$refs.subscribed.open()
              }
            }).catch(error => {
              this.isLoading = false
              this.$notification.error(error.message)
            })
        })
      } else if (method == 'unsubscribe') {
        const self = this
        this.$alert.confirm(this.$t('unsubscribe'), 'are you sure to unsubscribe this plugin ?').then(response => {
          this.unsubscribe({
            id: plugin.id,
            project_id: this.project.id
          }).then(response => {
            self.isLoading = true
            self.findProject({ id: self.id })
              .then(response => {
                self.isLoading = false
              }).catch(error => {
                self.isLoading = false
                self.$notification.error(error.message)
              })
          })
        })
      }
    }
  }
}
</script>

<style scoped>
  .plugin-description {
    height: 80px;
    overflow: auto;
  }
</style>
