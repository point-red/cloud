<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('cut off') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :title="$t('cut off')"
        :header="false"
      >
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create cut off')"
            to="/accounting/cut-off/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
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
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>{{ $t('account number') | uppercase }}</th>
              <th>{{ $t('account name') | uppercase }}</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
            </tr>
            <template slot="p-body">
              <tr
                v-for="(cutoff) in cutOffAccounts"
                :key="cutoff.id"
              >
                <td width="150px">
                  {{ cutoff.chart_of_account && cutoff.chart_of_account.number }}
                </td>
                <td>
                  <router-link
                    :to="{ name: 'accounting.cut.off.show', params: { id: cutoff.chart_of_account.id } }"
                  >
                    {{ cutoff.chart_of_account && cutoff.chart_of_account.alias }}
                  </router-link>
                </td>
                <td>{{ cutoff.debit | numberFormat }}</td>
                <td>{{ cutoff.credit | numberFormat }}</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  align="center"
                >
                  <b>Total</b>
                </td>
                <td>{{ (cutOffAccounts.reduce((total, cutoff) => total + cutoff.debit, 0)) | numberFormat }}</td>
                <td>{{ (cutOffAccounts.reduce((total, cutoff) => total + cutoff.credit, 0)) | numberFormat }}</td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable
  },
  data () {
    return {
      isLoading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      isAdvanceFilter: false,
      checkedRow: []
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
          join: 'account',
          fields: 'cutoff_accounts.id;cutoff_id;chart_of_account_id;raw:sum(debit) as debit;raw:sum(credit) as credit;cutoff_accounts.created_at;cutoff_accounts.updated_at',
          sort_by: 'account.number',
          group_by: 'chart_of_account_id',
          // filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText
          },
          limit: 10,
          includes: 'chartOfAccount',
          page: this.currentPage
        }
      }).then((response) => {
        console.log(this.cutfOffs)
        this.isLoading = false
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
    }, 300)
  }
}
</script>
