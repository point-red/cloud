<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/warehouse"
        class="breadcrumb-item">Warehouse</router-link>
      <span class="breadcrumb-item active">{{ warehouse.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <br/>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
            readonly/>

          <hr>

          <router-link
            :to="{ path: '/master/warehouse/' + warehouse.id + '/edit', params: { id: warehouse.id }}"
            v-if="$permission.has('update warehouse')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
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
      title: 'Warehouse',
      isLoading: false,
      data: {
        name: null,
        email: null,
        address: null,
        phone: null,
        priority: false
      }
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouse']),
    ...mapGetters('pluginPinPointSalesVisitationForm', ['forms'])
  },
  methods: {
    ...mapActions('masterWarehouse', ['find']),
    ...mapActions('pluginPinPointSalesVisitationForm', ['get', 'export'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        console.log('find ' + JSON.stringify(response))
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
        if (response.data.groups.length > 0) {
          if (response.data.groups[0].name == 'priority') {
            this.data.priority = true
          }
        }
        this.get({
          params: {
            warehouse_id: this.warehouse.id,
            date_from: new Date('2000-01-01'),
            date_to: this.$moment().format('YYYY-MM-DD 23:59:59')
          }
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
