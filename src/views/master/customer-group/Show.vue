<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/customer-group"
        class="breadcrumb-item"
      >
        {{ $t('customer group') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create customer')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addCustomerGroup.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update customer')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editCustomerGroup.open(group)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete customer')"
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
            v-model="group.name"
            label="Name"
            name="name"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>

    <m-add-customer-group
      ref="addCustomerGroup"
      @added="onAddedCustomerGroup($event)"
    />
    <m-edit-customer-group
      ref="editCustomerGroup"
      @updated="onUpdatedCustomerGroup($event)"
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
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterCustomerGroup', ['group'])
  },
  created () {
    this.findCustomerGroup()
  },
  methods: {
    ...mapActions('masterCustomerGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedCustomerGroup (group) {
      this.$router.push('/master/customer-group/' + group.id)
      this.id = group.id
      this.findCustomerGroup()
    },
    onUpdatedCustomerGroup (group) {
      this.findCustomerGroup()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/customer-group')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this customer')
        })
      })
    },
    findCustomerGroup () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
