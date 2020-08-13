<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <span class="breadcrumb-item active">{{ $t('sales order') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create sales order')"
            to="/sales/order/create"
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
        <div class="text-center font-size-sm">
          <a
            href="javascript:void(0)"
            @click="isAdvanceFilter = !isAdvanceFilter"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card m-5 pt-10"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
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
                id="form-approval-status"
                name="form-approval-status"
                :label="$t('approval status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.formApprovalStatus.open()"
                  >
                    {{ formApprovalStatus.label || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-3 text-center">
              <p-form-row
                id="form-status"
                name="form-status"
                :label="$t('form status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.formStatus.open()"
                  >
                    {{ formStatus.label || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
          </div>
          <hr>
        </div>
        <div class="mt-10">
          <!-- <label class="css-control css-control-primary css-checkbox mr-10">
            <input
              type="checkbox"
              class="css-control-input"
              @click="toggleCheckRows()"
              :checked="isRowsChecked(salesOrders, checkedRow)">
            <span class="css-control-indicator"></span>
          </label> -->
          <span
            v-show="checkedRow.length > 0"
            class="mr-15 animated fadeIn"
          >
            <!-- <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkCancel()">
              {{ $t('request approval') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkApprove()">
              {{ $t('approve') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkReject()">
              {{ $t('reject') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="bulkCancel()">
              {{ $t('archive') | uppercase }}
            </button> -->
          </span>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Item</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-right">
                Price
              </th>
              <th class="text-right">
                Amount
              </th>
              <th class="text-center">
                Approval Status
              </th>
              <th class="text-center">
                Form Status
              </th>
              <th width="50px" />
            </tr>
            <template v-for="(salesOrder, index) in salesOrders">
              <tr
                v-for="(salesOrderItem, index2) in salesOrder.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.order.show', params: { id: salesOrder.id }}">
                    {{ salesOrder.form.number }}
                  </router-link>
                </th>
                <td>{{ salesOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="salesOrder.customer">
                    {{ salesOrder.customer.name }}
                  </template>
                </td>
                <td>{{ salesOrderItem.item.name }}</td>
                <td class="text-right">
                  {{ salesOrderItem.quantity | numberFormat }} {{ salesOrderItem.unit }}
                </td>
                <td class="text-right">
                  {{ salesOrderItem.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ (salesOrderItem.quantity * salesOrderItem.price) | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="salesOrder.form.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="salesOrder.form.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="salesOrder.form.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <div
                    v-if="salesOrder.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="salesOrder.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="salesOrder.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td>
                <!-- <p-form-check-box
                  :is-form="false"
                  id="check-box"
                  name="check-box"
                  @click.native="toggleCheckRow(salesOrder.id)"
                  :checked="isRowChecked(salesOrder.id)"
                  class="text-center"/> -->
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
    <m-form-approval-status
      ref="formApprovalStatus"
      @choosen="chooseFormApprovalStatus($event)"
    />
    <m-form-status
      ref="formStatus"
      @choosen="chooseFormStatus($event)"
    />
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
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      isAdvanceFilter: false,
      checkedRow: [],
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: null
      },
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('salesOrder', ['salesOrders', 'pagination'])
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
        this.getSalesOrder()
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
    this.getSalesOrder()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesOrder', ['get']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.salesOrders, this.checkedRow)) {
        this.salesOrders.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.salesOrders.forEach(element => {
          this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    isRowChecked (id) {
      return this.checkedRow.some(element => {
        return element.id == id
      })
    },
    isRowsChecked (haystack, needles) {
      if (needles.length == 0) {
        return false
      }
      for (let i = 0; i < haystack.length; i++) {
        const found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    },
    bulkApprove () {
      this.bulkApprove({
        salesOrders: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getSalesOrder()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getSalesOrder()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getSalesOrder()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getSalesOrder()
    }, 300),
    getSalesOrder () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,customer,items,item',
          fields: 'sales_order.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText,
            'item.code': this.searchText,
            'item.name': this.searchText,
            'sales_order_item.notes': this.searchText,
            'sales_order_item.quantity': this.searchText,
            'sales_order_item.price': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          },
          limit: 10,
          includes: 'form;customer;items.item;items.allocation',
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
      this.getSalesOrder()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
