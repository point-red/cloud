<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/delivery-order"
        class="breadcrumb-item"
      >
        {{ $t('delivery order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('approval') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create sales delivery order')"
            to="/sales/delivery-order/create"
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
        <div class="input-group block">
          <button
            class="btn btn-primary mr-3"
            @click="sendRequest"
          >
            Sent {{ checkedRow.length }} {{ `Request${checkedRow.length > 1 ? 's' : ''}` }} <i class="fa fa-paper-plane" />
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                <p-form-check-box
                  id="subscibe"
                  name="subscibe"
                  :is-form="false"
                  :checked="isRowsChecked(deliveryOrders, checkedRow)"
                  class="text-center"
                  @click.native="toggleCheckRows()"
                />
              </th>
              <th>Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Warehouse</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-center">
                Approval Status
              </th>
              <th>
                Last Request
              </th>
            </tr>
            <template v-for="(deliveryOrder, index) in deliveryOrders">
              <tr
                v-for="(deliveryOrderItem, indexItem) in deliveryOrder.items"
                :key="'pr-' + index + '-i-' + indexItem"
                slot="p-body"
              >
                <td>
                  <p-form-check-box
                    id="subscibe"
                    :is-form="false"
                    name="subscibe"
                    :checked="isRowChecked(deliveryOrder.id)"
                    class="text-center"
                    @click.native="toggleCheckRow(deliveryOrder.id)"
                  />
                </td>
                <th>
                  <router-link :to="{ name: 'sales.delivery-order.show', params: { id: deliveryOrder.id }}">
                    {{ deliveryOrder.form.number + ([0, 1].includes(deliveryOrder.form.close_status) ? ' - Closed' : '') }}
                  </router-link>
                </th>
                <td>{{ deliveryOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="deliveryOrder.customer">
                    {{ deliveryOrder.customer.name }}
                  </template>
                </td>
                <td>{{ deliveryOrderItem.item.name }}</td>
                <td>
                  <template v-if="deliveryOrder.warehouse">
                    {{ deliveryOrder.warehouse.name }}
                  </template>
                </td>
                <td class="text-right">
                  {{ deliveryOrderItem.quantity_delivered | numberFormat }} {{ deliveryOrderItem.unit }}
                </td>
                <td class="text-center">
                  <div
                    v-if="deliveryOrder.form.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="deliveryOrder.form.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="deliveryOrder.form.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td>
                  <span v-if="deliveryOrder.last_request_date">
                    {{ deliveryOrder.last_request_date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </span>
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
import momentjs from 'moment-timezone'
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
    ...mapGetters('salesDeliveryOrderApproval', ['deliveryOrders', 'pagination'])
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
        this.getDeliveryOrders()
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
    this.getDeliveryOrders()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesDeliveryOrderApproval', ['get', 'send']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.deliveryOrders, this.checkedRow)) {
        this.deliveryOrders.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.deliveryOrders.forEach(element => {
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
        deliveryOrders: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getDeliveryOrders()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getDeliveryOrders()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getDeliveryOrders()
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
      this.getDeliveryOrders()
    }, 300),
    getDeliveryOrders () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,customer,items,item',
          fields: 'sales_delivery_order.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText,
            'item.code': this.searchText,
            'item.name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          },
          limit: 10,
          includes: 'form;customer;warehouse;items.item;items.allocation',
          page: this.currentPage
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.deliveryOrders.forEach(element => {
          if (element.last_request_date != null) {
            const dateUTC = momentjs.utc(element.last_request_date).toDate()
            const localTime = momentjs(dateUTC).local().format('YYYY-MM-DD HH:mm:ss')
            element.last_request_date = localTime
          }
        })
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getDeliveryOrders()
    },
    sendRequest () {
      if (this.checkedRow.length > 0) {
        this.isLoading = true
        this.send({ ids: this.checkedRow })
          .then(response => {
            this.$notification.success('sending email approval success')
            this.checkedRow = []
            this.getDeliveryOrders()
          }).catch(error => {
            this.$notification.error(error.message)
          }).finally(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
