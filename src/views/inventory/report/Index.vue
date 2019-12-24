<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory/>
      <span class="breadcrumb-item active">Report</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="row">
          <div class="col-sm-4">
            <p-form-row
              id="date"
              name="date"
              :label="$t('date from')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="date-from"
                  name="date_from"
                  v-model="date_from"/>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-4">
            <p-form-row
              id="date"
              name="date"
              :label="$t('date to')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="date-to"
                  name="date_to"
                  v-model="date_to"/>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-4">
            <p-form-row
              id="warehouse"
              name="warehouse"
              :label="$t('warehouse')">
              <div slot="body" class="col-lg-9 mt-5">
                <m-warehouse id="warehouse_id" v-model="warehouseId"/>
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
              <th class="text-right">Quantity</th>
              <th class="text-right">Total Quantity</th>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td colspan="4" class="text-right"><b>Opening Balance</b></td>
              <td class="text-right">{{ openingBalanceCurrentPage | numberFormat }}</td>
            </tr>
            <tr slot="p-body" v-for="(row, index) in inventories" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.form.date | dateFormat('DD MMMM YYYY HH:mm:ss') }}</td>
              <td>{{ row.form.number }}</td>
              <td>{{ row.warehouse.name }}</td>
              <td class="text-right">{{ row.quantity | numberFormat }}</td>
              <td class="text-right">{{ row.total_quantity | numberFormat }}</td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td colspan="4" class="text-right"><b>Ending Balance</b></td>
              <td class="text-right">{{ endingBalance | numberFormat }}</td>
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
      title: 'Item',
      isLoading: false,
      isDeleting: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      warehouseId: 1,
      date_from: this.serverDate(),
      date_to: this.serverDate(),
      choosen: 'stock-history'
    }
  },
  watch: {
    'date_from' () {
      this.$router.push({ query: { search: this.searchText, dateFrom: this.date_from, dateTo: this.date_to } })
      this.currentPage = 1
      this.getInventoryRequest()
    },
    'date_to' () {
      this.$router.push({ query: { search: this.searchText, dateFrom: this.date_from, dateTo: this.date_to } })
      this.currentPage = 1
      this.getInventoryRequest()
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item']),
    ...mapGetters('inventoryInventory', ['inventories', 'pagination', 'openingBalance', 'openingBalanceCurrentPage', 'stockIn', 'stockInCurrentPage', 'stockOut', 'stockOutCurrentPage', 'endingBalance'])
  },
  methods: {
    ...mapActions('masterItem', ['find', 'delete']),
    ...mapActions('inventoryInventory', ['get']),
    onDelete () {
      this.isDeleting = true
      this.delete({ id: this.id })
        .then(response => {
          this.$notification.success('delete success')
          this.$router.replace('/master/item')
          this.isDeleting = false
        }).catch(error => {
          this.$notification.error(error.message)
          this.isDeleting = false
        })
    },
    getItemRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'account;units;groups'
        }
      }).then(response => {
        this.isLoading = false
        this.getInventoryRequest()
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
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
        itemId: this.id,
        params: {
          includes: 'form;warehouse',
          sort_by: 'forms.date',
          limit: 10,
          page: this.currentPage,
          filter_like: {
            'form.number': this.searchText,
            'warehouse.name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date_from, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date_to, 'end')
          }
        }
      }).then(response => {
        let total = this.openingBalanceCurrentPage
        this.inventories.forEach(element => {
          total += element.quantity
          element.total_quantity = total
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
    this.getItemRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
