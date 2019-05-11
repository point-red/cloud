<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/allocation"
        class="breadcrumb-item">{{ $t('allocation') | titlecase }}</router-link>
      <span class="breadcrumb-item active">{{ allocation.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('allocation')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="allocation.name"
            readonly/>

          <hr/>

          <router-link
            :to="{ path: '/master/allocation/' + allocation.id + '/edit', params: { id: allocation.id }}"
            v-if="$permission.has('update allocation')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete allocation')"
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
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('masterAllocation', ['allocation'])
  },
  methods: {
    ...mapActions('masterAllocation', ['find', 'delete']),
    onDelete () {
      this.isDeleting = true
      this.delete({ id: this.id })
        .then(response => {
          this.isDeleting = false
          this.$router.push('/master/allocation')
        }).catch(error => {
          this.isDeleting = false
          this.$notification.error('cannot delete this supplier')
        })
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then(response => {
        this.isLoading = false        
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
