<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <span class="breadcrumb-item active">{{ $t('payment order') | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('payment order')" :header="true">
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
              <th>Account</th>
              <th>Notes</th>
              <th class="text-right">Amount</th>
              <th></th>
            </tr>
            <template v-for="(paymentOrder, index) in paymentOrders">
              <template v-for="(paymentOrderDetail, index2) in paymentOrder.details">
              <tr :key="'payment-order-' + index + '-' + index2" slot="p-body">
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  <router-link :to="{ name: 'finance.payment-order.show', params: { id: paymentOrder.id }}">
                    {{ paymentOrder.form.number }}
                  </router-link>
                </td>
                <td>{{ paymentOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ paymentOrderDetail.account.number }} - {{ paymentOrderDetail.account.alias }}</td>
                <td>{{ paymentOrderDetail.notes }}</td>
                <td class="text-right">{{ paymentOrderDetail.amount | numberFormat }}</td>
                <td>
                  <router-link class="btn btn-sm btn-secondary mr-5" :to="{ name: 'finance.cash.out', query: { id: paymentOrder.id }}">
                    <i class="fa fa-share-square-o"></i> Payment
                  </router-link>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbFinance,
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
      this.getPaymentOrders()
    }
  },
  computed: {
    ...mapGetters('financePaymentOrder', ['paymentOrders', 'pagination'])
  },
  methods: {
    ...mapActions('financePaymentOrder', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPaymentOrders()
    }, 300),
    getPaymentOrders () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          sort_by: '-forms.number',
          fields: 'payment_orders.*',
          filter_form: 'active',
          filter_like: {
            'form.number': this.searchText
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;details.account;details.allocation',
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
      this.getPaymentOrders()
    }    
  },
  created () {
    this.getPaymentOrders()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
