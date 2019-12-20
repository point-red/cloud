<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">{{ $t('purchase receive') | titlecase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('purchase receive')" :header="true">
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
              <th class="text-right">Expiry Date</th>
              <th class="text-right">Production No.</th>
              <th></th>
            </tr>
            <template v-for="(purchaseReceive, index) in purchaseReceives">
            <tr
              v-for="(purchaseReceiveItem, index2) in purchaseReceive.items"
              :key="'pr-' + index + '-i-' + index2"
              slot="p-body">
              <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
              <td>
                <router-link :to="{ name: 'purchase.receive.show', params: { id: purchaseReceive.id }}">
                  {{ purchaseReceive.form.number }}
                </router-link>
              </td>
              <td>{{ purchaseReceive.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
              <td>
                <template v-if="purchaseReceive.supplier">
                  {{ purchaseReceive.supplier.name }}
                </template>
              </td>
              <td>{{ purchaseReceiveItem.item.name }}</td>
              <td>{{ purchaseReceiveItem.notes }}</td>
              <td class="text-right">{{ purchaseReceiveItem.quantity | numberFormat }}</td>
              <td class="text-right" v-if="purchaseReceiveItem.expiry_date">{{ purchaseReceiveItem.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
              <td class="text-right" v-else>&nbsp;</td>
              <td class="text-right">{{ purchaseReceiveItem.production_number }}</td>
              <td>
                <router-link class="btn btn-sm btn-secondary mr-5" :to="{ name: 'purchase.invoice.create', query: { id: purchaseReceive.id }}">
                  <i class="fa fa-share-square-o"></i> Invoice
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
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('purchaseReceive', ['purchaseReceives', 'pagination'])
  },
  methods: {
    ...mapActions('purchaseReceive', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPurchaseReceiveRequest()
    }, 300),
    getPurchaseReceiveRequest () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,supplier',
          sort_by: '-forms.number',
          fields: 'purchase_receives.*',
          filter_form: 'activePending',
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'items.item.name': this.searchText,
            'items.notes': this.searchText,
            'items.quantity': this.searchText
          },
          limit: this.limit,
          includes: 'form;supplier;warehouse;items.item;services.service',
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
      this.getPurchaseReceiveRequest()
    }
  },
  created () {
    this.getPurchaseReceiveRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
