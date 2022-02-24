<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item">
        <router-link
          to="/accounting/cut-off"
          class="breadcrumb-item"
        >{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span
        v-if="chartOfAccount.chart_of_account"
        class="breadcrumb-item active"
      >{{ chartOfAccount.chart_of_account.alias | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :title="$t('cut off')"
        :header="false"
      >
        <div class="text-right">
          <router-link
            v-if="$permission.has('create cut off')"
            to="/accounting/cut-off/create"
            class="btn btn-sm btn-outline-secondary mr-5"
          >
            {{ $t('create') | uppercase }}
          </router-link>
        </div>
        <hr>

        <div class="col-sm-12 p-0">
          <div class="col-sm-6 p-0">
            <p class="h3">
              {{ $t('cut off') | capitalize }}
            </p>
            <table
              v-if="chartOfAccount && chartOfAccount.chart_of_account"
              class="table table-bordered"
            >
              <tr>
                <td>{{ $t('account number') | capitalize }}</td>
                <td>{{ chartOfAccount.chart_of_account.number }}</td>
              </tr>
              <tr>
                <td>{{ $t('account') | capitalize }}</td>
                <td>{{ chartOfAccount.chart_of_account.alias }}</td>
              </tr>
            </table>
          </div>
        </div>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>{{ $t('form date') | capitalize }}</th>
              <th>{{ $t('form number') | capitalize }}</th>
              <th>{{ $t('debit') | capitalize }}</th>
              <th>{{ $t('credit') | capitalize }}</th>
              <th>{{ $t('notes') | capitalize }}</th>
              <th>{{ $t('created by') | capitalize }}</th>
            </tr>
            <template slot="p-body">
              <tr
                v-for="(cutoff, idx) in cutOffAccounts"
                :key="idx"
              >
                <td>{{ cutoff.cutoff && cutoff.cutoff.form.date | dateFormat('DD MMM YYYY') }}</td>
                <td>
                  <span
                    class="select-link"
                    @click="showDetail(cutoff)"
                  >
                    {{ cutoff.cutoff && cutoff.cutoff.form.number }}
                  </span>
                </td>
                <td>{{ cutoff.debit | numberFormat }}</td>
                <td>{{ cutoff.credit | numberFormat }}</td>
                <td>{{ cutoff.cutoff && cutoff.cutoff.form.notes }}</td>
                <td>{{ cutoff.cutoff && cutoff.cutoff.form.created_by.name }}</td>
              </tr>
              <tr>
                <td colspan="2">
                  <b>Total</b>
                </td>
                <td>{{ cutOffAccounts.reduce((total, cutoff) => total + cutoff.debit, 0) | numberFormat }}</td>
                <td>{{ cutOffAccounts.reduce((total, cutoff) => total + cutoff.credit, 0) | numberFormat }}</td>
                <td />
                <td />
              </tr>
            </template>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>

    <MPaymentShow
      ref="paymentRef"
    />
    <MFixedAssetShow
      ref="fixedAssetRef"
    />
    <MInventoriesShow
      ref="inventorieRef"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import MPaymentShow from './MPaymentShow'
import MFixedAssetShow from './MFixedAssetShow'
import MInventoriesShow from './MInventoriesShow'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable,
    MPaymentShow,
    MFixedAssetShow,
    MInventoriesShow
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      lastPage: 1,
      limit: 1000,
      chartOfAccount: null
    }
  },
  computed: {
    ...mapGetters('accountingCutOff', ['cutOffAccounts'])
  },
  created () {
    this.getCutOffs()
  },
  methods: {
    ...mapActions('accountingCutOff', ['getByAccount']),
    getCutOffs () {
      this.isLoading = true
      this.getByAccount({
        params: {
          filter_equal: {
            chart_of_account_id: this.id
          },
          limit: 200,
          includes: 'chartOfAccount.type;cutoff.form.createdBy',
          page: this.currentPage
        }
      }).then((response) => {
        this.isLoading = false
        console.log(response)
        this.chartOfAccount = (response.data || []).find(item => item.chart_of_account_id == this.id)
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getCutOffs()
    }, 300),
    showDetail (cutoff) {
      if (!cutoff.chart_of_account.sub_ledger) return false
      const subLedger = cutoff.chart_of_account.sub_ledger.trim()
      if (['CUSTOMER', 'SUPPLIER', 'EXPEDITION', 'EMPLOYEE'].indexOf(subLedger) > -1) {
        this.$refs.paymentRef.open(cutoff)
      } else if (subLedger === 'ITEM') {
        this.$refs.inventorieRef.open(cutoff)
      } else if (subLedger === 'FIXED ASSET') {
        this.$refs.fixedAssetRef.open(cutoff)
      }
    }
  }
}
</script>

<style lang="scss">
td .fa {
  font-size:14px;
  padding: 5px;
}
</style>
