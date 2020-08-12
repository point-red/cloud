<template>
  <div>
    <breadcrumb v-if="purchaseRequest">
      <breadcrumb-purchase />
      <router-link
        to="/purchase/request"
        class="breadcrumb-item"
      >
        {{ $t('purchase request') | uppercase }}
      </router-link>
      <template v-if="purchaseRequest.form.number">
        <span class="breadcrumb-item active">{{ purchaseRequest.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link
          v-if="purchaseRequest.origin"
          :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.origin.id }}"
          class="breadcrumb-item"
        >
          {{ purchaseRequest.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchaseRequest.form.request_approval_to.full_name"
      :cancellation-status="purchaseRequest.form.cancellation_status"
      :approval-status="purchaseRequest.form.approval_status"
      :approval-reason="purchaseRequest.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchaseRequest.form.cancellation_status"
      :cancellation-approval-reason="purchaseRequest.form.cancellation_approval_reason"
      :request-cancellation-reason="purchaseRequest.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="purchaseRequest"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'purchase.request.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'purchase.request.edit', params: { id: id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="purchaseRequest.form.cancellation_status == null || purchaseRequest.form.cancellation_status == -1"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="$refs.formRequestDelete.open()"
                >
                  {{ $t('delete') | uppercase }}
                </button>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('purchase request') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ purchaseRequest.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('required date') | uppercase }}
                  </td>
                  <td>{{ purchaseRequest.required_date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-0">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="purchaseRequest.form.branch">
                {{ purchaseRequest.form.branch.address | uppercase }}<br v-if="purchaseRequest.form.branch.address">
                {{ purchaseRequest.form.branch.phone | uppercase }}<br v-if="purchaseRequest.form.branch.phone">
              </template>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                #
              </th>
              <th>Item</th>
              <th>Notes</th>
              <th class="text-right">
                Quantity
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
            <template v-for="(row, index) in purchaseRequest.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.name }}</td>
                <td>{{ row.notes }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
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
                <tr
                  slot="p-body"
                  :key="'ext-'+index"
                  class="bg-gray-light"
                >
                  <th class="bg-gray-light" />
                  <td colspan="4">
                    <p-form-row
                      id="allocation"
                      name="allocation"
                      :label="$t('allocation')"
                    >
                      <div
                        slot="body"
                        class="col-lg-9 mt-5"
                      >
                        <template v-if="row.allocation">
                          {{ row.allocation.name }}
                        </template>
                      </div>
                    </p-form-row>
                  </td>
                </tr>
              </template>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ purchaseRequest.form.notes }}
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
                {{ purchaseRequest.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ purchaseRequest.form.created_by.first_name | uppercase }} {{ purchaseRequest.form.created_by.last_name | uppercase }}
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
                <template v-if="purchaseRequest.form.approval_at">
                  {{ purchaseRequest.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseRequest.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:9px">
                {{ purchaseRequest.form.request_approval_to.email | uppercase }}
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
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      rows: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequest']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.findPurchaseRequisition()
      }
    }
  },
  created () {
    this.findPurchaseRequisition()
  },
  methods: {
    ...mapActions('purchaseRequest', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    toggleMore () {
      const isMoreActive = this.purchaseRequest.items.some(function (el, index) {
        return el.more === false
      })
      this.purchaseRequest.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    findPurchaseRequisition () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'items.item;' +
            'items.allocation;' +
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
    onDelete (reason) {
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.$notification.success('cancel success')
        this.findPurchaseRequisition()
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approval approved')
        this.findPurchaseRequisition()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('approval rejected')
        this.findPurchaseRequisition()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/purchase/request')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.findPurchaseRequisition()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
