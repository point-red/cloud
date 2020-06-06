<template>
  <div>
     <breadcrumb v-if="purchaseReceive">
      <breadcrumb-purchase/>
      <router-link to="/purchase/receive" class="breadcrumb-item">{{ $t('purchase order') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ purchaseReceive.form.number | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchaseReceive.form.request_approval_to.full_name"
      :cancellation-status="purchaseReceive.form.cancellation_status"
      :approval-status="purchaseReceive.form.approval_status"
      :approval-reason="purchaseReceive.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"/>

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchaseReceive.form.cancellation_status"
      :cancellation-approval-reason="purchaseReceive.form.cancellation_approval_reason"
      :request-cancellation-reason="purchaseReceive.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"/>

    <div class="row" v-if="purchaseReceive">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link :to="{ name: 'purchase.receive.create' }" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link :to="{ name: 'purchase.receive.edit', params: { id: purchaseReceive.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="purchaseReceive.form.cancellation_status == null || purchaseReceive.form.cancellation_status == -1"
                  @click="$refs.formRequestDelete.open()" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('delete') | uppercase }}
                </button>
                <m-form-request-delete ref="formRequestDelete" @delete="onDelete($event)"></m-form-request-delete>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('purchase receive') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td width="150px" class="font-weight-bold">{{ $t('form number') | uppercase }}</td>
                  <td>{{ purchaseReceive.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">{{ $t('date') | uppercase }}</td>
                  <td>{{ purchaseReceive.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="purchaseReceive.purchase_order">
                  <td class="font-weight-bold">{{ $t('reference') | uppercase }}</td>
                  <td>{{ purchaseReceive.purchase_order.form.number }}</td>
                </tr>
                <tr v-if="purchaseReceive.driver">
                  <td class="font-weight-bold">{{ $t('driver') | uppercase }}</td>
                  <td>{{ purchaseReceive.driver }}</td>
                </tr>
                <tr v-if="purchaseReceive.license_plate">
                  <td class="font-weight-bold">{{ $t('license plate') | uppercase }}</td>
                  <td>{{ purchaseReceive.license_plate }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">{{ authUser.tenant_name | uppercase }}</h6>
              <template v-if="purchaseReceive.form.branch">
                {{ purchaseReceive.form.branch.address | uppercase }}
                <br v-if="purchaseReceive.form.branch.phone">{{ purchaseReceive.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">{{ $t('supplier') | uppercase }}</h6>
              {{ purchaseReceive.supplier_name | uppercase }}
              <div style="font-size:12px">
                {{ purchaseReceive.supplier_address | uppercase }}
                <br v-if="purchaseReceive.supplier_phone">{{ purchaseReceive.supplier_phone }}
                <br v-if="purchaseReceive.supplier_email">{{ purchaseReceive.supplier_email | uppercase }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">#</th>
              <th>{{ $t('item') | uppercase }}</th>
              <th class="text-right">{{ $t('quantity') | uppercase }}</th>
              <th width="50px">
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="toggleMore()">
                  <i class="fa fa-ellipsis-h"/>
                </button>
              </th>
            </tr>
            <template v-for="(row, index) in purchaseReceive.items">
              <tr slot="p-body" :key="index">
                <th class="text-center">{{ index + 1 }}</th>
                <td>{{ row.item.label }}</td>
                <td class="text-right">{{ row.quantity | numberFormat }} {{ row.unit }}</td>
                <td>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="row.more = !row.more">
                    <i class="fa fa-ellipsis-h"/>
                  </button>
                </td>
              </tr>
              <template v-if="row.more">
              <tr slot="p-body" :key="'ext2-'+index" class="bg-gray-light">
                <th class="bg-gray-light"></th>
                <td colspan="6">
                  <p-form-row
                    :id="'notes-' + index"
                    :name="'notes-' + index"
                    class="mb-0"
                    :label="$t('notes')">
                    <div slot="body" class="mt-5">
                      {{ row.notes }}
                    </div>
                  </p-form-row>
                </td>
              </tr>
              </template>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ purchaseReceive.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ purchaseReceive.form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ purchaseReceive.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="purchaseReceive.form.approval_at">
                  {{ purchaseReceive.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseReceive.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">{{ purchaseReceive.form.request_approval_to.email | lowercase }}</div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete ref="formRequestDelete" @delete="onDelete($event)"></m-form-request-delete>
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Show',
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
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
    ...mapGetters('purchaseReceive', ['purchaseReceive']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseReceiveRequest()
      }
    }
  },
  methods: {
    ...mapActions('purchaseReceive', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    toggleMore () {
      let isMoreActive = this.purchaseReceive.items.some(function (el, index) {
        return el.more === false
      })
      this.purchaseReceive.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    purchaseReceiveRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'supplier;' +
            'warehouse;' +
            'items.item.units;' +
            'purchaseOrder.form;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.$router.push('/purchase/receive')
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
        this.purchaseReceiveRequest()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.purchaseReceiveRequest()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/purchase/receive')
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.purchaseReceiveRequest()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.purchaseReceiveRequest()
  }
}
</script>
