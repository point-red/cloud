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
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="loading">          
          <point-table class="table table-hover">
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
        <nav v-if="customerPagination.last_page > 1">
          <ul class="pagination">
            <li class="page-item" :class="{'disabled': customerPagination.current_page == 1}">
              <a class="page-link" href="javascript:void(0)">
                <span aria-hidden="true">
                  <i class="fa fa-angle-double-left"></i>
                </span>
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <template v-for="(n, index) in customerPagination.last_page">
              <li :key="index" class="page-item" :class="{'active': customerPagination.current_page == n}" v-if="showPageNumber(n)">
                  <a class="page-link" href="javascript:void(0)" @click="paginatePage(n)">{{ n }}</a>
              </li>
            </template>
            <li class="page-item" :class="{'disabled': customerPagination.current_page == customerPagination.last_page}">
              <a class="page-link" href="javascript:void(0)">
                <span aria-hidden="true">
                  <i class="fa fa-angle-double-right"></i>
                </span>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
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
      title: 'Customer',
      loading: true,
      searchText: ''
    }
  },
  computed: {
    ...mapGetters('Customer', ['customers', 'customerPagination'])
  },
  methods: {
    ...mapActions('Customer', {
      getCustomer: 'get'
    }),
    paginatePage (n) {
      this.loading = true
      this.getCustomer({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText,
            'addresses.address': this.searchText,
            'phones.number': this.searchText
          },
          limit: 10,
          includes: 'addresses;phones;groups',
          page: n
        }
      }).then(response => {
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    filterSearch: debounce(function (value) {
      this.searchText = value
      this.loading = true
      this.getCustomer({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText,
            'addresses.address': this.searchText,
            'phones.number': this.searchText
          },
          includes: 'addresses;phones;groups',
          limit: 10
        }
      }).then(response => {
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }, 200),
    showPageNumber(n) {
      // first three number
      if (n <= 5 && this.customerPagination.current_page <= 3) {
        return true
      }
      // between first three number and last three number
      if (this.customerPagination.current_page >= 3 && n > this.customerPagination.current_page - 3 && n < this.customerPagination.current_page + 3) {
        return true
      }
      // last three number
      if (n > this.customerPagination.last_page - 5 && this.customerPagination.current_page > this.customerPagination.last_page - 3) {
        return true
      }

      return false
    }
  },
  created () {
    this.loading = true
    this.getCustomer({
      params: {
        sort_by: 'name',
        limit: 10,
        includes: 'addresses;phones;groups'
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
