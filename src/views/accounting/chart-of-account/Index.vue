<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">{{ $t('chart of account') | uppercase }}</span>
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
              <td>
                <router-link :to="{ name: 'accounting.chart-of-account.show', params: { id: chartOfAccount.id }}">
                  {{ chartOfAccount.name }}
                </router-link>
              </td>
              <td>{{ chartOfAccount.type.name }}</td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
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
    BreadcrumbAccounting,
    TabMenu,
    PointTable
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chartOfAccounts'])
  },
  methods: {
    ...mapActions('accountingChartOfAccount', {
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
            'name': this.searchText,
            'number': this.searchText
          },
          sort_by: 'number,name'
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
