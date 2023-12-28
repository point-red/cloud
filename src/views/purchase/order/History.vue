<template>
  <div>
    <breadcrumb>
      <breadcrumb-order />
      <router-link
        to="/purchase/order"
        class="breadcrumb-item"
      >
        {{ $t('purchase order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('history') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('purchase order')">
        <div class="input-group block">
          <a
            v-if="$permission.has('read purchase order')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="downloadExcelList()"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </a>
          <router-link
            v-if="$permission.has('create purchase order')"
            to="/purchase/order/create"
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
            <template v-for="(history, index) in histories">
              <tr
                :key="'purchase-order-' + index "
                slot="p-body"
              >
                <td class="text-center">
                  {{ ++index }}
                </td>
                <td class="text-center">
                  {{ history.date | dateFormat('DD MMMM YYYY  HH:mm') }}
                </td>
                <td class="text-center">
                  <router-link :to="{ name: 'purchase.order.show', params: { id: history.table_id }}">
                    {{ history.table.form.number }}
                  </router-link>
                </td>
                <td class="text-center">
                  {{ history.user.name }}
                </td>
                <td class="text-center">
                  {{ history.activity }}
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
import BreadcrumbOrder from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbOrder,
    PointTable
  },
  data () {
    return {
      number: this.$route.params.number,
      checkedRow: [],
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: null
      }
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['histories', 'pagination'])
  },
  watch: {
    date: function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.search()
    }
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('purchaseOrder', ['history']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.search()
    }, 300),
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.search()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.search()
    },
    search () {
      this.isLoading = true
      this.history({
        params: {
          sort_by: '-date',
          group_by: 'user_activity.id',
          fields: 'user_activity.*',
          filter_equal: {
            number: this.number
          },
          filter_like: {},
          limit: this.limit,
          includes: 'user;table.form;',
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    }
  }
}
</script>
