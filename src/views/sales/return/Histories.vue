<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        :to="{ name: 'sales.return.index' }"
        class="breadcrumb-item"
      >
        {{ $t('sales return ') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'sales.return.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ salesReturnHistories[0] ? salesReturnHistories[0].number : '' | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('histories') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create sales return')"
            to="/sales/return/create"
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
                No
              </th>
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
            <template v-for="(salesReturnHistory, index) in salesReturnHistories">
              <tr
                slot="p-body"
                :key="index"
              >
                <td class="text-center">
                  {{ index+1 }}
                </td>
                <td class="text-center">
                  {{ salesReturnHistory.date | dateFormat('DD MMMM YYYY HH:mm') }}
                </td>
                <th class="text-center">
                  <router-link :to="{ name: 'sales.return.show', params: { id: salesReturnHistory.formable_id }}">
                    {{ salesReturnHistory.number }}
                  </router-link>
                </th>
                <td class="text-center">
                  {{ salesReturnHistory.user.name }}
                </td>
                <td class="text-center">
                  {{ salesReturnHistory.activity }}
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
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
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
        start: this.$route.query.date_from
          ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00')
          : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to
          ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59')
          : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('salesReturn', ['salesReturnHistories', 'pagination'])
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
        this.getsalesReturnHistories()
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
    this.getsalesReturnHistories()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesReturn', ['getHistories']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getsalesReturnHistories()
    }, 300),
    getsalesReturnHistories () {
      this.isLoading = true
      this.getHistories({
        id: this.id,
        params: {
          sort_by: '-user_activities.date',
          includes: 'user',
          filter_like: {
            'form.number': this.searchText,
            'user_activities.activity': this.searchText
          },
          or_filter_where_has_like: [
            {
              user: {
                name: this.searchText
              }
            }
          ],
          limit: 10,
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
      this.getsalesReturnHistories()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
