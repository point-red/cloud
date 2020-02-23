<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory/>
      <router-link to="/inventory/report" class="breadcrumb-item">{{ $t('report') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ item.label | uppercase }}</span>
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
          <div class="col-sm-3 text-center">
            <p-form-row id="item" name="item" :label="$t('item')" :is-horizontal="false">
              <div slot="body">
                <m-item
                  :id="'item'"
                  v-model="item.id"
                  @choosen="chooseItem($event)"/>
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
              <th style="border: 1px solid #e4e7ed" colspan="2" class="text-center">opening</th>
              <th style="border: 1px solid #e4e7ed" colspan="2" class="text-center">in</th>
              <th style="border: 1px solid #e4e7ed" colspan="2" class="text-center">out</th>
              <th style="border: 1px solid #e4e7ed" colspan="2" class="text-center">ending</th>
            </tr>
            <tr slot="p-head">
              <th>#</th>
              <th>Warehouse</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
            </tr>
            <tr slot="p-body" v-for="(inventory, index) in warehouses" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link
                  :to="{
                    name: 'inventory.report.detail',
                    params: {
                      id: id,
                      warehouseId: inventory.id
                    },
                    query: {
                      date_from: date.start,
                      date_to: date.end
                    }}">
                  {{ inventory.name }}
                </router-link>
              </td>
              <td class="text-right">{{ inventory.opening_balance | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
              <td class="text-right">{{ inventory.stock_in | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
              <td class="text-right">{{ inventory.stock_out | numberFormat }}</td>
              <td class="text-right">{{ 0 | numberFormat }}</td>
              <td class="text-right">{{ inventory.ending_balance | numberFormat }}</td>
              <td class="text-right">{{ 0 }}</td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td class="text-right font-weight-bold" colspan="7">{{ $t('total') | uppercase }}</td>
              <td class="text-right font-weight-bold">{{ total | numberFormat }}</td>
              <td class="text-right font-weight-bold">{{ 0 }}</td>
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
      total: 0,
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
    ...mapGetters('masterItem', ['item']),
    ...mapGetters('inventoryInventory', ['warehouses', 'pagination'])
  },
  methods: {
    ...mapActions('masterItem', ['find']),
    ...mapActions('inventoryInventory', {
      get: 'getWarehouse'
    }),
    chooseItem (option) {
      this.$router.push({
        params: { id: option.id },
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.find({
        id: option.id
      })
      this.id = option.id
      this.getInventoryRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, dateFrom: this.date_from, dateTo: this.date_to } })
      this.searchText = value
      this.currentPage = 1
      this.getInventoryRequest()
    }, 300),
    getInventoryRequest () {
      this.isLoading = true
      this.get({
        id: this.id,
        params: {
          item_id: this.id,
          sort_by: 'name',
          limit: 10,
          page: this.currentPage,
          date_from: this.date.start,
          date_to: this.date.end,
          filter_like: {
            'code': this.searchText,
            'name': this.searchText
          }
        }
      }).then(response => {
        this.total = 0
        this.warehouses.forEach(element => {
          this.total += parseFloat(element.ending_balance)
        })
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
    this.find({
      id: this.id
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
