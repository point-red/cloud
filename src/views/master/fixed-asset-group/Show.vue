<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/fixed-asset-group"
        class="breadcrumb-item"
      >
        {{ $t('fixed asset group') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create fixed asset')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addFixedAssetGroup.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update fixed asset')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editFixedAssetGroup.open(group)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete fixed asset')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="data.name"
            label="Name"
            name="name"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>

    <m-add-fixed-asset-group
      ref="addFixedAssetGroup"
      @added="onAddedFixedAssetItemGroup($event)"
    />
    <m-edit-fixed-asset-group
      ref="editFixedAssetGroup"
      @updated="onUpdatedFixedAssetGroup($event)"
    />
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
    ...mapGetters('masterFixedAssetGroup', ['group'])
  },
  created () {
    this.findFixedAssetGroup()
  },
  methods: {
    ...mapActions('masterFixedAssetGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedFixedAssetGroup (group) {
      this.$router.push('/master/fixed-asset-groups/' + group.id)
      this.id = group.id
      this.findFixedAssetGroup()
    },
    onUpdatedFixedAssetGroup (group) {
      this.findFixedAssetGroup()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$notification.success('delete success')
          this.$router.push('/master/fixed-asset-groups')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this group')
        })
      })
    },
    findFixedAssetGroup () {
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
}
</script>
