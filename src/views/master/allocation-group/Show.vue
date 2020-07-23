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
          <a
            href="javascript:void(0)"
            @click="$refs.addAllocationGroup.open()"
            v-if="$permission.has('create allocation')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </a>
          <a
            href="javascript:void(0)"
            @click="$refs.editAllocationGroup.open(group)"
            v-if="$permission.has('update allocation')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </a>
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
    <m-add-allocation-group ref="addAllocationGroup" @added="onAddedAllocationGroup($event)"></m-add-allocation-group>
    <m-edit-allocation-group ref="editAllocationGroup" @updated="onUpdatedAllocationGroup($event)"></m-edit-allocation-group>
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
    ...mapGetters('masterAllocationGroup', ['group'])
  },
  methods: {
    ...mapActions('masterAllocationGroup', ['find', 'delete']),
    onAddedAllocationGroup (allocationGroup) {
      this.$router.push('/master/allocation-group/' + allocationGroup.id)
      this.id = allocationGroup.id
      this.findAllocationGroup()
    },
    onUpdatedAllocationGroup (allocationGroup) {
      this.findAllocationGroup()
    },
    findAllocationGroup () {
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
    },
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
    this.findAllocationGroup()
  }
}
</script>
