<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <router-link
        to="/inventory/report"
        class="breadcrumb-item"
      >
        {{ $t('report') | uppercase }}
      </router-link>
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
        class="breadcrumb-item"
      >
        {{ item.label | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ warehouse.name | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="row">
          <div class="col-sm-3 text-center">
            <p-form-row
              id="date-start"
              name="date-start"
              :label="$t('date start')"
              :is-horizontal="false"
            >
              <div slot="body">
                <p-date-picker
                  id="date"
                  v-model="date.start"
                  name="date"
                  label="date"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-3 text-center">
            <p-form-row
              id="date-end"
              name="date-end"
              :label="$t('date end')"
              :is-horizontal="false"
            >
              <div slot="body">
                <p-date-picker
                  id="date"
                  v-model="date.end"
                  name="date"
                  label="date"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-3 text-center">
            <p-form-row
              id="item"
              name="item"
              :label="$t('item')"
              :is-horizontal="false"
            >
              <div slot="body">
                <span
                  class="select-link"
                  @click="$refs.item.open(index)"
                >
                  {{ item_label || $t('select') | uppercase }}
                </span>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-3 text-center">
            <p-form-row
              id="warehouse"
              name="warehouse"
              :label="$t('warehouse')"
              :is-horizontal="false"
            >
              <div slot="body">
                <span
                  class="select-link"
                  @click="$refs.warehouse.open()"
                >{{ warehouseName || $t('select') | uppercase }}</span>
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
          @input="filterSearch"
        />
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Date</th>
              <th>Form</th>
              <th>Warehouse</th>
              <th v-if="item.require_production_number">
                Production Number
              </th>
              <th v-if="item.require_expiry_date">
                Expiry Date
              </th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-right">
                Total Quantity
              </th>
            </tr>
            <tr slot="p-body">
              <th />
              <td v-if="item.require_production_number" />
              <td v-if="item.require_expiry_date" />
              <td
                colspan="4"
                class="text-right font-weight-bold"
              >
                {{ $t('opening') | uppercase }}
              </td>
              <td class="text-right font-weight-bold">
                {{ openingBalance | numberFormat }}
              </td>
            </tr>
            <tr
              v-if="parseInt($route.query.page) != 1 && inventories.length > 0"
              slot="p-body"
            >
              <th />
              <td v-if="item.require_production_number" />
              <td v-if="item.require_expiry_date" />
              <td
                colspan="4"
                class="text-right font-weight-bold"
              >
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
                    }}"
                >
                  [...]
                </router-link>
              </td>
              <td class="text-right font-weight-bold">
                {{ openingBalanceCurrentPage | numberFormat }}
              </td>
            </tr>
            <tr
              v-for="(row, index) in inventories"
              slot="p-body"
              :key="index"
            >
              <th>{{ ((parseInt($route.query.page) - 1) * limit) + index + 1 }}</th>
              <td>{{ row.form.date | dateFormat('DD MMMM YYYY HH:mm:ss') }}</td>
              <td>
                <template
                  v-if="row.form.number.toString().includes('PI')"
                >
                  <a
                    target="_blank"
                    :href="`/purchase/invoice/${row.form.formable_id}`"
                  >{{ row.form.number }}</a>
                </template>

                <template
                  v-else-if="row.form.number.toString().includes('SV')"
                >
                  {{ row.form.number }}
                </template>

                <template v-else>
                  {{ row.form.number }}
                </template>
              </td>
              <td>{{ row.warehouse.name }}</td>
              <td v-if="item.require_production_number">
                {{ row.production_number | uppercase }}
              </td>
              <td v-if="item.require_expiry_date">
                {{ row.expiry_date | dateFormat('DD MMMM YYYY') }}
              </td>
              <td class="text-right">
                {{ row.quantity | numberFormat }}
              </td>
              <td class="text-right">
                {{ row.total_quantity | numberFormat }}
              </td>
            </tr>
            <tr
              v-if="parseInt($route.query.page) != lastPage && inventories.length > 0"
              slot="p-body"
            >
              <th />
              <td v-if="item.require_production_number" />
              <td v-if="item.require_expiry_date" />
              <td
                colspan="4"
                class="text-right font-weight-bold"
              >
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
                    }}"
                >
                  [...]
                </router-link>
              </td>
              <td />
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="parseInt($route.query.page)"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-item
      ref="item"
      @choosen="chooseItem($event)"
    />
    <m-warehouse
      id="warehouse_id"
      ref="warehouse"
      @choosen="chooseWarehouse($event)"
    />
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
      limit: 999999,
      item_label: null,
      warehouseId: this.$route.params.warehouseId,
      warehouseName: null,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item']),
    ...mapGetters('masterWarehouse', ['warehouse']),
    ...mapGetters('inventoryInventoryDetail', ['inventories', 'pagination', 'openingBalance', 'openingBalanceCurrentPage', 'stockIn', 'stockOut', 'endingBalance'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.replace({
          query: {
            ...this.$route.query
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
      this.date.start = this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00')
      this.date.end = this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59')
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
      }).then(response => {
        this.item_label = response.data.label
      })
    },
    getWarehouseRequest () {
      this.findWarehouse({ id: this.warehouseId }).then(response => {
        this.warehouseName = response.data.name
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, dateFrom: this.date_from, dateTo: this.date_to } })
      this.searchText = value
      this.$route.query.page = 1
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
      this.item_label = option.label
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
      this.warehouseName = option.name
      this.getWarehouseRequest()
      this.getInventoryRequest()
    },
    async getInventoryRequest () {
      this.isLoading = true
      await this.findInventory({
        itemId: this.id,
        params: {
          includes: 'form;warehouse',
          sort_by: 'form.date',
          fields: 'inventory.*',
          searchText: this.$route.query.search,
          page: parseInt(this.$route.query.page) || 1,
          limit: 9999999,
          warehouse_id: this.warehouseId,
          filter_like: {
            'form.number': this.searchText
          }
        }
      }).then(response => {
        let total = 0
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
    }
  }
}
</script>
