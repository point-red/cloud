<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item active">{{ $t('cash') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="input-group block">
            <router-link
              v-if="$permission.has('create cash')"
              to="/finance/cash/in"
              class="input-group-prepend"
            >
              <span class="input-group-text">
                <i class="fa fa-plus mr-5" /> {{ $t('cash in') | uppercase }}
              </span>
            </router-link>
            <router-link
              v-if="$permission.has('create cash')"
              to="/finance/cash/out"
              class="input-group-prepend"
            >
              <span class="input-group-text">
                <i class="fa fa-plus mr-5" /> {{ $t('cash out') | uppercase }}
              </span>
            </router-link>
            <p-form-input
              id="search-text"
              ref="searchText"
              name="search-text"
              placeholder="Search"
              class="btn-block"
              :value="searchText"
              @input="filterSearch"
            />
          </div>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>Payment From / To</th>
              <th>Account</th>
              <th>Notes</th>
              <th>Allocation</th>
              <th class="text-right">
                Amount
              </th>
            </tr>
            <template v-for="(payment, index) in payments">
              <template v-for="(paymentDetail, index2) in payment.details">
                <tr
                  :key="'payment-' + index + '-' + index2"
                  slot="p-body"
                >
                  <th>
                    <router-link
                      v-if="payment.disbursed == false"
                      :to="{ name: 'finance.cash.in.show', params: { id: payment.id }}"
                    >
                      {{ payment.form.number }}
                    </router-link>
                    <router-link
                      v-if="payment.disbursed == true"
                      :to="{ name: 'finance.cash.out.show', params: { id: payment.id }}"
                    >
                      {{ payment.form.number }}
                    </router-link>
                  </th>
                  <td>{{ payment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                  <td>{{ payment.paymentable ? payment.paymentable.name : '' }}</td>
                  <td>{{ paymentDetail.chart_of_account.number }} - {{ paymentDetail.chart_of_account.alias }}</td>
                  <td>{{ paymentDetail.notes }}</td>
                  <td>{{ paymentDetail.allocation ? paymentDetail.allocation.name : '' }}</td>
                  <td class="text-right">
                    {{ paymentDetail.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
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
  computed: {
    ...mapGetters('financePayment', ['payments', 'pagination'])
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
      this.getPayments()
    }
  },
  created () {
    this.getPayments()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('financePayment', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPayments()
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
    getPayments () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,payment_account,details,account,allocation',
          sort_by: '-form.date',
          fields: 'payment.*',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'payment_detail.notes': this.searchText,
            'allocation.name': this.searchText,
            'account.alias': this.searchText
          },
          filter_equal: {
            'payment.payment_type': 'cash'
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;details.chartOfAccount;details.allocation;paymentable',
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
      this.getPayments()
    }
  }
}
</script>
