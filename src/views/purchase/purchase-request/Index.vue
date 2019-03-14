<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">Purchase Request</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="'Purchase Request'" :header="true">
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
              <th>#</th>
              <th>Date</th>
              <th>Employee</th>
              <th>Supplier</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Value</th>
            </tr>
            <tr
              v-for="purchaseRequest in purchaseRequests"
              :key="purchaseRequest.id"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.id }}">
                  {{ purchaseRequest.name | titlecase }}
                </router-link>
              </th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
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
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    return {
      loading: true,
      searchText: '',
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('PurchaseRequest', ['purchaseRequests', 'purchaseRequestPagination'])
  },
  methods: {
    ...mapActions('PurchaseRequest', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPurchaseRequest()
    }, 300),
    getPurchaseRequest () {
      this.loading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 10,
          includes: 'form',
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
      this.getPurchaseRequest()
    }
  },
  created () {    
    this.getPurchaseRequest()
  },
  updated () {
    this.lastPage = this.purchaseRequestPagination.last_page
  }
}
</script>
