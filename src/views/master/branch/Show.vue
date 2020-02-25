<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/branch" class="breadcrumb-item">{{ $t('branch') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ branch.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            to="/master/branch/create"
            v-if="$permission.has('create branch')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            :to="{ path: '/master/branch/' + branch.id + '/edit', params: { id: branch.id }}"
            v-if="$permission.has('update branch')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete branch')"
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
    ...mapGetters('masterBranch', ['branch'])
  },
  methods: {
    ...mapActions('masterBranch', ['find', 'delete']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.isDeleting = false
            this.$router.push('/master/branch')
          }).catch(response => {
            this.isDeleting = false
            this.$notification.error('cannot delete this service')
          })
      })
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        this.data.name = response.data.name
        this.get({
          params: {
            branch_id: this.branch.id
          }
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
