<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">{{ $t('chart of account') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <a
            href="javascript:void(0)"
            @click="$refs.addAccount.open()"
            v-if="$permission.has('create chart of account')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </a>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            ref="searchText"
            :value="searchText"
            @input="filterSearch"/>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Name</th>
              <th>Type</th>
              <th class="text-center">Sub Ledger</th>
              <th class="text-center">Debit</th>
              <th class="text-center">Credit</th>
            </tr>
            <tr
              v-for="chartOfAccount in chartOfAccounts"
              :key="chartOfAccount.id"
              slot="p-body">
              <th>{{ chartOfAccount.number }}</th>
              <td>
                <router-link :to="{ name: 'accounting.chart-of-account.show', params: { id: chartOfAccount.id }}">
                  {{ chartOfAccount.alias }}
                </router-link>
              </td>
              <td>{{ chartOfAccount.type.alias }}</td>
              <td class="text-center">
                {{ chartOfAccount.sub_ledger }}
              </td>
              <td class="text-center">
                <i class="fa fa-check" v-if="chartOfAccount.position == 'DEBIT'"></i>
              </td>
              <td class="text-center">
                <i class="fa fa-check" v-if="chartOfAccount.position == 'CREDIT'"></i>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-chart-of-account ref="addAccount" @added="onAdded"></m-add-chart-of-account>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
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
      this.search()
    }, 300),
    search () {
      this.isLoading = true
      this.getChartOfAccounts({
        params: {
          join: 'account_type',
          fields: 'account.*',
          limit: 1000,
          filter_like: {
            'account_type.alias': this.searchText,
            'account.alias': this.searchText,
            'account.number': this.searchText
          },
          includes: 'type',
          sort_by: 'account.number;account.alias'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    onAdded () {
      this.search()
    }
  },
  created () {
    this.search()
  }
}
</script>
