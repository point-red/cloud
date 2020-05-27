<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <span class="breadcrumb-item active">{{ $t('payment order') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('payment order')">
        <div class="input-group block">
          <router-link
            to="/finance/payment-order/create"
            v-if="$permission.has('create payment order')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
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
            <div class="col-sm-6 text-center">
              <p-form-row id="form-approval-status" name="form-approval-status" :label="$t('approval status')" :is-horizontal="false">
                <div slot="body">
                  <span
                    @click="$refs.formApprovalStatus.open()"
                    class="select-link">
                    {{ formApprovalStatus.label || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row id="form-status" name="form-status" :label="$t('form status')" :is-horizontal="false">
                <div slot="body">
                  <span
                    @click="$refs.formStatus.open()"
                    class="select-link">
                    {{ formStatus.label || $t('select') | uppercase }}
                  </span>
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
              <th class="text-center">Approval Status</th>
              <th class="text-center">Form Status</th>
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
                  <div v-if="paymentOrder.form.approval_status == 0" class="badge badge-primary">{{ $t('pending') | uppercase }}</div>
                  <div v-if="paymentOrder.form.approval_status == -1" class="badge badge-danger">{{ $t('rejected') | uppercase }}</div>
                  <div v-if="paymentOrder.form.approval_status == 1" class="badge badge-success">{{ $t('approved') | uppercase }}</div>
                </td>
                <td class="text-center">
                  <div v-if="paymentOrder.form.cancellation_status == 1" class="badge badge-danger">{{ $t('canceled') | uppercase }}</div>
                  <div v-else-if="paymentOrder.form.done == 0" class="badge badge-primary">{{ $t('pending') | uppercase }}</div>
                  <div v-else-if="paymentOrder.form.done == 1" class="badge badge-success">{{ $t('done') | uppercase }}</div>
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
    <m-form-approval-status ref="formApprovalStatus" @choosen="chooseFormApprovalStatus($event)"/>
    <m-form-status ref="formStatus" @choosen="chooseFormStatus($event)"/>
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
      limit: 10,
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: null
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
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.search()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.search()
    },
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,details,account',
          sort_by: '-form.number',
          fields: 'payment_order.*',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'account.name': this.searchText
          },
          // filter_polymorphic: {
          //   'paymentable.name': this.searchText
          // },
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
