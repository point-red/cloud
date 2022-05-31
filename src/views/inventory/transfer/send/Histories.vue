<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <breadcrumb-inventory-transfer />
      <router-link
        to="/inventory/transfer/send"
        class="breadcrumb-item"
      >
        {{ $t('send') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'inventory.transfer.send.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ historyTransferItems[0].number }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('histories') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create transfer item')"
            to="/inventory/transfer/send/create"
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
            <template v-for="(historyTransferItem, index) in historyTransferItems">
              <tr
                slot="p-body"
                :key="index"
              >
                <td class="text-center">
                  {{ historyTransferItem.date | dateFormat('DD MMMM YYYY HH:mm') }}
                </td>
                <th class="text-center">
                  <router-link :to="{ name: 'inventory.transfer.send.show', params: { id: historyTransferItem.formable_id }}">
                    {{ historyTransferItem.number }}
                  </router-link>
                </th>
                <td class="text-center">
                  {{ historyTransferItem.user.name }}
                </td>
                <td class="text-center">
                  {{ historyTransferItem.activity }}
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
    ...mapGetters('inventoryTransferItem', ['historyTransferItems', 'pagination'])
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
        this.getHistoriesTransferItem()
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
    this.getHistoriesTransferItem()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('inventoryTransferItem', ['getHistories']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getHistoriesTransferItem()
    }, 300),
    getHistoriesTransferItem () {
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
      this.getHistoriesTransferItem()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
