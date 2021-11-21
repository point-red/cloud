<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <span class="breadcrumb-item active">{{ $t('sales order') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div class="mt-2">
      <h2 class="mb-0">
        Dashboard Penjualan Berdasarkan Item
      </h2>
      <div class="row">
        <div class="col-md-6">
          <point-table>
            <tr slot="p-head">
              <th>Product</th>
              <th>Total</th>
            </tr>
            <template v-for="(reportItemKey, index) in Object.keys(reportItem)">
              <tr
                :key="`product-item-${index}`"
                slot="p-body"
              >
                <td>{{ reportItem[reportItemKey].name }}</td>
                <td>{{ reportItem[reportItemKey].total | numberFormat }}</td>
              </tr>
            </template>
          </point-table>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-secondary btn-sm"
              @click="showItemFilter = !showItemFilter"
            >
              {{ showItemFilter ? 'Show Chart' : 'Filter' }}
            </button>
          </div>
          <line-chart
            v-show="!showItemFilter"
            ref="linechart-item"
            :chart-title="'penjualan berdasarkan item' | uppercase"
            :chart-label="itemReportLabels"
            :chart-data="itemReportValues"
            line-color="#409ce8"
          />
          <div
            v-show="showItemFilter"
            style="height: 394px"
          >
            <div class="row bg-white p-3 m-2 card">
              <div class="col-xl-6 d-flex flex-column justify-content-around">
                <p-form-row
                  id="item-date-start"
                  name="item-date-start"
                  :label="$t('date start')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="itemFilter.dateStart"
                      name="item-date-start-input"
                      label="Date Start"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="item-date-end"
                  name="item-date-end"
                  :label="$t('date end')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="itemFilter.dateEnd"
                      name="item-date-end-input"
                      label="Date End"
                    />
                  </div>
                </p-form-row>
              </div>

              <div class="col-xl-6">
                <p-form-row
                  id="item-date-end"
                  name="item-date-end"
                  :label="'Filter by Item'"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <button
                      class="d-block mb-2 btn-link"
                      @click="$refs['first-item'].open()"
                    >
                      {{ itemFilter.item.firstItem ? itemFilter.item.firstItem.label : 'Select Item' }}
                    </button>
                    <m-item
                      ref="first-item"
                      :create-button="false"
                      @choosen="(option) => chooseItem('firstItem', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['second-item'].open()"
                    >
                      {{ itemFilter.item.secondItem ? itemFilter.item.secondItem.label : 'Select Item' }}
                    </button>
                    <m-item
                      ref="second-item"
                      :create-button="false"
                      @choosen="(option) => chooseItem('secondItem', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['third-item'].open()"
                    >
                      {{ itemFilter.item.thirdItem ? itemFilter.item.thirdItem.label : 'Select Item' }}
                    </button>
                    <m-item
                      ref="third-item"
                      :create-button="false"
                      @choosen="(option) => chooseItem('thirdItem', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['fourth-item'].open()"
                    >
                      {{ itemFilter.item.fourthItem ? itemFilter.item.fourthItem.label : 'Select Item' }}
                    </button>
                    <m-item
                      ref="fourth-item"
                      :create-button="false"
                      @choosen="(option) => chooseItem('fourthItem', option)"
                    />
                    <button
                      class="d-block mt-2 btn-link"
                      @click="$refs['fifth-item'].open()"
                    >
                      {{ itemFilter.item.fifthItem ? itemFilter.item.fifthItem.label : 'Select Item' }}
                    </button>
                    <m-item
                      ref="fifth-item"
                      :create-button="false"
                      @choosen="(option) => chooseItem('fifthItem', option)"
                    />
                  </div>
                </p-form-row>
              </div>

              <button
                class="btn btn-secondary btn-sm"
                @click="getReportByItem"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2">
      <h2 class="mb-0">
        Dashboard Penjualan Berdasarkan Customer
      </h2>
      <div class="row">
        <div class="col-md-6">
          <point-table>
            <tr slot="p-head">
              <th>Customer</th>
              <th>Total</th>
            </tr>
            <template v-for="(reportCustomerKey, index) in Object.keys(reportCustomer)">
              <tr
                :key="`product-item-${index}`"
                slot="p-body"
              >
                <td>{{ reportCustomer[reportCustomerKey].name }}</td>
                <td>{{ reportCustomer[reportCustomerKey].total | numberFormat }}</td>
              </tr>
            </template>
          </point-table>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-secondary btn-sm"
              @click="showCustomerFilter = !showCustomerFilter"
            >
              {{ showCustomerFilter ? 'Show Chart' : 'Filter' }}
            </button>
          </div>
          <line-chart
            v-show="!showCustomerFilter"
            ref="linechart-customer"
            :chart-title="'penjualan berdasarkan customer' | uppercase"
            :chart-label="customerReportLabels"
            :chart-data="customerReportValues"
            line-color="#409ce8"
          />
          <div
            v-show="showCustomerFilter"
            style="height: 394px"
          >
            <div class="row bg-white p-3 m-2 card">
              <div class="col-xl-6 d-flex flex-column justify-content-around">
                <p-form-row
                  id="customer-date-start"
                  name="customer-date-start"
                  :label="$t('date start')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="customerFilter.dateStart"
                      name="customer-date-start-input"
                      label="Date Start"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="customer-date-end"
                  name="customer-date-end"
                  :label="$t('date end')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="customerFilter.dateEnd"
                      name="customer-date-end-input"
                      label="Date End"
                    />
                  </div>
                </p-form-row>
              </div>

              <div class="col-xl-6">
                <p-form-row
                  id="item-date-end"
                  name="item-date-end"
                  :label="'Filter by Item'"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <button
                      class="d-block mb-2 btn-link"
                      @click="$refs['first-customer'].open()"
                    >
                      {{ customerFilter.customer.firstCustomer ? customerFilter.customer.firstCustomer.name : 'Select Customer' }}
                    </button>
                    <m-customer
                      ref="first-customer"
                      :create-button="false"
                      @choosen="(option) => chooseCustomer('firstCustomer', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['second-customer'].open()"
                    >
                      {{ customerFilter.customer.secondCustomer ? customerFilter.customer.secondCustomer.name : 'Select Customer' }}
                    </button>
                    <m-customer
                      ref="second-customer"
                      :create-button="false"
                      @choosen="(option) => chooseCustomer('secondCustomer', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['third-customer'].open()"
                    >
                      {{ customerFilter.customer.thirdCustomer? customerFilter.customer.thirdCustomer.name : 'Select Customer' }}
                    </button>
                    <m-customer
                      ref="third-customer"
                      :create-button="false"
                      @choosen="(option) => chooseCustomer('thirdCustomer', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['fourth-customer'].open()"
                    >
                      {{ customerFilter.customer.fourthCustomer ? customerFilter.customer.fourthCustomer.name : 'Select Customer' }}
                    </button>
                    <m-customer
                      ref="fourth-customer"
                      :create-button="false"
                      @choosen="(option) => chooseCustomer('fourthCustomer', option)"
                    />
                    <button
                      class="d-block mt-2 btn-link"
                      @click="$refs['fifth-customer'].open()"
                    >
                      {{ customerFilter.customer.fifthCustomer? customerFilter.customer.fifthCustomer.name : 'Select Customer' }}
                    </button>
                    <m-customer
                      ref="fifth-customer"
                      :create-button="false"
                      @choosen="(option) => chooseCustomer('fifthCustomer', option)"
                    />
                  </div>
                </p-form-row>
              </div>

              <button
                class="btn btn-secondary btn-sm"
                @click="getReportByCustomer"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2">
      <h2 class="mb-0">
        Dashboard Penjualan Berdasarkan Allocation
      </h2>
      <div class="row">
        <div class="col-md-6">
          <point-table>
            <tr slot="p-head">
              <th>Allocation</th>
              <th>Total</th>
            </tr>
            <template v-for="(reportAllocationKey, index) in Object.keys(reportAllocation)">
              <tr
                :key="`allocation-item-${index}`"
                slot="p-body"
              >
                <td>{{ reportAllocation[reportAllocationKey].name }}</td>
                <td>{{ reportAllocation[reportAllocationKey].total | numberFormat }}</td>
              </tr>
            </template>
          </point-table>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-secondary btn-sm"
              @click="showAllocationFilter = !showAllocationFilter"
            >
              {{ showAllocationFilter ? 'Show Chart' : 'Filter' }}
            </button>
          </div>
          <line-chart
            v-show="!showAllocationFilter"
            ref="linechart-allocation"
            :chart-title="'penjualan berdasarkan allocation' | uppercase"
            :chart-label="allocationReportLabels"
            :chart-data="allocationReportValues"
            line-color="#409ce8"
          />
          <div
            v-show="showAllocationFilter"
            style="height: 394px"
          >
            <div class="row bg-white p-3 m-2 card">
              <div class="col-xl-6 d-flex flex-column justify-content-around">
                <p-form-row
                  id="alloocation-date-start"
                  name="alloocation-date-start"
                  :label="$t('date start')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="allocationFilter.dateStart"
                      name="alloocation-date-start-input"
                      label="Date Start"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="alloocation-date-end"
                  name="alloocation-date-end"
                  :label="$t('date end')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="allocationFilter.dateEnd"
                      name="alloocation-date-end-input"
                      label="Date End"
                    />
                  </div>
                </p-form-row>
              </div>

              <div class="col-xl-6">
                <p-form-row
                  id="item-date-end"
                  name="item-date-end"
                  :label="'Filter by Item'"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <button
                      class="d-block mb-2 btn-link"
                      @click="$refs['first-allocation'].open()"
                    >
                      {{ allocationFilter.allocation.firstAllocation ? allocationFilter.allocation.firstAllocation.name : 'Select Allocation' }}
                    </button>
                    <m-allocation
                      ref="first-allocation"
                      :create-button="false"
                      @choosen="(option) => chooseAllocation('firstAllocation', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['second-allocation'].open()"
                    >
                      {{ allocationFilter.allocation.secondAllocation ? allocationFilter.allocation.secondAllocation.name : 'Select Allocation' }}
                    </button>
                    <m-allocation
                      ref="second-allocation"
                      :create-button="false"
                      @choosen="(option) => chooseAllocation('secondAllocation', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['third-allocation'].open()"
                    >
                      {{ allocationFilter.allocation.thirdAllocation? allocationFilter.allocation.thirdAllocation.name : 'Select Allocation' }}
                    </button>
                    <m-allocation
                      ref="third-allocation"
                      :create-button="false"
                      @choosen="(option) => chooseAllocation('thirdAllocation', option)"
                    />
                    <button
                      class="d-block my-2 btn-link"
                      @click="$refs['fourth-allocation'].open()"
                    >
                      {{ allocationFilter.allocation.fourthAllocation ? allocationFilter.allocation.fourthAllocation.name : 'Select Allocation' }}
                    </button>
                    <m-allocation
                      ref="fourth-allocation"
                      :create-button="false"
                      @choosen="(option) => chooseAllocation('fourthAllocation', option)"
                    />
                    <button
                      class="d-block mt-2 btn-link"
                      @click="$refs['fifth-allocation'].open()"
                    >
                      {{ allocationFilter.allocation.fifthAllocation? allocationFilter.allocation.fifthAllocation.name : 'Select Allocation' }}
                    </button>
                    <m-allocation
                      ref="fifth-allocation"
                      :create-button="false"
                      @choosen="(option) => chooseAllocation('fifthAllocation', option)"
                    />
                  </div>
                </p-form-row>
              </div>

              <button
                class="btn btn-secondary btn-sm"
                @click="getReportByAllocation"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PointTable from 'point-table-vue'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import axiosNode from '@/axiosNode'
import SalesMenu from '../Menu'
import LineChart from '@/components/point-chart/LineChart'
import uniq from 'lodash/uniq'

export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    PointTable,
    LineChart
  },
  data () {
    return {
      itemSalesInvoices: [],
      reportItem: {},
      itemReportLabels: [],
      itemReportValues: [],
      showItemFilter: false,
      itemFilter: {
        dateStart: '',
        dateEnd: '',
        item: {
          firstItem: null,
          secondItem: null,
          thirdItem: null,
          fourthItem: null,
          fifthItem: null
        }
      },
      customerSalesInvoices: [],
      reportCustomer: {},
      customerReportLabels: [],
      customerReportValues: [],
      showCustomerFilter: false,
      customerFilter: {
        dateStart: '',
        dateEnd: '',
        customer: {
          firstCustomer: null,
          secondCustomer: null,
          thirdCustomer: null,
          fourthCustomer: null,
          fifthCustomer: null
        }
      },
      allocationSalesInvoices: [],
      reportAllocation: {},
      allocationReportLabels: [],
      allocationReportValues: [],
      showAllocationFilter: false,
      allocationFilter: {
        dateStart: '',
        dateEnd: '',
        allocation: {
          firstAllocation: null,
          secondAllocation: null,
          thirdAllocation: null,
          fourthAllocation: null,
          fifthAllocation: null
        }
      }
    }
  },
  created () {
    this.getReportByItem()
    this.getReportByCustomer()
    this.getReportByAllocation()
  },
  methods: {
    async getReportByItem () {
      const selectedItem = Object.keys(this.itemFilter.item).map((key) => {
        if (this.itemFilter.item[key]) {
          return this.itemFilter.item[key].id
        }
      })
      const endpoint = `/sales/invoices/report?filter_date_min=${this.itemFilter.dateStart}&filter_date_max=${this.itemFilter.dateEnd}&selected_item=${uniq(selectedItem).join(',')}`
      const {
        data: {
          data: itemSalesInvoices,
          meta: {
            filter: { min_date: minDate, max_date: maxDate }
          }
        }
      } = await axiosNode.get(endpoint)
      this.itemSalesInvoices = itemSalesInvoices
      this.itemFilter.dateStart = minDate
      this.itemFilter.dateEnd = maxDate

      this.generateReportByItem()
    },
    generateReportByItem () {
      const reportItem = {}

      // create object that the object keys represent customer
      this.itemSalesInvoices.forEach((salesInvoice) => {
        salesInvoice.items.forEach((salesInvoiceItem) => {
          if (!reportItem[`item_${salesInvoiceItem.itemId}`]) {
            reportItem[`item_${salesInvoiceItem.itemId}`] = {
              items: [],
              name: salesInvoiceItem.itemName,
              total: 0
            }
          }

          reportItem[`item_${salesInvoiceItem.itemId}`].items.push(salesInvoiceItem)
        })
      })

      // convert object to array for easier data processing
      const arrayReportItem = Object.keys(reportItem).map((key) => {
        return reportItem[key]
      })

      // get total sales for each customer
      arrayReportItem.forEach((reportItemItem) => {
        let total = 0
        reportItemItem.items.forEach((item) => {
          let discount = 0
          if (parseFloat(item.discountValue) !== 0) {
            discount = parseFloat(item.discountValue)
          } else if (parseFloat(item.discountPercent) !== 0) {
            discount = item.price * parseFloat(item.discountPercent) / 100
          }

          total += ((parseFloat(item.price) - discount) * parseFloat(item.quantity))
        })
        reportItemItem.total = total
      })

      // sort descending item by total sales
      arrayReportItem.sort((a, b) => {
        return b.total - a.total
      })

      this.reportItem = arrayReportItem
      this.itemReportLabels = arrayReportItem.map((item) => item.name)
      this.itemReportValues = arrayReportItem.map((item) => item.total)
      this.showItemFilter = false
    },
    async getReportByCustomer () {
      const selectedCustomer = Object.keys(this.customerFilter.customer).map((key) => {
        if (this.customerFilter.customer[key]) {
          return this.customerFilter.customer[key].id
        }
      })
      const endpoint = `/sales/invoices/report?filter_date_min=${this.customerFilter.dateStart}&filter_date_max=${this.customerFilter.dateEnd}&selected_customer=${uniq(selectedCustomer).join(',')}`
      const {
        data: {
          data: customerSalesInvoices,
          meta: {
            filter: { min_date: minDate, max_date: maxDate }
          }
        }
      } = await axiosNode.get(endpoint)
      this.customerSalesInvoices = customerSalesInvoices
      this.customerFilter.dateStart = minDate
      this.customerFilter.dateEnd = maxDate

      this.generateReportByCustomer()
    },
    generateReportByCustomer () {
      const reportCustomer = {}

      // create object that the object keys represent customer
      this.customerSalesInvoices.forEach((salesInvoice) => {
        const customer = salesInvoice.customer
        salesInvoice.items.forEach((salesInvoiceItem) => {
          if (!reportCustomer[`customer_${customer.id}`]) {
            reportCustomer[`customer_${customer.id}`] = {
              items: [],
              name: customer.name,
              total: 0
            }
          }
          reportCustomer[`customer_${customer.id}`].items.push(salesInvoiceItem)
        })
      })

      // convert object to array for easier data processing
      const arrayReportCustomer = Object.keys(reportCustomer).map((key) => {
        return reportCustomer[key]
      })

      // get total sales for each customer
      arrayReportCustomer.forEach((reportCustomerItem) => {
        let total = 0
        reportCustomerItem.items.forEach((item) => {
          let discount = 0
          if (parseFloat(item.discountValue) !== 0) {
            discount = parseFloat(item.discountValue)
          } else if (parseFloat(item.discountPercent) !== 0) {
            discount = item.price * parseFloat(item.discountPercent) / 100
          }

          total += ((parseFloat(item.price) - discount) * parseFloat(item.quantity))
        })
        reportCustomerItem.total = total
      })

      // sort descending customer by total sales
      arrayReportCustomer.sort((a, b) => {
        return b.total - a.total
      })

      this.reportCustomer = arrayReportCustomer
      this.customerReportLabels = arrayReportCustomer.map((item) => item.name)
      this.customerReportValues = arrayReportCustomer.map((item) => item.total)
      this.showCustomerFilter = false
    },
    async getReportByAllocation () {
      const selectedAllocation = Object.keys(this.allocationFilter.allocation).map((key) => {
        if (this.allocationFilter.allocation[key]) {
          return this.allocationFilter.allocation[key].id
        }
      })
      const endpoint = `/sales/invoices/report?filter_date_min=${this.allocationFilter.dateStart}&filter_date_max=${this.allocationFilter.dateEnd}&selected_allocation=${uniq(selectedAllocation).join(',')}`
      const {
        data: {
          data: allocationSalesInvoices, meta: {
            filter: { min_date: minDate, max_date: maxDate }
          }
        }
      } = await axiosNode.get(endpoint)
      this.allocationSalesInvoices = allocationSalesInvoices
      this.allocationFilter.dateStart = minDate
      this.allocationFilter.dateEnd = maxDate

      this.generateReportByAllocation()
    },
    generateReportByAllocation () {
      const reportAllocation = {
        undefinedAllocation: {
          items: [],
          name: 'Undefined Allocation',
          total: 0
        }
      }

      // create object that the object keys represent allocation
      this.allocationSalesInvoices.forEach((salesInvoice) => {
        salesInvoice.items.forEach((salesInvoiceItem) => {
          const allocation = salesInvoiceItem.allocation
          if (!allocation || !allocation.name) {
            // uncomment this if want to show Undefined allocation
            // reportAllocation.undefinedAllocation.items.push(salesInvoiceItem)
          } else {
            if (!reportAllocation[`allocation_${allocation.id}`]) {
              reportAllocation[`allocation_${allocation.id}`] = {
                items: [],
                name: allocation.name,
                total: 0
              }
            }

            reportAllocation[`allocation_${allocation.id}`].items.push(salesInvoiceItem)
          }
        })
      })
      // remove undefined collection if empty
      if (reportAllocation.undefinedAllocation.items.length === 0) {
        delete reportAllocation.undefinedAllocation
      }

      // convert object to array for easier data processing
      const arrayReportAllocation = Object.keys(reportAllocation).map((key) => {
        return reportAllocation[key]
      })

      // get total sales for each allocation
      arrayReportAllocation.forEach((reportAllocationItem) => {
        let total = 0
        reportAllocationItem.items.forEach((item) => {
          let discount = 0
          if (parseFloat(item.discountValue) !== 0) {
            discount = parseFloat(item.discountValue)
          } else if (parseFloat(item.discountPercent) !== 0) {
            discount = item.price * parseFloat(item.discountPercent) / 100
          }

          total += ((parseFloat(item.price) - discount) * parseFloat(item.quantity))
        })
        reportAllocationItem.total = total
      })

      // sort descending allocation by total sales
      arrayReportAllocation.sort((a, b) => {
        return b.total - a.total
      })

      this.reportAllocation = arrayReportAllocation
      this.allocationReportLabels = arrayReportAllocation.map((item) => item.name)
      this.allocationReportValues = arrayReportAllocation.map((item) => item.total)
      this.showAllocationFilter = false
    },
    chooseItem (itemId, option) {
      if (!option.id) {
        this.itemFilter.item[itemId] = null
        return
      }
      this.itemFilter.item[itemId] = { id: option.id, label: option.label }
    },
    chooseCustomer (customerId, option) {
      if (!option.id) {
        this.customerFilter.customer[customerId] = null
        return
      }
      this.customerFilter.customer[customerId] = { id: option.id, name: option.label }
    },
    chooseAllocation (allocationId, option) {
      if (!option.id) {
        this.allocationFilter.allocation[allocationId] = null
        return
      }
      this.allocationFilter.allocation[allocationId] = { id: option.id, name: option.label }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-link {
  border: none;
}
</style>
