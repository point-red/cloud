<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/supplier" class="breadcrumb-item">{{ $t('supplier') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ supplier.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('supplier')" :header="true">
        <router-link
          to="/master/supplier/create"
          v-if="$permission.has('create supplier')"
          slot="header"
          exact
          class="btn btn-outline-secondary btn-sm mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>
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

          <hr>

          <router-link
            :to="{ path: '/master/supplier/' + supplier.id + '/edit', params: { id: supplier.id }}"
            v-if="$permission.has('update supplier')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete supplier')"
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
    onDelete () {
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
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'addresses;phones;emails'
      }
    }).then(response => {
      this.isLoading = false
      this.data.name = response.data.name
      if (response.data.emails.length > 0) {
        this.data.email = response.data.emails[0].email
      }
      if (response.data.addresses.length > 0) {
        this.data.address = response.data.addresses[0].address
      }
      if (response.data.phones.length > 0) {
        this.data.phone = response.data.phones[0].number
      }
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
