<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/allocation-group" class="breadcrumb-item">{{ $t('allocation group') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            to="/master/allocation-group/create"
            v-if="$permission.has('create allocation')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            :to="{ path: '/master/allocation-group/' + group.id + '/edit', params: { id: group.id }}"
            v-if="$permission.has('update allocation')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete allocation')"
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
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
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
    ...mapGetters('masterAllocationGroup', ['group'])
  },
  methods: {
    ...mapActions('masterAllocationGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/allocation-group')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this allocation')
        })
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
