<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('warehouse') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            to="/master/warehouse/create"
            v-if="$permission.has('create warehouse')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
        </div>
        <hr/>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Name</th>
            </tr>
            <tr
              v-for="(warehouse, index) in warehouses"
              :key="warehouse.id"
              slot="p-body">
              <th>{{ (currentPage - 1) * limit + (index + 1) }}</th>
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
      lastPage: 1,
      limit: 10
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
          limit: this.limit,
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
    this.getWarehouseRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
