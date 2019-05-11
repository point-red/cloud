<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('warehouse') | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('warehouse')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"/>
        <hr/>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Name</th>
            </tr>
            <tr
              v-for="(warehouse, index) in warehouses"
              :key="warehouse.id"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'warehouse.show', params: { id: warehouse.id }}">
                  {{ warehouse.name | titlecase }}
                </router-link>
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
    ...mapGetters('masterWarehouse', ['warehouses', 'pagination'])
  },
  methods: {
    ...mapActions('masterWarehouse', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getWarehouseRequest()
    }, 300),
    getWarehouseRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'warehouses.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText
          },
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getWarehouseRequest()
    }
  },
  created () {
    this.isLoading = true
    this.getWarehouseRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
