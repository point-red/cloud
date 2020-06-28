<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('warehouse') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create warehouse')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addWarehouse.open()"
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
              <th>Name</th>
              <th>Branch</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(warehouse, index) in warehouses"
              :key="warehouse.id"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + (index + 1) }}</th>
              <td>
                <router-link :to="{ name: 'warehouse.show', params: { id: warehouse.id }}">
                  {{ warehouse.name }}
                </router-link>
              </td>
              <td>
                <template v-if="warehouse.branch">
                  {{ warehouse.branch.name }}
                </template>
              </td>
              <td>{{ warehouse.address }}</td>
              <td>{{ warehouse.phone }}</td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-warehouse
      ref="addWarehouse"
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
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouses', 'pagination'])
  },
  created () {
    this.getWarehouseRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterWarehouse', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getWarehouseRequest()
    }, 300),
    getWarehouseRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'warehouse.*',
          sort_by: 'warehouse.name',
          filter_like: {
            'warehouse.name': this.searchText
          },
          includes: 'branch',
          limit: this.limit,
          page: this.page
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.page = value
      this.getWarehouseRequest()
    },
    onAdded () {
      this.getWarehouseRequest()
    }
  }
}
</script>
