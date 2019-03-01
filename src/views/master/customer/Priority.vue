<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Customer</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="customer in customers"
              :key="customer.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'customer.show', params: { id: customer.id }}">
                  <i class="fa fa-star" v-show="customer.groups.length > 0"></i> {{ customer.name | titlecase }}
                </router-link>
              </td>
              <td>
                <template v-for="customerAddress in customer.addresses">
                  {{ customerAddress.address | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="customerPhone in customer.phones">
                  {{ customerPhone.number | lowercase }}
                </template>
              </td>
            </tr>
          </p-table>
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
      title: 'Customer',
      loading: true
    }
  },
  computed: {
    ...mapGetters('Customer', ['customers'])
  },
  methods: {
    ...mapActions('Customer', {
      getCustomer: 'get'
    })
  },
  created () {
    this.loading = true
    this.getCustomer({
      params: {
        sort_by: 'name',
        priority: true
      }
    }).then((response) => {
      this.loading = false
    }, (error) => {
      this.loading = false
      this.$notifications.error(error.message)
    })
  }
}
</script>
