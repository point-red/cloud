<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/supplier" class="breadcrumb-item">{{ $t('supplier') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ supplier.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            type="button"
            @click="$refs.addSupplier.open()"
            v-if="$permission.has('create supplier')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </button>
          <button
            type="button"
            @click="$refs.editSupplier.open(supplier.id)"
            v-if="$permission.has('update supplier')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </button>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete supplier')"
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
          <p-form-row
            id="email"
            label="Email"
            name="email"
            v-model="data.email"
            readonly/>
          <p-form-row
            id="address"
            label="Address"
            name="address"
            v-model="data.address"
            readonly/>
          <p-form-row
            id="phone"
            label="Phone"
            name="phone"
            v-model="data.phone"
            readonly/>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-supplier ref="addSupplier" @added="onAddedSupplier($event)"></m-add-supplier>
    <m-edit-supplier ref="editSupplier" @updated="onUpdatedSupplier($event)"></m-edit-supplier>
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
        phone: null
      }
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['supplier'])
  },
  methods: {
    ...mapActions('masterSupplier', ['find', 'delete']),
    findSupplier () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
        this.data.name = response.data.name
        this.data.email = response.data.email
        this.data.address = response.data.address
        this.data.phone = response.data.phone
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onAddedSupplier (supplier) {
      this.$router.push('/master/supplier/' + supplier.id)
      this.id = supplier.id
      this.findSupplier()
    },
    onUpdatedSupplier (supplier) {
      this.findSupplier()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/supplier')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this supplier')
        })
      })
    }
  },
  created () {
    this.findSupplier()
  }
}
</script>
