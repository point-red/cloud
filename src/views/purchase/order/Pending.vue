<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">{{ $t('purchase order') | titlecase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('purchase order')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          ref="searchText"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Number</th>
              <th>Date</th>
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
              <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
              <td>
                <router-link :to="{ name: 'purchase.order.show', params: { id: purchaseOrder.id }}">
                  {{ purchaseOrder.form.number }}
                </router-link>
              </td>
              <td>{{ purchaseOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
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
                <router-link class="btn btn-sm btn-secondary mr-5" :to="{ name: 'purchase.receive.create', query: { id: purchaseOrder.id }}">
                  <i class="fa fa-share-square-o"></i> Receive
                </router-link>
                <button class="btn btn-sm btn-secondary" @click="$refs.downPaymentModal.show(purchaseOrder)">
                  <i class="fa fa-share-square-o"></i> Down Payment
                </button>
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

    <down-payment-modal
      id="downPayment"
      ref="downPaymentModal"
      title="down payment"
      @close="refresh"/>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import DownPaymentModal from './DownPaymentModal'
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    DownPaymentModal,
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
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
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          sort_by: '-forms.number',
          fields: 'purchase_orders.*',
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'items.name': this.searchText,
            'items.notes': this.searchText,
            'items.quantity': this.searchText,
            'items.price': this.searchText
          },
          filter_form: 'activePending',
          limit: this.limit,
          includes: 'form;supplier;items.item.units;services.service;downPayments.form',
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getPurchaseOrder()
    },
    refresh () {
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
