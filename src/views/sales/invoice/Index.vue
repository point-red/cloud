<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <span class="breadcrumb-item active">{{ $t('sales invoice') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <download-excel
            :name="`Sales Invoice_${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`"
            :fetch="generateReport"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create sales invoice')"
            to="/sales/invoice/create"
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
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Notes</th>
              <th>Item</th>
              <th>Allocation</th>
              <th class="text-right">
                Quantity
              </th>
              <th>Price</th>
              <th>Value</th>
              <th>Approval</th>
              <th class="text-center">
                Form Status
              </th>
              <th width="50px" />
            </tr>
            <template v-for="(invoice, index) in invoices">
              <tr
                v-for="(invoiceItem, index2) in invoice.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.invoice.show', params: { id: invoice.id }}">
                    {{ invoice.form.number }}
                  </router-link>
                </th>
                <td>{{ invoice.form.date | dateFormat('DD MMMM YYYY') }}</td>
                <td>
                  <template v-if="invoice.customer">
                    {{ invoice.customer.name }}
                  </template>
                </td>
                <td class="text-break">
                  {{ invoice.form.notes }}
                </td>
                <td>{{ invoiceItem.itemName }}</td>
                <td>{{ invoiceItem.allocation && invoiceItem.allocation.name }}</td>
                <td class="text-right">
                  {{ invoiceItem.quantity | numberFormat }} {{ invoiceItem.unit }}
                </td>
                <td>
                  {{ invoiceItem.price | numberFormat }}
                </td>
                <td>
                  {{ invoiceItem.quantity * invoiceItem.price | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="invoice.form.approvalStatus == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="invoice.form.approvalStatus == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="invoice.form.approvalStatus == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <div
                    v-if="invoice.form.cancellationStatus == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="invoice.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="invoice.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td />
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
        <m-form-approval-status
          ref="formApprovalStatus"
          @choosen="chooseFormApprovalStatus($event)"
        />
        <m-form-status
          ref="formStatus"
          @choosen="chooseFormStatus($event)"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import JsonExcel from 'vue-json-excel'
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import axiosNode from '@/axiosNode'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    PointTable,
    DownloadExcel: JsonExcel
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
      },
      approvalStatusses: {
        0: 'pending',
        1: 'approved',
        '-1': 'reject'
      }
    }
  },
  computed: {
    ...mapGetters('salesInvoice', ['invoices', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            page: 1,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.currentPage = 1
        this.getInvoices()
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
    this.getInvoices()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesInvoice', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getInvoices()
    }, 300),
    chooseFormStatus: debounce(function (option) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1
        }
      })
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.currentPage = 1
      this.getInvoices()
    }),
    chooseFormApprovalStatus: debounce(function (option) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1
        }
      })
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.currentPage = 1
      this.getInvoices()
    }),
    getInvoices () {
      this.isLoading = true
      const formStatus = this.formStatus.value ? this.formStatus.value.split(';')[1] || null : null
      const formApprovalStatus = this.formApprovalStatus.value || null
      this.get({
        params: {
          filter_form: formStatus + ';' + formApprovalStatus,
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'customer.name': this.searchText,
            'items.item_name': this.searchText,
            'items.allocation.name': this.searchText
          },
          filter_date_min: this.serverDateTime(this.date.start, 'start'),
          filter_date_max: this.serverDateTime(this.date.end, 'end'),
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
      this.getInvoices()
    },
    async generateReport () {
      this.isLoading = true
      try {
        const formStatus = this.formStatus.value ? this.formStatus.value.split(';')[1] || null : null
        const formApprovalStatus = this.formApprovalStatus.value || null
        const { data: { data: salesInvoices } } = await axiosNode.get('/sales/invoices', {
          params: {
            filter_form: formStatus + ';' + formApprovalStatus,
            filter_like: {
              'form.number': this.searchText,
              'form.notes': this.searchText,
              'customer.name': this.searchText,
              'items.item_name': this.searchText,
              'items.allocation.name': this.searchText
            },
            filter_date_min: this.serverDateTime(this.date.start, 'start'),
            filter_date_max: this.serverDateTime(this.date.end, 'end'),
            limit: 10000,
            page: 1
          }
        })

        let indexItem = 0
        const dataResult = salesInvoices.map((salesInvoice) => {
          const subTotal = this.getSubTotal(salesInvoice.items)

          let formStatus = ''
          if (salesInvoice.form.cancellationStatus == 1) {
            formStatus = 'cancelled'
          } else if (salesInvoice.form.done == 0) {
            formStatus = 'pending'
          } else if (salesInvoice.form.done == 1) {
            formStatus = 'done'
          }

          return salesInvoice.items.map((item) => {
            indexItem++

            return {
              No: indexItem,
              'Form Number': salesInvoice.form.number,
              'Invoice Date': this.$options.filters.dateFormat(salesInvoice.form.date, 'DD/MM/YYYY'),
              Customer: salesInvoice.customer && salesInvoice.customer.name,
              Item: item.itemName,
              Allocation: item.allocation && item.allocation.name,
              Quantity: item.quantity,
              Unit: item.unit,
              Price: item.price,
              'Discount Item': item.discountValue,
              'Sub Total': subTotal,
              Discount: salesInvoice.discountValue,
              'Tax Method': salesInvoice.typeOfTax,
              Tax: salesInvoice.tax,
              Total: salesInvoice.amount,
              'Created at': this.$options.filters.dateFormat(salesInvoice.form.createdAt, 'DD/mm/YYYY HH:mm:ss'),
              'Created by': salesInvoice.form.createdByUser && salesInvoice.form.createdByUser.name,
              'Approved by': salesInvoice.form.approvalByUser && salesInvoice.form.approvalByUser.name,
              'Approval status': this.approvalStatusses[salesInvoice.form.approvalStatus],
              'Form status': formStatus
            }
          })
        })

        this.isLoading = false
        return dataResult.flat()
      } catch (error) {
        console.log(error)
        this.isLoading = false
        return this.$notification.error(error.message)
      }
    },
    getSubTotal (items) {
      const subTotal = items.reduce((result, item) => {
        return result + this.getItemsPrice(item)
      }, 0)

      return subTotal
    },
    getItemsPrice (item) {
      let perItemPrice = item.price
      if (item.discountValue > 0) {
        perItemPrice -= item.discountValue
      }
      if (item.discountPercent > 0) {
        const discountPercent = item.discountPercent / 100
        perItemPrice -= perItemPrice * discountPercent
      }
      const totalItemPrice = perItemPrice * item.quantity

      return totalItemPrice
    }
  }
}
</script>

<style>
.text-break {
  word-break: break-word;
}
</style>
