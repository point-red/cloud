<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">Purchase Order</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="'Purchase Order'" :header="true">
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
            <template v-for="(purchaseOrder, index) in purchaseOrders">
            <tr
              v-for="(purchaseOrderItem, index2) in purchaseOrder.items"
              :key="'pr-' + index + '-i-' + index2"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'purchase.order.show', params: { id: purchaseOrder.id }}">
                  {{ purchaseOrder.form.number }}
                </router-link>
              </th>
              <td>{{ purchaseOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
              <td>{{ purchaseOrder.employee.name }}</td>
              <td>
                <template v-if="purchaseOrder.supplier">
                  {{ purchaseOrder.supplier.name }}
                </template>
              </td>
              <td>{{ purchaseOrderItem.item.name }}</td>
              <td>{{ purchaseOrderItem.notes }}</td>
              <td class="text-right">{{ purchaseOrderItem.quantity | numberFormat }}</td>
              <td class="text-right">{{ purchaseOrderItem.price | numberFormat }}</td>
              <td class="text-right">{{ (purchaseOrderItem.quantity * purchaseOrderItem.price) | numberFormat }}</td>
              <td>
                <router-link class="btn btn-sm btn-secondary" :to="{ name: 'purchase.order.show', params: { id: purchaseOrder.id }}">
                  <i class="fa fa-share-square-o"></i> Purchase Order
                </router-link>
              </td>
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
    ...mapGetters('purchaseOrder', ['purchaseOrders', 'pagination'])
  },
  methods: {
    ...mapActions('purchaseOrder', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPurchaseOrder()
    }, 300),
    getPurchaseOrder () {
      this.loading = true
      this.get({
        params: {
          sort_by: '-forms.number',
          filter_like: {
            'forms.number': this.searchText,
            'forms.date': this.serverDate(this.searchText),
            'suppliers.name': this.searchText,
            'employees.name': this.searchText,
            'items.name': this.searchText,
            'purchase_order_items.notes': this.searchText,
            'purchase_order_items.quantity': this.searchText,
            'purchase_order_items.price': this.searchText
          },
          filter_where_has: [
            {
              form: {
                done: false
              }
            }
          ],
          limit: 10,
          includes: 'form;employee;supplier;items.item;services',
          page: this.currentPage
        }
      }).then(response => {
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getPurchaseOrder()
    }
  },
  created () {
    this.getPurchaseOrder()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
