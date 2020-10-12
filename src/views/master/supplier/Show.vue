<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/supplier"
        class="breadcrumb-item"
      >
        {{ $t('supplier') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ supplier.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create supplier')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addSupplier.open()"
          >
            {{ $t('create') | uppercase }}
          </button>
          <button
            v-if="$permission.has('update supplier')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editSupplier.open(supplier.id)"
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
            id="code"
            v-model="code"
            label="Name"
            name="code"
            readonly
          />
          <p-form-row
            id="name"
            v-model="name"
            label="Name"
            name="name"
            readonly
          />
          <p-form-row
            id="email"
            v-model="email"
            label="Email"
            name="email"
            readonly
          />
          <p-form-row
            id="address"
            v-model="address"
            label="Address"
            name="address"
            readonly
          />
          <p-form-row
            id="phone"
            v-model="phone"
            label="Phone"
            name="phone"
            readonly
          />

          <p-separator />

          <h5>{{ $t('supplier group') | uppercase }}</h5>
          <p>{{ $t('create supplier helper - group') }}</p>
          <ul
            v-for="(group, index) in supplier.groups"
            :key="index"
          >
            <li>{{ group.name }}</li>
          </ul>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-supplier
      ref="addSupplier"
      @added="onAddedSupplier($event)"
    />
    <m-edit-supplier
      ref="editSupplier"
      @updated="onUpdatedSupplier($event)"
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
      code: null,
      name: null,
      email: null,
      address: null,
      phone: null
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['supplier'])
  },
  created () {
    this.findSupplier()
  },
  methods: {
    ...mapActions('masterSupplier', ['find', 'delete']),
    findSupplier () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'addresses;phones;emails;groups'
        }
      }).then(response => {
        this.isLoading = false
        this.code = response.data.code
        this.name = response.data.name
        this.email = response.data.email
        this.address = response.data.address
        this.phone = response.data.phone
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
  }
}
</script>
