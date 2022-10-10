<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <span class="breadcrumb-item active">{{ $t('payment order') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <download-excel
            class="input-group-prepend"
            @click="exportData(purchasePaymentOrders)"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create purchase payment order')"
            to="/purchase/payment-order/create"
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
            {{ $t('advance filter') | uppercase }}
            <i class="fa fa-caret-down" />
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
                  >{{ formApprovalStatus.label || $t('select') | uppercase }}</span>
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
                  >{{ formStatus.label || $t('select') | uppercase }}</span>
                </div>
              </p-form-row>
            </div>
          </div>
          <hr>
        </div>
        <!-- <div class="mt-10">
            <label class="css-control css-control-primary css-checkbox mr-10">
              <input
                type="checkbox"
                class="css-control-input"
                :checked="$_checkList_isRowsChecked(purchaseRequests, $data.$_checkList_checkedRow)"
                @click="$_checkList_toggleCheckRows(purchaseRequests)"
              >
              <span class="css-control-indicator" />
            </label>
            <span
              v-show="$data.$_checkList_checkedRow.length > 0"
              class="mr-15 animated fadeIn"
            >
              <button
                type="button"
                class="btn btn-sm btn-secondary mr-5"
                @click="bulkCancel()"
              >
                {{ $t('request approval') | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-secondary mr-5"
                @click="bulkApprove()"
              >
                {{ $t('approve') | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-secondary mr-5"
                @click="bulkReject()"
              >
                {{ $t('reject') | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-secondary"
                @click="bulkCancel()"
              >
                {{ $t('archive') | uppercase }}
              </button>
            </span>
        </div>-->
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Date</th>
              <th>Nomor Form</th>
              <th>Supplier</th>
              <th>Notes</th>
              <th>Value</th>
              <th class="text-center">
                Approval Status
              </th>
              <th class="text-center">
                Form Status
              </th>
              <th width="50px">
                History
              </th>
            </tr>
            <template v-for="(purchasePaymentOrder, index) in purchasePaymentOrders">
              <tr
                :key="'pr-' + index"
                slot="p-body"
              >
                <td>{{ purchasePaymentOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                <th>
                  <router-link
                    :to="{ name: 'purchase.payment-order.show', params: { id: purchasePaymentOrder.payment_order_id }}"
                  >
                    {{ purchasePaymentOrder.form_number }}
                  </router-link>
                </th>
                <td>{{ purchasePaymentOrder.supplier }}</td>
                <td>{{ purchasePaymentOrder.notes }}</td>
                <td>{{ purchasePaymentOrder.value | numberFormat }}</td>
                <td class="text-center">
                  <div
                    v-if="purchasePaymentOrder.approval_status == 'Pending'"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="purchasePaymentOrder.approval_status == 'Rejected'"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="purchasePaymentOrder.approval_status == 'Approved'"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <div
                    v-if="purchasePaymentOrder.done_status == 'Canceled'"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-if="purchasePaymentOrder.done_status == 'Pending'"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="purchasePaymentOrder.done_status == 'Done'"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <router-link
                    class="btn btn-sm btn-light"
                    to="/purchase/payment-order"
                  >
                    <i class="fa fa-history" />
                  </router-link>
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
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
// import CheckListMixin from '@/mixins/CheckList'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
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
    ...mapGetters('purchasePaymentOrder', ['purchasePaymentOrders', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            dateFrom: this.date.start,
            dateTo: this.date.end
          }
        })
        this.getPurchasePaymentOrder()
      },
      deep: true
    }
  },
  created () {
    this.getPurchasePaymentOrder()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('purchasePaymentOrder', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getPurchasePaymentOrder()
    }, 300),
    getPurchasePaymentOrder () {
      this.isLoading = true
      this.get({
        params: {
          filterLike: {
            'form.number': this.searchText
          },
          dateFrom: this.$options.filters.dateFormat(this.date.start, 'YYYY-MM-DD'),
          dateTo: this.$options.filters.dateFormat(this.date.end, 'YYYY-MM-DD'),
          approvalStatus: this.formApprovalStatus.label,
          doneStatus: this.formStatus.label,
          page: this.currentPage
        }
      }).catch((error) => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getPurchasePaymentOrder()
    },
    chooseFormApprovalStatus (option) {
      console.log(option, 'OPTION')
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getPurchasePaymentOrder()
    },
    updatePage (value) {
      this.currentPage = value
      this.getPurchasePaymentOrder()
    },
    exportData (value) {
      console.log(value, 'This is export data func')
    }
  }
}
</script>
