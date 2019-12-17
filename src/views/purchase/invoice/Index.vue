<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">{{ $t('purchase invoice') | titlecase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('purchase invoice')" :header="true">
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
            <template v-for="(purchaseInvoice, index) in purchaseInvoices">
            <tr
              v-for="(purchaseInvoiceItem, index2) in purchaseInvoice.items"
              :key="'pr-' + index + '-i-' + index2"
              slot="p-body">
              <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
              <td>
                <router-link :to="{ name: 'purchase.invoice.show', params: { id: purchaseInvoice.id }}">
                  {{ purchaseInvoice.form.number }}
                </router-link>
              </td>
              <td>{{ purchaseInvoice.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
              <td>
                <template v-if="purchaseInvoice.supplier">
                  {{ purchaseInvoice.supplier.name }}
                </template>
              </td>
              <td>{{ purchaseInvoiceItem.item.name }}</td>
              <td>{{ purchaseInvoiceItem.notes }}</td>
              <td class="text-right">{{ purchaseInvoiceItem.quantity | numberFormat }}</td>
              <td class="text-right">{{ purchaseInvoiceItem.price | numberFormat }}</td>
              <td class="text-right">{{ (purchaseInvoiceItem.quantity * purchaseInvoiceItem.price) | numberFormat }}</td>
            </tr>
            <!-- <template v-if="purchaseInvoice.down_payments.length > 0">
              <tr :key="'down-payment-'+index" slot="p-body">
                <th></th>
                <td class="bg-info-light" colspan="8"><b>{{ $t('down payment') }}</b></td>
              </tr>
            </template> -->
            <template v-for="(downPayment, index2) in purchaseInvoice.down_payments">
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
      this.getInvoices()
    }
  },
  computed: {
    ...mapGetters('purchaseInvoice', ['purchaseInvoices', 'pagination'])
  },
  methods: {
    ...mapActions('purchaseInvoice', ['get']),
    ...mapActions('purchaseDownPayment', {
      deleteDownPayment: 'delete'
    }),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getInvoices()
    }, 300),
    getInvoices () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,supplier',
          sort_by: '-forms.number',
          fields: 'purchase_invoices.*',
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
          includes: 'form;supplier;items.item;services.service',
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
      this.getInvoices()
    },
    deleteDownPaymentRequest (id) {
      this.deleteDownPayment({
        id: id
      }).then(response => {
        this.$notification.success('delete success')
        this.getInvoices()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.getInvoices()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
