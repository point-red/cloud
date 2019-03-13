<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Chart of Account</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">      
      <p-block :header="true" title="Chart Of Account">
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
              <th>Number</th>
              <th>Name</th>
              <th>Type</th>
              <th></th>
            </tr>
            <tr
              v-for="chartOfAccount in chartOfAccounts"
              :key="chartOfAccount.id"
              slot="p-body">
              <td>{{ chartOfAccount.number }}</td>
              <td>{{ chartOfAccount.name }}</td>
              <td>{{ chartOfAccount.type.name }}</td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/accounting/Breadcrumb'
import TabMenu from './TabMenu'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1
    }
  },
  components: {
    Breadcrumb,
    TabMenu,
    PointTable
  },
  computed: {
    ...mapGetters('ChartOfAccount', ['chartOfAccounts']),
  },
  methods: {
    ...mapActions('ChartOfAccount', {
      getChartOfAccounts: 'get'
    }),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getChartOfAccountsRequest()
    }, 300),
    getChartOfAccountsRequest () {
      this.loading = true
      this.getChartOfAccounts({
        params: {
          limit: 1000,
          filter_like: {
            'chart_of_accounts.name': this.searchText,
            'chart_of_accounts.number': this.searchText,
            'chart_of_account_types.name': this.searchText
          }
        }
      }).then(response => {
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  },
  created () {    
    this.getChartOfAccountsRequest()
  }
}
</script>
