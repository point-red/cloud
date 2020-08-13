<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('chart of account') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div
          v-show="chartOfAccounts.length == 0 && !searchText && !isLoading"
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
        <div class="input-group block mb-5">
          <a
            v-if="$permission.has('create chart of account')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addAccount.open()"
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
                Debit
              </th>
              <th class="text-center">
                Credit
              </th>
              <th class="text-center">
                Locked
              </th>
            </tr>
            <tr
              v-for="chartOfAccount in chartOfAccounts"
              :key="chartOfAccount.id"
              slot="p-body"
            >
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
                <i
                  v-if="chartOfAccount.position == 'DEBIT'"
                  class="fa fa-check"
                />
              </td>
              <td class="text-center">
                <i
                  v-if="chartOfAccount.position == 'CREDIT'"
                  class="fa fa-check"
                />
              </td>
              <td class="text-center">
                <i
                  v-if="chartOfAccount.is_locked"
                  class="fa fa-check"
                />
              </td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-chart-of-account
      ref="addAccount"
      @added="onAdded"
    />
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
      isSaving: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1
    }
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chartOfAccounts'])
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('accountingChartOfAccount', {
      getChartOfAccounts: 'get'
    }),
    ...mapActions('accountingChartOfAccountGenerator', ['create']),
    generate () {
      this.isSaving = true
      this.create()
        .then(response => {
          this.search()
        }).catch(error => {
          this.isSaving = false
        })
    },
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
  }
}
</script>
