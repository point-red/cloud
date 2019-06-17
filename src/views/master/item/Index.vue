<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Item</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          ref="searchText"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Name</th>
              <th>Account</th>
              <th>Stock</th>
            </tr>
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{ item.name }}
                </router-link>
              </td>
              <td>
                <template v-if="item.account">
                  {{ item.account.number }} - {{ item.account.name | titlecase }}
                </template>
              </td>
              <td>
                <template v-if="item.units.length">
                  {{ item.stock | numberFormat }} {{ item.units[0].label }}
                </template>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
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
    ...mapGetters('masterItem', ['items', 'pagination'])
  },
  methods: {
    ...mapActions('masterItem', ['get']),
    updatePage (value) {
      this.currentPage = value
      this.getItemRequest()
    },
    getItemRequest () {
      this.isLoading = true
      this.get({
        params: {
          page: this.currentPage,
          limit: 20,
          sort_by: 'name',
          filter_like: {
            'code': this.searchText,
            'name': this.searchText
          },
          includes: 'account;units'
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
      this.getItemRequest()
    }, 300)
  },
  created () {
    this.isLoading = true
    this.getItemRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
