<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <span class="breadcrumb-item active">{{ $t('purchase request') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create purchase request')"
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
              <th>No</th>
              <th>
                Date
              </th>
              <th>Nomor Form</th>
              <th>Supplier</th>
              <th>Notes</th>
              <th class="text-right">
                Value
              </th>
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
                v-for="(purchasePaymentOrderItem, index2) in purchasePaymentOrder.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link
                    :to="{ name: 'purchase.request.show', params: { id: purchasePaymentOrder.id }}"
                  >
                    {{ purchasePaymentOrder.form.number }}
                  </router-link>
                </th>
                <td>{{ purchasePaymentOrder.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ purchasePaymentOrderItem.item_name }}</td>
                <td>{{ purchasePaymentOrderItem.notes }}</td>
                <td
                  class="text-right"
                >
                  {{ purchasePaymentOrderItem.quantity | numberFormat }} {{ purchasePaymentOrderItem.unit }}
                </td>
                <td class="text-center">
                  <div
                    v-if="purchasePaymentOrder.form.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="purchasePaymentOrder.form.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="purchasePaymentOrder.form.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <div
                    v-if="purchasePaymentOrder.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="purchasePaymentOrder.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="purchasePaymentOrder.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td>
                  <!-- <p-form-check-box
                      id="check-box"
                      :is-form="false"
                      name="check-box"
                      :checked="$_checkList_isRowChecked(purchasePaymentOrder.id)"
                      class="text-center"
                      @click.native="$_checkList_toggleCheckRow(purchasePaymentOrder.id)"
                  />-->
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
// import debounce from 'lodash/debounce'
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
  created () {
    this.getPurchasePaymentOrder()
  },
  methods: {
    ...mapActions('purchasePaymentOrder', ['get']),
    getPurchasePaymentOrder () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    }
  }
}
</script>
