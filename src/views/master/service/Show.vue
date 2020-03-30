<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/service" class="breadcrumb-item">{{ $t('service') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ service.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <a
            href="javascript:void(0)"
            @click="$refs.addService.open()"
            v-if="$permission.has('create service')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </a>
          <a
            href="javascript:void(0)"
            @click="$refs.editService.open(service.id)"
            v-if="$permission.has('update service')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </a>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete service')"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
            readonly/>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-service ref="addService" @added="onAddedService($event)"></m-add-service>
    <m-edit-service ref="editService" @updated="onUpdatedService($event)"></m-edit-service>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      data: {
        name: null
      }
    }
  },
  computed: {
    ...mapGetters('masterService', ['service'])
  },
  methods: {
    ...mapActions('masterService', ['find', 'delete']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.isDeleting = false
            this.$router.push('/master/service')
          }).catch(response => {
            this.isDeleting = false
            this.$notification.error('cannot delete this service')
          })
      })
    },
    onAddedService (service) {
      this.$router.push('/master/service/' + service.id)
      this.id = service.id
      this.findService()
    },
    onUpdatedService (service) {
      this.findService()
    },
    findService () {
      this.isLoading = true
      this.find({ id: this.id })
        .then(response => {
          this.isLoading = false
          this.data.name = response.data.name
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    this.findService()
  }
}
</script>
