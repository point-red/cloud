<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <span class="breadcrumb-item active">{{ $t('sales return') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <download-excel
            :name="`Sales Return_${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`"
            :fetch="generateReport"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create sales return')"
            to="/sales/return/create"
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
          <div class="col-sm-2">
            <router-link
              v-if="$permission.has('create sales return') || $permission.has('update sales return') || $permission.has('delete sales return')"
              to="/sales/return/approval"
              class="input-group-prepend"
            >
              <span class="input-group-text font-size-sm">
                {{ $t('request approval all') | uppercase }}
              </span>
            </router-link>
          </div>
          <div class="col-sm-10 text-center font-size-sm">
            <a
              href="javascript:void(0)"
              @click="isAdvanceFilter = !isAdvanceFilter"
            >
              {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
            </a>
          </div>
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
                Qty
              </th>
              <th class="text-center">
                Approval Status
              </th>
              <th class="text-center">
                Form Status
              </th>
              <th class="text-center">
                History
              </th>
              <th width="50px" />
            </tr>
            <template v-for="(salesReturn, index) in salesReturns">
              <tr
                v-for="(salesReturnItem, index2) in salesReturn.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.return.show', params: { id: salesReturn.id }}">
                    {{ salesReturn.form.number }}
                  </router-link>
                </th>
                <td>{{ salesReturn.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="salesReturn.customer">
                    {{ salesReturn.customer.name }}
                  </template>
                </td>
                <td>{{ salesReturnItem.item.name }}</td>
                <td class="text-right">
                  {{ salesReturnItem.quantity | numberFormat }} {{ salesReturnItem.unit }}
                </td>
                <td class="text-center">
                  <div
                    v-if="salesReturn.form.cancellation_status == null"
                  >
                    <div
                      v-if="salesReturn.form.approval_status == 0"
                      class="badge badge-primary"
                    >
                      {{ $t('pending') | uppercase }}
                    </div>
                    <div
                      v-if="salesReturn.form.approval_status == -1"
                      class="badge badge-danger"
                    >
                      {{ $t('rejected') | uppercase }}
                    </div>
                    <div
                      v-if="salesReturn.form.approval_status == 1"
                      class="badge badge-success"
                    >
                      {{ $t('approved') | uppercase }}
                    </div>
                  </div>
                  <div
                    v-if="salesReturn.form.cancellation_status != null"
                  >
                    <div
                      v-if="salesReturn.form.cancellation_status == 0"
                      class="badge badge-primary"
                    >
                      {{ $t('pending') | uppercase }}
                    </div>
                    <div
                      v-if="salesReturn.form.cancellation_status == -1"
                      class="badge badge-danger"
                    >
                      {{ $t('rejected') | uppercase }}
                    </div>
                    <div
                      v-if="salesReturn.form.cancellation_status == 1"
                      class="badge badge-success"
                    >
                      {{ $t('approved') | uppercase }}
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <div
                    v-if="salesReturn.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="salesReturn.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="salesReturn.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <router-link
                    class="btn btn-sm btn-light"
                    :to="{ name: 'sales.return.histories', params: { id: salesReturn.id }}"
                  >
                    <i class="fa fa-history" />
                  </router-link>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import SalesMenu from '../Menu'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Breadcrumb,
    BreadcrumbSales,
    PointTable,
    SalesMenu
  },
  data () {
    return {
      isLoading: false,
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
    ...mapGetters('salesReturn', ['salesReturns', 'pagination'])
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
        this.getSalesReturn()
      },
      deep: true
    }
  },
  created () {
    if (this.$permission.has('read sales return')) {
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.getSalesReturn()
    } else {
      this.$router.push('/sales')
      this.$router.push('/404')
    }
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesReturn', ['get', 'export']),
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getSalesReturn()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getSalesReturn()
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
      this.getSalesReturn()
    }, 300),
    getSalesReturn () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,customer,items,item',
          fields: 'sales_return.*',
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
      this.getSalesReturn()
    }
  }
}
</script>
