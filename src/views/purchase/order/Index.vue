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
        <div class="row mb-10">
          <p-date-range-picker
            id="date"
            name="date"
            class="col-sm-4"
            v-model="date"/>
        </div>
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
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
            </tr>
            <template v-if="purchaseOrder.down_payments.length > 0">
              <tr :key="'down-payment-'+index" slot="p-body">
                <th></th>
                <td class="bg-info-light" colspan="8"><b>{{ $t('down payment') }}</b></td>
              </tr>
            </template>
            <template v-for="(downPayment, index2) in purchaseOrder.down_payments">
              <tr :key="'down-payment-'+index+'-'+index2" slot="p-body">
                <th></th>
                <td class="bg-info-light">{{ downPayment.form.number }}</td>
                <td class="bg-info-light" colspan="7">{{ downPayment.remaining | numberFormat }}</td>
                <td>
                  <button class="btn btn-sm btn-secondary" @click="deleteDownPaymentRequest(downPayment.id)">
                    <i class="fa fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            </template>
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
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  watch: {
    date: function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.getPurchaseOrder()
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrders', 'pagination'])
  },
  methods: {
    ...mapActions('purchaseOrder', ['get']),
    ...mapActions('purchaseDownPayment', {
      deleteDownPayment: 'delete'
    }),
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
          join: 'form,supplier',
          sort_by: '-forms.number',
          fields: 'purchase_orders.*',
          filter_form: 'active',
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'items.item.name': this.searchText,
            'items.notes': this.searchText,
            'items.quantity': this.searchText,
            'items.price': this.searchText
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;supplier;items.item;services.service;downPayments.form',
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
    deleteDownPaymentRequest (id) {
      this.deleteDownPayment({
        id: id
      }).then(response => {
        this.$notification.success('delete success')
        this.getPurchaseOrder()
      }).catch(error => {
        this.$notification.error(error.message)
      })
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
