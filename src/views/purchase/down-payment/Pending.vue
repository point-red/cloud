<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">Down Payment</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="'Down Payment'" :header="true">
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
              <th>Number</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Amount</th>
            </tr>
            <template v-for="(downPayment, index) in downPayments">
            <tr
              :key="'down-payment-' + index"
              slot="p-body">
              <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
              <td>
                <router-link :to="{ name: 'purchase.down-payment.show', params: { id: downPayment.id }}">
                  {{ downPayment.form.number }}
                </router-link>
              </td>
              <td>{{ downPayment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
              <td>
                <template v-if="downPayment.supplier">
                  {{ downPayment.supplier.name }}
                </template>
              </td>
              <td>{{ downPayment.amount | numberFormat }}</td>
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
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('purchaseDownPayment', ['downPayments', 'pagination'])
  },
  methods: {
    ...mapActions('purchaseDownPayment', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getDownPayments()
    }, 300),
    getDownPayments () {
      this.loading = true
      this.get({
        params: {
          join: 'form,supplier',
          sort_by: '-forms.number',
          fields: 'purchase_down_payments.*',
          filter_form: 'activePending',
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'amount': this.searchText,
          },
          limit: this.limit,
          includes: 'form;supplier',
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
      this.getDownPayments()
    }
  },
  created () {
    this.getDownPayments()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
