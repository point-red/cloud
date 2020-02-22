<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory/>
      <span class="breadcrumb-item active">{{ $t('report') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="row">
          <div class="col-sm-3 text-center">
            <p-form-row id="date-start" name="date-start" :label="$t('date start')" :is-horizontal="false">
              <div slot="body">
                <p-date-picker
                  id="date"
                  name="date"
                  label="date"
                  v-model="date.start"/>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-3 text-center">
            <p-form-row id="date-end" name="date-end" :label="$t('date end')" :is-horizontal="false">
              <div slot="body">
                <p-date-picker
                  id="date"
                  name="date"
                  label="date"
                  v-model="date.end"/>
              </div>
            </p-form-row>
          </div>
        </div>
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          class="btn-block"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th></th>
              <th></th>
              <th></th>
              <th colspan="2" class="text-center">opening</th>
              <th colspan="2" class="text-center">in</th>
              <th colspan="2" class="text-center">out</th>
              <th colspan="2" class="text-center">ending</th>
            </tr>
            <tr slot="p-head">
              <th>#</th>
              <th>Item</th>
              <th>Account</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Value</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Value</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Value</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Value</th>
            </tr>
            <tr slot="p-body" v-for="(inventory, index) in inventories" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ inventory.label }}</td>
              <td>{{ inventory.account.label }}</td>
              <td class="text-right">{{ inventory.opening_balance | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
              <td class="text-right">{{ inventory.stock_in | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
              <td class="text-right">{{ inventory.stock_out | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
              <td class="text-right">{{ inventory.ending_balance | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  watch: {
    'date': {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getInventoryRequest()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('inventoryInventory', ['inventories', 'pagination'])
  },
  methods: {
    ...mapActions('inventoryInventory', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, dateFrom: this.date_from, dateTo: this.date_to } })
      this.searchText = value
      this.currentPage = 1
      this.getInventoryRequest()
    }, 300),
    getInventoryRequest () {
      this.isLoading = true
      this.get({
        params: {
          includes: 'account',
          sort_by: 'code,name',
          limit: 10,
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
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getInventoryRequest()
    }
  },
  created () {
    this.getInventoryRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
