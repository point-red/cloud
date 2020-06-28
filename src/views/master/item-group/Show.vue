<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/item-group"
        class="breadcrumb-item"
      >
        {{ $t('item group') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create item')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addItemGroup.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update item')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editItemGroup.open(group)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete item')"
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

    <m-add-item-group
      ref="addItemGroup"
      @added="onAddedItemGroup($event)"
    />
    <m-edit-item-group
      ref="editItemGroup"
      @updated="onUpdatedItemGroup($event)"
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
    ...mapGetters('masterItemGroup', ['group'])
  },
  created () {
    this.findItemGroup()
  },
  methods: {
    ...mapActions('masterItemGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedItemGroup (group) {
      this.$router.push('/master/item-group/' + group.id)
      this.id = group.id
      this.findItemGroup()
    },
    onUpdatedItemGroup (group) {
      this.findItemGroup()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/item-group')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this item')
        })
      })
    },
    findItemGroup () {
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
