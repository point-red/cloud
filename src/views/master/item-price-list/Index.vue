<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('item price list') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
          <a href="javascript:void(0)" class="input-group-append" @click="addPricingGroup">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </a>
        </div>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Item</th>
              <th class="text-center">Unit</th>
              <th class="text-right" v-for="(group, index) in groups" :key="index">
                <a
                  href="javascript:void(0)"
                  style="color:blue"
                  @click="editPricingGroup(group)">{{ group.label }}
                </a>
              </th>
              <th></th>
            </tr>
            <template v-for="(item, index) in items">
            <tr
              v-for="(itemUnit, index2) in item.units"
              :key="itemUnit.id"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{ item.label }}
                </router-link>
              </td>
              <td class="text-center">
                {{ itemUnit.name | uppercase }}
                <span v-if="itemUnit.converter > 1" style="font-size: 10px;">
                ({{ itemUnit.converter }} {{ item.units[0].label }})
                </span>
              </td>
              <td class="text-right" v-for="(group, index3) in itemUnit.prices" :key="index3">
                <a href="javascript:void(0)" @click="editPrice(index + '-' + index2 + '-' + index3, group.id)" v-if="editPriceIndex != index + '-' + index2 + '-' + index3">
                  {{ itemUnit.prices[index3].price | numberFormat }}
                </a>
                <p-form-number
                  v-else
                  id="price"
                  name="price"
                  v-model="itemUnit.prices[index3].price"
                  @keyup.native.enter="savePrice(itemUnit.id, itemUnit.prices[index3].price)"/>
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

    <m-add-pricing-group
      id="pricing-gorup"
      name="pricing_gorup"
      ref="pricingGroupModal"
      title="Pricing Group"
      @added="onSubmitPricingGroup"/>
    <m-edit-pricing-group
      id="edit-pricing-gorup"
      name="edit_pricing_gorup"
      ref="editPricingGroupModal"
      title="Edit Pricing Group"
      @added="onSubmitPricingGroup"/>
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
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      editPriceIndex: '',
      editPriceGroupId: 0
    }
  },
  computed: {
    ...mapGetters('masterPriceListItem', ['items', 'pagination', 'groups'])
  },
  methods: {
    ...mapActions('masterPriceListItem', {
      getItem: 'get',
      updatePrice: 'create'
    }),
    test () {
      alert('asd')
    },
    addPricingGroup () {
      this.$refs.pricingGroupModal.show()
    },
    editPricingGroup (group) {
      this.$refs.editPricingGroupModal.show(group)
    },
    onSubmitPricingGroup () {
      console.log('onsubmit')
      this.getPriceList()
      this.$refs.pricingGroupModal.close()
    },
    editPrice (index, groupId) {
      this.editPriceIndex = index
      this.editPriceGroupId = groupId
    },
    savePrice (itemUnitId, price) {
      this.updatePrice({
        pricing_group_id: this.editPriceGroupId,
        item_unit_id: itemUnitId,
        price: price,
        discount_percent: 0,
        discount_value: 0,
        date: new Date()
      }).then(response => {
        this.getPriceList()
        this.editPriceIndex = -1
      })
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
      this.isLoading = true
      this.getItem({
        params: {
          limit: 20,
          page: this.currentPage,
          filter_like: {
            'code': this.searchText,
            'name': this.searchText
          }
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    }
  },
  created () {
    this.getPriceList()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
