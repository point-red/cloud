<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('item price list') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create supplier')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addPricingGroup.open()"
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
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Item</th>
              <th class="text-center">
                Unit
              </th>
              <th
                v-for="(group, index) in groups"
                :key="index"
                class="text-right"
              >
                <a
                  v-if="$permission.has('create item')"
                  href="javascript:void(0)"
                  @click="$refs.editPricingGroup.open(group)"
                >
                  {{ group.label }}
                </a>
              </th>
              <th />
            </tr>
            <template v-for="(item, index) in items">
              <tr
                v-for="(itemUnit, index2) in item.units"
                :key="itemUnit.id"
                slot="p-body"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                    {{ item.label }}
                  </router-link>
                </td>
                <td class="text-center">
                  {{ itemUnit.name | uppercase }}
                  <span
                    v-if="itemUnit.converter > 1"
                    style="font-size: 10px;"
                  >
                    ({{ itemUnit.converter }} {{ item.units[0].label }})
                  </span>
                </td>
                <td
                  v-for="(group, index3) in itemUnit.prices"
                  :key="index3"
                  class="text-right"
                >
                  <a
                    v-if="editPriceIndex != index + '-' + index2 + '-' + index3"
                    href="javascript:void(0)"
                    @click="editPrice(index + '-' + index2 + '-' + index3, group.id)"
                  >
                    {{ itemUnit.prices[index3].price | numberFormat }}
                  </a>
                  <p-form-number
                    v-else
                    id="price"
                    v-model="itemUnit.prices[index3].price"
                    name="price"
                    @keyup.native.enter="savePrice(itemUnit.id, itemUnit.prices[index3].price)"
                  />
                </td>
                <td />
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <m-add-pricing-group
      ref="addPricingGroup"
      @added="onAddedPricingGroup($event)"
    />
    <m-edit-pricing-group
      ref="editPricingGroup"
      @updated="onUpdatedPricingGroup($event)"
    />
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
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1,
      editPriceIndex: '',
      editPriceGroupId: 0
    }
  },
  computed: {
    ...mapGetters('masterPriceListItem', ['items', 'pagination', 'groups'])
  },
  created () {
    this.getPriceList()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterPriceListItem', {
      getItem: 'get',
      updatePrice: 'create'
    }),
    onUpdatedPricingGroup () {
      this.getPriceList()
    },
    onAddedPricingGroup () {
      this.getPriceList()
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
      this.page = 1
      this.getPriceList()
    }, 300),
    updatePage (value) {
      this.page = value
      this.getPriceList()
    },
    getPriceList () {
      this.isLoading = true
      this.getItem({
        params: {
          limit: this.limit,
          page: this.page,
          filter_like: {
            code: this.searchText,
            name: this.searchText
          }
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    }
  }
}
</script>
