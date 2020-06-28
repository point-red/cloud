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
              <span class="breadcrumb-item active">{{ $t('account') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('inventory') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account payable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('purchase down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account receivable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('sales down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('review') | uppercase }}</span>
            </nav>
            <hr>
            <h5 class="text-center">
              CHART OF ACCOUNT
            </h5>
            <div
              v-show="accounts.length == 0 && !searchText && !isLoading"
              class="text-center"
            >
              <p-block-inner>
                <p>
                  Anda tidak memiliki akun saat ini, klik tombol di bawah ini untuk generate default akun
                </p>
                <button
                  type="submit"
                  class="btn btn-sm btn-primary mb-15"
                  :disabled="isSaving"
                  @click="generate()"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('generate account') | uppercase }}
                </button>
              </p-block-inner>
              <hr>
            </div>
            <template>
              <div class="input-group block mb-5">
                <a
                  v-if="$permission.has('create chart of account')"
                  href="javascript:void(0)"
                  class="input-group-prepend"
                  @click="() => $refs.account.show()"
                >
                  <span class="input-group-text">
                    <i class="fa fa-plus" />
                  </span>
                </a>
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
                    <th class="text-center">
                      Sub Ledger
                    </th>
                    <th class="text-center">
                      Cash Flow
                    </th>
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
                    <td>
                      <a
                        href="javascript:void(0)"
                        @click="$refs.editAccount.show(account)"
                      >
                        {{ account.chart_of_account.alias }}
                      </a>
                    </td>
                    <td>{{ account.chart_of_account.type.alias }}</td>
                    <td class="text-center">
                      {{ account.chart_of_account.sub_ledger }}
                    </td>
                    <td class="text-center">
                      {{ account.chart_of_account.cash_flow }} <template v-if="account.chart_of_account.cash_flow">
                        +
                      </template>{{ account.chart_of_account.cash_flow_position }}
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
                      colspan="4"
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
                to="/accounting/cut-off/create/inventory"
                class="btn btn-sm btn-primary min-width-100 float-right"
              >
                {{ $t('next') | uppercase }}
              </router-link>
              <router-link
                tag="button"
                to="/accounting/cut-off/create"
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
