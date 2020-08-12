<template>
  <div>
    <breadcrumb v-if="salesQuotation">
      <breadcrumb-sales />
      <router-link
        to="/sales/quotation"
        class="breadcrumb-item"
      >
        {{ $t('sales quotation') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ salesQuotation.form.number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="salesQuotation.form.request_approval_to.full_name"
      :cancellation-status="salesQuotation.form.cancellation_status"
      :approval-status="salesQuotation.form.approval_status"
      :approval-reason="salesQuotation.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="salesQuotation.form.cancellation_status"
      :cancellation-approval-reason="salesQuotation.form.cancellation_approval_reason"
      :request-cancellation-reason="salesQuotation.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="salesQuotation"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'sales.quotation.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'sales.quotation.edit', params: { id: salesQuotation.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="salesQuotation.form.cancellation_status == null || salesQuotation.form.cancellation_status == -1"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="$refs.formRequestDelete.open()"
                >
                  {{ $t('delete') | uppercase }}
                </button>
                <m-form-request-delete
                  ref="formRequestDelete"
                  @delete="onDelete($event)"
                />
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('sales quotation') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ salesQuotation.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ salesQuotation.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="salesQuotation.sales_request">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ salesQuotation.sales_request.form.number }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-0">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="salesQuotation.form.branch">
                {{ salesQuotation.form.branch.address | uppercase }} <br v-if="salesQuotation.form.branch.address">
                {{ salesQuotation.form.branch.phone | uppercase }} <br v-if="salesQuotation.form.branch.phone">
              </template>
              <h6 class="mt-30 mb-0">
                {{ $t('customer') | uppercase }} {{ salesQuotation.customer_name | uppercase }}
              </h6>
              <div v-if="salesQuotation.form.customer_address">
                <i class="fa fa-home fa-fw" /> {{ salesQuotation.form.customer_address | uppercase }}
              </div>
              <div v-if="salesQuotation.form.customer_phone">
                <i class="fa fa-phone fa-fw" /> {{ salesQuotation.form.customer_phone | uppercase }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                #
              </th>
              <th>Item</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-right">
                Price
              </th>
              <th class="text-right">
                Discount
              </th>
              <th class="text-right">
                Total
              </th>
              <th width="50px">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="toggleMore()"
                >
                  <i class="fa fa-ellipsis-h" />
                </button>
              </th>
            </tr>
            <template v-for="(row, index) in salesQuotation.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item ? row.item.label : '' }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.discount_value | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.quantity * (row.price - row.discount_value) | numberFormat }}
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="row.more = !row.more"
                  >
                    <i class="fa fa-ellipsis-h" />
                  </button>
                </td>
              </tr>
              <template v-if="row.more">
                <!-- <tr slot="p-body" :key="'ext-'+index" class="bg-gray-light">
                <th class="bg-gray-light"></th>
                <td colspan="6">
                  <p-form-row
                    :id="'allocation-' + index"
                    :name="'allocation-' + index"
                    class="mb-0"
                    :label="$t('allocation')">
                    <div slot="body" class="mt-5">
                      <template v-if="row.allocation">{{ row.allocation.name }}</template>
                    </div>
                  </p-form-row>
                </td>
              </tr> -->
                <tr
                  slot="p-body"
                  :key="'ext2-'+index"
                  class="bg-gray-light"
                >
                  <th class="bg-gray-light" />
                  <td colspan="6">
                    <p-form-row
                      :id="'notes-' + index"
                      :name="'notes-' + index"
                      class="mb-0"
                      :label="$t('notes')"
                    >
                      <div
                        slot="body"
                        class="mt-5"
                      >
                        {{ row.notes }}
                      </div>
                    </p-form-row>
                  </td>
                </tr>
              </template>
            </template>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('total') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ salesQuotation.subtotal | numberFormat }}</b>
              </td>
              <td />
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ salesQuotation.form.notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('requested by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                {{ salesQuotation.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ salesQuotation.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('approved by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                <template v-if="salesQuotation.form.approval_at">
                  {{ salesQuotation.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ salesQuotation.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ salesQuotation.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '../Breadcrumb'
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
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('salesQuotation', ['salesQuotation']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.salesQuotationRequest()
      }
    }
  },
  created () {
    this.salesQuotationRequest()
  },
  methods: {
    ...mapActions('salesQuotation', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    toggleMore () {
      const isMoreActive = this.salesQuotation.items.some(function (el, index) {
        return el.more === false
      })
      this.salesQuotation.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    salesQuotationRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'items.item;' +
            'items.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.calculate()
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    calculate () {
      var subtotal = 0
      this.salesQuotation.items.forEach(function (element) {
        element.total = element.quantity * (element.price - element.discount_value)
        subtotal += parseFloat(element.total)
      })
      this.salesQuotation.subtotal = subtotal
    },
    onDelete (reason) {
      this.isDeleting = true
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.salesQuotationRequest()
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.salesQuotationRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.salesQuotationRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/quotation')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.salesQuotationRequest()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
