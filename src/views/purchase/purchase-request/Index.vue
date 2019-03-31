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
              <th>Notes</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Value</th>
            </tr>
            <template v-for="(purchaseRequest, index) in purchaseRequests">
            <tr
              v-for="(purchaseRequestItem, index2) in purchaseRequest.items"
              :key="'pr-' + index + '-i-' + index2"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.id }}">
                  {{ purchaseRequest.form.number }}
                </router-link>
              </th>
              <td>{{ purchaseRequest.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
              <td>{{ purchaseRequest.employee.name }}</td>
              <td>
                <template v-if="purchaseRequest.supplier">
                  {{ purchaseRequest.supplier.name }}
                </template>
              </td>
              <td>{{ purchaseRequestItem.item.name }}</td>
              <td>{{ purchaseRequestItem.notes }}</td>
              <td class="text-right">{{ purchaseRequestItem.quantity | numberFormat }}</td>
              <td class="text-right">{{ purchaseRequestItem.price | numberFormat }}</td>
              <td class="text-right">{{ (purchaseRequestItem.quantity * purchaseRequestItem.price) | numberFormat }}</td>
            </tr>
            </template>
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
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequests', 'purchaseRequestPagination'])
  },
  methods: {
    ...mapActions('purchaseRequest', ['get']),
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
          sort_by: 'forms.number',
          filter_like: {
            'forms.number': this.searchText,
            'forms.date': this.serverDate(this.searchText),
            'suppliers.name': this.searchText,
            'employees.name': this.searchText,
            'items.name': this.searchText,
            'purchase_request_items.notes': this.searchText,
            'purchase_request_items.quantity': this.searchText,
            'purchase_request_items.price': this.searchText
          },
          limit: 10,
          includes: 'form;employee;supplier;items.item;services',
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
