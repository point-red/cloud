<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('fixed asset') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create fixed asset')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addFixedAsset.open()"
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
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Code</th>
              <th>Name</th>
              <th>Account</th>
              <th>Depreciation Account</th>
              <th>Accumulation Account</th>
              <th>Useful Life (year)</th>
              <th>Salvage Value</th>
            </tr>
            <tr
              v-for="(fixedAsset, index) in fixedAssets"
              :key="fixedAsset.id"
              slot="p-body"
            >
              <th>{{ ++index }}</th>
              <td>
                <router-link :to="{ name: 'fixedAsset.show', params: { id: fixedAsset.id }}">
                  {{ fixedAsset.code }}
                </router-link>
              </td>
              <td>
                <router-link :to="{ name: 'fixedAsset.show', params: { id: fixedAsset.id }}">
                  {{ fixedAsset.name }}
                </router-link>
              </td>
              <td>
                <template v-if="fixedAsset.account">
                  {{ fixedAsset.account.number }} - {{ fixedAsset.account.alias }}
                </template>
              </td>
              <td>
                <template v-if="fixedAsset.depreciation_account">
                  {{ fixedAsset.depreciation_account.number }} - {{ fixedAsset.depreciation_account.alias }}
                </template>
              </td>
              <td>
                <template v-if="fixedAsset.accumulation_account">
                  {{ fixedAsset.accumulation_account.number }} - {{ fixedAsset.accumulation_account.alias }}
                </template>
              </td>
              <td>
                {{ fixedAsset.useful_life_year | numberFormat }}
              </td>
              <td>
                {{ fixedAsset.salvage_value | numberFormat }}
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-fixed-asset
      ref="addFixedAsset"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterFixedAsset', ['fixedAssets', 'pagination'])
  },
  created () {
    this.search()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterFixedAsset', ['get']),
    onAdded () {
      this.search()
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    },
    search () {
      this.isLoading = true
      this.get({
        params: {
          page: this.currentPage,
          limit: 10,
          sort_by: 'name',
          filter_like: {
            code: this.searchText,
            name: this.searchText
          },
          includes: 'groups;account;accumulationAccount;depreciationAccount'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.search()
    }, 300)
  }
}
</script>
