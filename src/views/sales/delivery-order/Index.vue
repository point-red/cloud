<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <span class="breadcrumb-item active">{{ $t('delivery order') | uppercase }}</span>
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
            <template v-for="(deliveryOrder, index) in deliveryOrders">
              <tr
                v-for="(deliveryOrderItem, index2) in deliveryOrder.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.delivery-order.show', params: { id: deliveryOrder.id }}">
                    {{ deliveryOrder.form.number }}
                  </router-link>
                </th>
                <td>{{ deliveryOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="deliveryOrder.customer">
                    {{ deliveryOrder.customer.name }}
                  </template>
                </td>
                <td>{{ deliveryOrderItem.item.name }}</td>
                <td class="text-right">
                  {{ deliveryOrderItem.quantity | numberFormat }} {{ deliveryOrderItem.unit }}
                </td>
                <td class="text-right">
                  {{ deliveryOrderItem.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ (deliveryOrderItem.quantity * deliveryOrderItem.price) | numberFormat }}
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
                <td class="text-center">
                  <div
                    v-if="deliveryOrder.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="deliveryOrder.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="deliveryOrder.form.done == 1"
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
    ...mapGetters('salesDeliveryOrder', ['deliveryOrders', 'pagination'])
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
        this.getDeliveryOrder()
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
    this.getDeliveryOrder()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesDeliveryOrder', ['get']),
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getDeliveryOrder()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getDeliveryOrder()
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
      this.getDeliveryOrder()
    }, 300),
    getDeliveryOrder () {
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
      this.getDeliveryOrder()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
