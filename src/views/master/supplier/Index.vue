<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Supplier</span>
    </breadcrumb>

    <tab-menu/>

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
          <point-table>
            <tr slot="p-head">
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="supplier in suppliers"
              :key="supplier.id"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'supplier.show', params: { id: supplier.id }}">
                  {{ supplier.name | titlecase }}
                </router-link>
              </th>
              <td>
                <template v-for="supplierAddress in supplier.addresses">
                  {{ supplierAddress.address | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="supplierPhone in supplier.phones">
                  {{ supplierPhone.number | lowercase }}
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
      title: 'Supplier',
      loading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['suppliers', 'pagination'])
  },
  methods: {
    ...mapActions('masterSupplier', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getSupplierRequest()
    }, 300),
    getSupplierRequest () {
      this.loading = true
      this.get({
        params: {
          fields: 'suppliers.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText,
            'addresses.address': this.searchText,
            'phones.number': this.searchText,
            'emails.email': this.searchText
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
    updatePage (value) {
      this.currentPage = value
      this.getSupplierRequest()
    }
  },
  created () {
    this.getSupplierRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
