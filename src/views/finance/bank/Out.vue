<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <span class="breadcrumb-item active">
        <router-link to="/finance/bank">{{ $t('bank') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('out') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('payment order')">
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"/>
        </div>
        <div class="text-center font-size-sm mb-10">
          <a href="javascript:void(0)" @click="isAdvanceFilter = !isAdvanceFilter">
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down"></i>
          </a>
        </div>
        <div class="card" :class="{ 'fadeIn': isAdvanceFilter }" v-show="isAdvanceFilter">
          <div class="row">
            <div class="col-sm-6 text-center">
              <p-form-row id="date-start" name="date-start" :label="$t('date start')" :is-horizontal="false">
                <div slot="body">
                  <p-date-picker
                    id="date"
                    name="date"
                    label="date"
                    v-model="date.start"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row id="date-end" name="date-end" :label="$t('date end')" :is-horizontal="false">
                <div slot="body">
                  <p-date-picker
                    id="date"
                    name="date"
                    label="date"
                    v-model="date.end"/>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>To</th>
              <th>Account</th>
              <th>Notes</th>
              <th class="text-right">Amount</th>
              <th class="text-center"></th>
            </tr>
            <template v-for="(paymentOrder, index) in paymentOrders">
              <template v-for="(paymentOrderDetail, index2) in paymentOrder.details">
              <tr :key="'payment-order-' + index + '-' + index2" slot="p-body">
                <th>
                  <router-link :to="{ name: 'finance.payment-order.show', params: { id: paymentOrder.id }}">
                    {{ paymentOrder.form.number }}
                  </router-link>
                </th>
                <td>{{ paymentOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ paymentOrder.paymentable.name }}</td>
                <td>{{ paymentOrderDetail.account.number }} - {{ paymentOrderDetail.account.alias }}</td>
                <td>{{ paymentOrderDetail.notes }}</td>
                <td class="text-right">{{ paymentOrderDetail.amount | numberFormat }}</td>
                <td class="text-center">
                  <router-link class="btn btn-sm btn-primary" :to="{ name: 'finance.bank.out.create', params: { id: paymentOrder.id }}">
                    {{ $t('pay') | uppercase }}
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbFinance,
    PointTable
  },
  data () {
    return {
      isAdvanceFilter: false,
      checkedRow: [],
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
      this.search()
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
      this.search()
    }, 300),
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,details,account',
          sort_by: '-form.number',
          group_by: 'payment_order.id',
          fields: 'payment_order.*',
          filter_form: 'notArchived;pending;approvalApproved',
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'account.name': this.searchText
          },
          filter_null: 'payment_order.payment_id',
          filter_equal: {
            'payment_order.payment_type': 'bank',
            'form.notes': this.searchText,
            'account.name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;paymentable;details.account;details.allocation',
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
      this.search()
    }
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
