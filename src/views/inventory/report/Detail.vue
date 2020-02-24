<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory/>
      <router-link to="/inventory/report" class="breadcrumb-item">{{ $t('report') | uppercase }}</router-link>
      <router-link
        :to="{
          name: 'inventory.report.show',
          params: {
            id: id
          },
          query: {
            date_from: date.start,
            date_to: date.end
          }}"
        class="breadcrumb-item">{{ item.label | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ warehouse.name | uppercase }}</span>
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
                <m-item id="item" v-model="item.id" @choosen="chooseItem($event)"/>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-3 text-center">
            <p-form-row
              id="warehouse"
              name="warehouse"
              :label="$t('warehouse')"
              :is-horizontal="false">
              <div slot="body">
                <m-warehouse id="warehouse_id" v-model="warehouseId" @choosen="chooseWarehouse($event)"/>
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
              <th>#</th>
              <th>Date</th>
              <th>Form</th>
              <th>Warehouse</th>
              <th v-if="item.require_production_number">Production Number</th>
              <th v-if="item.require_expiry_date">Expiry Date</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Total Quantity</th>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td v-if="item.require_production_number"></td>
              <td v-if="item.require_expiry_date"></td>
              <td colspan="4" class="text-right font-weight-bold">{{ $t('opening') | uppercase }}</td>
              <td class="text-right font-weight-bold">{{ openingBalance | numberFormat }}</td>
            </tr>
            <tr slot="p-body" v-if="parseInt($route.query.page) != 1 && inventories.length > 0">
              <th></th>
              <td v-if="item.require_production_number"></td>
              <td v-if="item.require_expiry_date"></td>
              <td colspan="4" class="text-right font-weight-bold">
                <router-link
                  :to="{
                    name: 'inventory.report.detail',
                    params: {
                      id: id,
                      warehouseId: warehouseId
                    },
                    query: {
                      date_from: date.start,
                      date_to: date.end,
                      page: $route.query.page - 1
                    }}">[...]</router-link>
              </td>
              <td class="text-right font-weight-bold">{{ openingBalanceCurrentPage | numberFormat }}</td>
            </tr>
            <tr slot="p-body" v-for="(row, index) in inventories" :key="index">
              <th>{{ ((parseInt($route.query.page) - 1) * limit) + index + 1 }}</th>
              <td>{{ row.form.date | dateFormat('DD MMMM YYYY HH:mm:ss') }}</td>
              <td>{{ row.form.number }}</td>
              <td>{{ row.warehouse.name }}</td>
              <td v-if="item.require_production_number">{{ row.production_number | uppercase }}</td>
              <td v-if="item.require_expiry_date">{{ row.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
              <td class="text-right">{{ row.quantity | numberFormat }}</td>
              <td class="text-right">{{ row.total_quantity | numberFormat }}</td>
            </tr>
            <tr slot="p-body" v-if="parseInt($route.query.page) != lastPage && inventories.length > 0">
              <th></th>
              <td v-if="item.require_production_number"></td>
              <td v-if="item.require_expiry_date"></td>
              <td colspan="4" class="text-right font-weight-bold">
                <router-link
                  :to="{
                    name: 'inventory.report.detail',
                    params: {
                      id: id,
                      warehouseId: warehouseId
                    },
                    query: {
                      date_from: date.start,
                      date_to: date.end,
                      page: parseInt($route.query.page) + 1
                    }}">[...]</router-link>
              </td>
              <td></td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td v-if="item.require_production_number"></td>
              <td v-if="item.require_expiry_date"></td>
              <td colspan="4" class="text-right font-weight-bold">{{ $t('ending') | uppercase }}</td>
              <td class="text-right font-weight-bold">{{ endingBalance | numberFormat }}</td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="parseInt(this.$route.query.page)"
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
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      warehouseId: this.$route.params.warehouseId,
      warehouseName: null,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  watch: {
    'date': {
      handler: function () {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: 1,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getInventoryRequest()
      },
      deep: true
    },
    $route (to, from) {
      if (to.params.warehouseId != from.params.warehouseId || to.params.id != from.params.id) {
        this.$route.query.page = 1
      }
      this.id = parseInt(this.$route.params.id)
      this.warehouseId = parseInt(this.$route.params.warehouseId)
      this.date_from = this.$route.query.date_from
      this.date_to = this.$route.query.date_to
      this.getInventoryRequest()
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item']),
    ...mapGetters('masterWarehouse', ['warehouse']),
    ...mapGetters('inventoryInventoryDetail', ['inventories', 'pagination', 'openingBalance', 'openingBalanceCurrentPage', 'stockIn', 'stockOut', 'endingBalance'])
  },
  methods: {
    ...mapActions('masterItem', ['find', 'delete']),
    ...mapActions('inventoryInventoryDetail', {
      findInventory: 'find'
    }),
    ...mapActions('masterWarehouse', {
      findWarehouse: 'find'
    }),
    getItemRequest () {
      this.find({
        id: this.id,
        params: {
          includes: 'account;units;groups'
        }
      })
    },
    getWarehouseRequest () {
      this.findWarehouse({ id: this.warehouseId })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, dateFrom: this.date_from, dateTo: this.date_to } })
      this.searchText = value
      this.$route.query.page = 1
      this.getInventoryRequest()
    }, 300),
    chooseItem (option) {
      this.$router.replace({
        params: {
          id: option.id,
          warehouseId: this.warehouseId
        },
        query: {
          ...this.$route.query,
          page: 1,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.id = option.id
      this.find({ id: option.id })
      this.getInventoryRequest()
    },
    chooseWarehouse (option) {
      this.$router.replace({
        params: {
          id: this.id,
          warehouseId: option.id
        },
        query: {
          ...this.$route.query,
          page: 1,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.warehouseId = option.id
      this.findWarehouse({ id: option.id })
      this.getInventoryRequest()
    },
    getInventoryRequest () {
      this.isLoading = true
      this.findInventory({
        itemId: this.id,
        params: {
          includes: 'form;warehouse',
          sort_by: 'forms.date',
          searchText: this.$route.query.search,
          page: parseInt(this.$route.query.page) || 1,
          limit: this.limit,
          warehouse_id: this.warehouseId,
          date_from: this.date.start,
          date_to: this.date.end,
          filter_like: {
            'form.number': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          }
        }
      }).then(response => {
        let total = this.openingBalanceCurrentPage
        this.inventories.forEach(element => {
          total += element.quantity
          element.total_quantity = total
        })
        this.lastPage = this.pagination.last_page
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.$route.query.page = value
      this.getInventoryRequest()
    }
  },
  created () {
    this.warehouseId = this.$route.params.warehouseId
    this.id = this.$route.params.id
    if (!this.$route.query.page) {
      this.$route.query.page = 1
    }
    this.getItemRequest()
    this.getWarehouseRequest()
    this.getInventoryRequest()
  }
}
</script>
