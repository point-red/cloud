<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/supplier-group"
        class="breadcrumb-item"
      >
        {{ $t('supplier group') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create supplier')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addSupplierGroup.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update supplier')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editSupplierGroup.open(group)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete supplier')"
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

    <m-add-supplier-group
      ref="addSupplierGroup"
      @added="onAddedSupplierGroup($event)"
    />
    <m-edit-supplier-group
      ref="editSupplierGroup"
      @updated="onUpdatedSupplierGroup($event)"
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
    ...mapGetters('masterSupplierGroup', ['group'])
  },
  created () {
    this.findSupplierGroup()
  },
  methods: {
    ...mapActions('masterSupplierGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedSupplierGroup (group) {
      this.$router.push('/master/supplier-group/' + group.id)
      this.id = group.id
      this.findSupplierGroup()
    },
    onUpdatedSupplierGroup (group) {
      this.findSupplierGroup()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/supplier-group')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this supplier')
        })
      })
    },
    findSupplierGroup () {
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
