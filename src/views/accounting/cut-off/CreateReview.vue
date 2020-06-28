<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">
        <router-link
          to="/accounting/cut-off"
          class="breadcrumb-item"
        >{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <p-block>
            <nav
              class="breadcrumb bg-white text-center"
              style="display:block !important"
            >
              <router-link
                to="/accounting/cut-off/create"
                class="breadcrumb-item"
              >
                {{ $t('start') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/account"
                class="breadcrumb-item"
              >
                {{ $t('account') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/inventory"
                class="breadcrumb-item"
              >
                {{ $t('inventory') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/account-payable"
                class="breadcrumb-item"
              >
                {{ $t('account payable') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/purchase-down-payment"
                class="breadcrumb-item"
              >
                {{ $t('purchase down payment') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/account-receivable"
                class="breadcrumb-item"
              >
                {{ $t('account receivable') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/sales-down-payment"
                class="breadcrumb-item"
              >
                {{ $t('sales down payment') | uppercase }}
              </router-link>
              <span class="breadcrumb-item">{{ $t('review') | uppercase }}</span>
            </nav>
            <hr>
            <h5 class="text-center">
              CHART OF ACCOUNT
            </h5>
            <template>
              <div class="input-group block mb-5">
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
              <p-block-inner :is-loading="isLoading">
                <point-table>
                  <tr slot="p-head">
                    <th>Number</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Sub Ledger</th>
                    <th class="text-right">
                      Debit
                    </th>
                    <th class="text-right">
                      Credit
                    </th>
                  </tr>
                  <tr
                    v-for="account in accounts"
                    :key="account.id"
                    slot="p-body"
                  >
                    <td>{{ account.chart_of_account.number }}</td>
                    <td>{{ account.chart_of_account.alias }}</td>
                    <td>{{ account.chart_of_account.type.alias }}</td>
                    <td>
                      <template v-if="account.chart_of_account.sub_ledger">
                        {{ account.chart_of_account.sub_ledger.alias }}
                      </template>
                    </td>
                    <td class="text-right">
                      {{ account.debit | numberFormat }}
                    </td>
                    <td class="text-right">
                      {{ account.credit | numberFormat }}
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td
                      colspan="3"
                      class="text-right"
                    >
                      <b>TOTAL</b>
                    </td>
                    <td class="text-right">
                      {{ totalDebit | numberFormat }}
                    </td>
                    <td class="text-right">
                      {{ totalCredit | numberFormat }}
                    </td>
                  </tr>
                </point-table>
              </p-block-inner>
              <router-link
                tag="button"
                to="/accounting/cut-off/create/review"
                class="btn btn-sm btn-primary min-width-100 float-right"
              >
                {{ $t('submit') | uppercase }}
              </router-link>
              <router-link
                tag="button"
                to="/accounting/cut-off/create/sales-down-payment"
                class="btn btn-sm btn-primary min-width-100 float-left"
              >
                {{ $t('prev') | uppercase }}
              </router-link>
              <br><br><br>
            </template>
          </p-block>
        </div>
      </div>
    </div>
    <m-edit-account
      id="edit-account"
      ref="editAccount"
      @updated="getChartOfAccountsRequest()"
    />
    <m-create-account
      id="account"
      ref="account"
      @updated="getChartOfAccountsRequest()"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import MCreateAccount from './MCreateAccount'
import MEditAccount from './MEditAccount'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    MCreateAccount,
    MEditAccount,
    PointTable
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      totalCredit: 0,
      totalDebit: 0,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1
    }
  },
  computed: {
    ...mapGetters('accountingCutOffAccount', ['accounts'])
  },
  created () {
    this.getChartOfAccountsRequest()
  },
  methods: {
    ...mapActions('accountingCutOffAccount', ['get']),
    ...mapActions('accountingChartOfAccountGenerator', ['create']),
    generate () {
      this.isSaving = true
      this.create()
        .then(response => {
          this.getChartOfAccountsRequest()
        }).catch(error => {
          this.isSaving = false
        })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getChartOfAccountsRequest()
    }, 300),
    getChartOfAccountsRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'cut_off_accounts.*',
          limit: 1000,
          join: 'chartOfAccount',
          filter_like: {
            'chartOfAccount.alias': this.searchText,
            'chartOfAccount.number': this.searchText
          },
          includes: 'chartOfAccount.type',
          sort_by: 'chart_of_accounts.number;chart_of_accounts.alias'
        }
      }).then(response => {
        this.totalCredit = 0
        this.totalDebit = 0
        this.accounts.forEach(element => {
          this.totalCredit += parseFloat(element.credit)
          this.totalDebit += parseFloat(element.debit)
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    }
  }
}
</script>
