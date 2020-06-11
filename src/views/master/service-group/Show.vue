<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/service-group" class="breadcrumb-item">{{ $t('service group') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            type="button"
            @click="$refs.addServiceGroup.open()"
            v-if="$permission.has('create service')"
            class="btn btn-sm btn-outline-secondary mr-5">
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            type="button"
            @click="$refs.editServiceGroup.open(group)"
            v-if="$permission.has('update service')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </button>
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

    <m-add-service-group ref="addServiceGroup" @added="onAddedServiceGroup($event)"></m-add-service-group>
    <m-edit-service-group ref="editServiceGroup" @updated="onUpdatedServiceGroup($event)"></m-edit-service-group>
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
      },
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterServiceGroup', ['group'])
  },
  methods: {
    ...mapActions('masterServiceGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedServiceGroup (group) {
      this.$router.push('/master/service-group/' + group.id)
      this.id = group.id
      this.findServiceGroup()
    },
    onUpdatedServiceGroup (group) {
      this.findServiceGroup()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/service-group')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this service')
        })
      })
    },
    findServiceGroup () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
        this.data.name = response.data.name
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id
    }).then(response => {
      this.isLoading = false
      this.data.name = response.data.name
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
