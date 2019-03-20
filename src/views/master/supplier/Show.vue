<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/supplier"
        class="breadcrumb-item">Supplier</router-link>
      <span class="breadcrumb-item active">{{ supplier.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="title" :header="true">
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
      title: 'Supplier',
      isLoading: false,
      data: {
        name: null,
        email: null,
        address: null,
        phone: null,
        priority: false,
      }
    }
  },
  computed: {
    ...mapGetters('Supplier', ['supplier']),
    ...mapGetters('SalesVisitationForm', ['forms'])
  },
  methods: {
    ...mapActions('Supplier', ['find']),
    ...mapActions('SalesVisitationForm', ['get', 'export'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'addresses;phones;emails'
      }
    }).then((response) => {
      this.isLoading = false
      this.data.name = response.data.name
      console.log(response.data)
      if (response.data.emails.length > 0) {
        this.data.email = response.data.emails[0].email
      }
      if (response.data.addresses.length > 0) {
        this.data.address = response.data.addresses[0].address
      }
      if (response.data.phones.length > 0) {
        this.data.phone = response.data.phones[0].number
      }
      this.get({
        params: {
          supplier_id: this.supplier.id,
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
