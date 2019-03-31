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
                <button class="btn btn-secondary btn-sm" @click="addPricingGroup">Add Group</button>
              </th>
            </tr>
            <template v-for="(item, index) in items">
            <tr
              v-for="(itemUnit, index2) in item.units"
              :key="itemUnit.id"
              slot="p-body">
              <th>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{item.name}}
                </router-link>
              </th>
              <td>{{ itemUnit.name }} (x{{ itemUnit.converter }})</td>
              <td class="text-right" v-for="(group, index3) in itemUnit.prices" :key="index3">
                <a href="javascript:void(0)" @click="editPrice(index + '-' + index2 + '-' + index3)" v-if="editPriceIndex != index + '-' + index2 + '-' + index3">
                  {{ itemUnit.prices[index3].price | numberFormat }}                  
                </a>
                <p-form-number
                  v-else
                  id="price"
                  name="price"                
                  :value="itemUnit.prices[index3].price"/>
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

    <m-pricing-group
      id="pricing-gorup"
      name="pricing_gorup"
      ref="pricingGroupModal"
      title="Pricing Group"
      @add="onSubmitPricingGroup"/>
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
      lastPage: 1,
      editPriceIndex: ''
    }
  },
  computed: {
    ...mapGetters('masterPriceListItem', ['items', 'pagination', 'groups'])
  },
  methods: {
    ...mapActions('masterPriceListItem', {
      getItem: 'get'
    }),
    addPricingGroup () {
      console.log('add pricing group')
      this.$refs.pricingGroupModal.show()
    },
    onSubmitPricingGroup () {

    },
    editPrice (index) {
      this.editPriceIndex = index
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
