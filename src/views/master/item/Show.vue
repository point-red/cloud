<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/item"
        class="breadcrumb-item">Item</router-link>
      <span class="breadcrumb-item active">{{ item.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :header="true">
        <router-link
          to="/master/item/create"
          v-if="$permission.has('create item')"
          slot="header"
          exact
          class="btn btn-outline-secondary btn-sm mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="code"
            :label="$t('code')"
            name="code"
            v-model="item.code"
            readonly/>

          <p-form-row
            id="name"
            :label="$t('name')"
            name="name"
            v-model="item.name"
            readonly/>

          <p-form-row
            id="chart-of-account"
            :label="$t('chart of account')"
            name="chart-of-account"
            v-model="item.account.alias"
            readonly/>

          <p-form-row
            id="unit"
            :label="$t('unit')"
            name="unit"
            v-model="item.units[0].label"
            readonly/>

          <p-form-row
            id="group"
            :label="$t('group')"
            name="group"
            readonly>
            <div slot="body" class="col-lg-9">
              <table class="table">
                <thead></thead>
                <tbody>
                  <template v-for="(group, index) in item.groups">
                    <tr :key="index">
                      <td>{{ group.name }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </p-form-row>

          <p-form-row
            id="stock"
            :label="$t('stock')"
            name="stock"
            readonly>
            <div slot="body" class="col-lg-9">
              <p-form-number
                id="stock"
                label="Stock"
                name="stock"
                v-model="item.stock"
                :is-text-right="false"
                readonly/>
            </div>
          </p-form-row>

          <hr>

          <router-link
            :to="{ path: '/master/item/' + item.id + '/edit', params: { id: item.id }}"
            v-if="$permission.has('update item')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete item')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
          </button>
        </p-block-inner>
      </p-block>
    </div>

    <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link" @click="choose('master')" :class="{'active': choosen == 'stock-history'}">{{ $t('stock history') | uppercase }}</a>
      </li>
    </ul>

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
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
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
