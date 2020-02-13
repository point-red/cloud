<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/service" class="breadcrumb-item">{{ $t('service') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ service.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('service')" :header="true">
        <router-link
          to="/master/service/create"
          v-if="$permission.has('create service')"
          slot="header"
          exact
          class="btn-block-option">
          <span><i class="si si-plus"></i> {{ $t('new service') | titlecase }}</span>
        </router-link>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
            readonly/>

          <hr/>

          <router-link
            :to="{ path: '/master/service/' + service.id + '/edit', params: { id: service.id }}"
            v-if="$permission.has('update service')"
            class="btn btn-sm btn-primary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete service')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
        </p-block-inner>
      </p-block>
    </div>
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
        name: null,
        email: null,
        address: null,
        phone: null,
        priority: false
      }
    }
  },
  computed: {
    ...mapGetters('masterService', ['service'])
  },
  methods: {
    ...mapActions('masterService', ['find', 'delete']),
    onDelete () {
      this.isDeleting = true
      this.delete({ id: this.id })
        .then(response => {
          this.isDeleting = false
          this.$router.push('/master/service')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this service')
        })
    }
  },
  created () {
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
}
</script>
