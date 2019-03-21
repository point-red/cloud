<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Item</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
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
              <th>Item</th>
              <th>Unit</th>
              <th class="text-right" v-for="(group, index) in groups" :key="index">
                {{ group.label }}
              </th>
              <th>
                <button class="btn btn-secondary btn-sm">Add Group</button>
              </th>
            </tr>
            <template v-for="item in items">
            <tr
              v-for="itemUnit in item.units"
              :key="itemUnit.id"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{item.name}}
                </router-link>
              </th>
              <td>{{ itemUnit.name }} (x{{ itemUnit.converter }})</td>
              <td class="text-right" v-for="(group, index) in groups" :key="index">
                <a href="javascript:void(0)" @click="editPrice(index)">
                  {{ itemUnit.prices[index].price | numberFormat }}
                </a>
                <!-- <p-form-number
                  id="price"
                  name="price"
                  :value="0"/> -->
              </td>
              <td></td>
            </tr>
            </template>
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
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      title: 'Item',
      loading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('PriceListItem', ['items', 'pagination', 'groups'])
  },
  methods: {
    ...mapActions('PriceListItem', {
      getItem: 'get'
    }),
    editPrice () {
      //
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPriceList()
    }, 300),
    updatePage (value) {
      this.currentPage = value
      this.getPriceList()
    },
    getPriceList () {
      this.loading = true
      this.getItem({
        params: {
          limit: 20,
          page: this.currentPage,
          filter_like: {
            'name': this.searchText
          }
        }
      }).then(response => {
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notifications.error(error.message)
      })
    }
  },
  created () {
    this.getPriceList()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
