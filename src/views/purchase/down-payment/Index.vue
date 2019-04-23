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
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-DD 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
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
      this.getDownPayments()
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
      this.isLoading = true
      this.get({
        params: {
          join: 'form,supplier',
          sort_by: '-forms.number',
          fields: 'purchase_down_payments.*',
          filter_form: 'active',
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'amount': this.searchText,
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },   
          limit: this.limit,
          includes: 'form;supplier',
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
