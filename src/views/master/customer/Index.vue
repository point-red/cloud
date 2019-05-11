<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Customer</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('customer')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          ref="searchText"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(customer, index) in customers"
              :key="index"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'customer.show', params: { id: customer.id }}">
                  <i class="fa fa-star" v-show="customer.groups.length > 0"></i> {{ customer.name | titlecase }}
                </router-link>
              </th>
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
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
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
      loading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customers', 'pagination'])
  },
  methods: {
    ...mapActions('masterCustomer', ['get']),
    updatePage (value) {
      this.currentPage = value
      this.getCustomerRequest()
    },
    getCustomerRequest () {
      this.loading = true
      this.get({
        params: {
          fields: 'customers.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText,
            'addresses.address': this.searchText,
            'emails.email': this.searchText,
            'phones.number': this.searchText
          },
          join: 'addresses,phones,emails',
          includes: 'addresses;phones;emails;groups',
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getCustomerRequest()
    }, 300)
  },
  created () {
    this.getCustomerRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
