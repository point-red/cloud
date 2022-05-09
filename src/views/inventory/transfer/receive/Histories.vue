<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <breadcrumb-inventory-transfer />
      <router-link
        to="/inventory/transfer/receive"
        class="breadcrumb-item"
      >
        {{ $t('receive') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'inventory.transfer.receive.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ historyReceiveItems[0].number }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('histories') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create transfer item')"
            to="/inventory/transfer/receive/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
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
              <th class="text-center">
                Date
              </th>
              <th class="text-center">
                Form Number
              </th>
              <th class="text-center">
                User
              </th>
              <th class="text-center">
                Activity
              </th>
            </tr>
            <template v-for="(historyReceiveItem, index) in historyReceiveItems">
              <tr
                slot="p-body"
                :key="index"
              >
                <td class="text-center">
                  {{ historyReceiveItem.date | dateFormat('DD MMMM YYYY HH:mm') }}
                </td>
                <th class="text-center">
                  <router-link :to="{ name: 'inventory.transfer.receive.show', params: { id: historyReceiveItem.formable_id }}">
                    {{ historyReceiveItem.number }}
                  </router-link>
                </th>
                <td class="text-center">
                  {{ historyReceiveItem.user.name }}
                </td>
                <td class="text-center">
                  {{ historyReceiveItem.activity }}
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import BreadcrumbInventoryTransfer from '@/views/inventory/transfer/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    BreadcrumbInventoryTransfer,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      isAdvanceFilter: false,
      checkedRow: [],
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('inventoryReceiveItem', ['historyReceiveItems', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getHistoriesReceiveItem()
      },
      deep: true
    }
  },
  created () {
    this.$router.push({
      query: {
        ...this.$route.query,
        date_from: this.date.start,
        date_to: this.date.end
      }
    })
    this.getHistoriesReceiveItem()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('inventoryReceiveItem', ['getHistories']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getHistoriesReceiveItem()
    }, 300),
    getHistoriesReceiveItem () {
      this.isLoading = true
      this.getHistories({
        id: this.id,
        params: {
          sort_by: '-user_activity.date',
          limit: 10,
          includes: 'user',
          page: this.currentPage
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getHistoriesReceiveItem()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
