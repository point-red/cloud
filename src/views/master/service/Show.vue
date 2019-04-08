<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/service"
        class="breadcrumb-item">Service</router-link>
      <span class="breadcrumb-item active">{{ service.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <br/>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
            readonly/>

          <hr>

          <router-link
            :to="{ path: '/master/service/' + service.id + '/edit', params: { id: service.id }}"
            v-if="$permission.has('update service')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete service')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
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
      title: 'Service',
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
          this.$router.push('/master/service')
        }).catch(response => {
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
