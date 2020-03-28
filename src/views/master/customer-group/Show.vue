<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer-group" class="breadcrumb-item">{{ $t('customer group') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            type="button"
            @click="$refs.addCustomerGroup.open()"
            v-if="$permission.has('create customer')"
            class="btn btn-sm btn-outline-secondary mr-5">
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            type="button"
            @click="$refs.editCustomerGroup.open(group)"
            v-if="$permission.has('update customer')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </button>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete customer')"
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
            v-model="group.name"
            readonly/>
        </p-block-inner>
      </p-block>
    </div>

    <m-add-customer-group ref="addCustomerGroup" @added="onAddedCustomerGroup($event)"></m-add-customer-group>
    <m-edit-customer-group ref="editCustomerGroup" @updated="onUpdatedCustomerGroup($event)"></m-edit-customer-group>
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
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterCustomerGroup', ['group'])
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
  },
  created () {
    this.findCustomerGroup()
  }
}
</script>
