<template>
  <div>
    <breadcrumb v-if="stockCorrection">
      <breadcrumb-inventory />
      <router-link
        to="/inventory/correction"
        class="breadcrumb-item"
      >
        {{ $t('stock correction') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ stockCorrection.form.number | uppercase }}</span>
    </breadcrumb>

    <p-show-form-approval-status-custom
      form-name="Stock Correction"
      :is-loading="isLoading"
      :approved-by="stockCorrection.form.requestApprovalToUser.fullName"
      :cancellation-status="stockCorrection.form.cancellationStatus"
      :approval-status="stockCorrection.form.approvalStatus"
      :approval-reason="stockCorrection.form.approvalReason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status-custom
      form-name="Stock Correction"
      :is-loading="isLoading"
      :approved-by="stockCorrection.form.requestApprovalToUser.fullName"
      :cancellation-status="stockCorrection.form.cancellationStatus"
      :cancellation-approval-reason="stockCorrection.form.cancellationApprovalReason"
      :request-cancellation-reason="stockCorrection.form.requestCancellationReason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="stockCorrection"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Print stock correction"
                  @click="() => $refs['print-correction'].open()"
                >
                  <i class="si si-printer" />
                </button>
                <router-link
                  :to="{ name: 'inventory.correction.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'inventory.correction.edit', params: { id: stockCorrection.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="stockCorrection.form.cancellationStatus == null || stockCorrection.form.cancellationStatus == -1"
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
              <h4>{{ $t('stock correction') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ stockCorrection.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ stockCorrection.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('warehouse') | uppercase }}
                  </td>
                  <td>{{ stockCorrection.warehouse.name }}</td>
                </tr>
                <tr v-if="stockCorrection.referenceable">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ stockCorrection.referenceable.form.number }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="stockCorrection.form.branch">
                {{ stockCorrection.form.branch.address | uppercase }}
                <br v-if="stockCorrection.form.branch.phone">{{ stockCorrection.form.branch.phone | uppercase }}
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
              <th class="text-right">
                Stock Database
              </th>
              <th class="text-right">
                Stock Correction
              </th>
              <th class="text-right">
                Balance
              </th>
              <th>
                Notes
              </th>
              <th>Allocation</th>
            </tr>
            <template v-for="(row, index) in stockCorrection.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>
                  {{ row.item.label }} {{ row.item.requireProductionNumber ? `(PID: ${row.productionNumber})` : '' }} {{ row.item.requireExpiryDate ? `(E/D: ${$options.filters.dateFormat(row.expiryDate, 'DD MMMM YYYY')})` : '' }}
                </td>
                <td class="text-right">
                  {{ row.initialStock | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.finalStock | numberFormat }} {{ row.unit }}
                </td>
                <td>
                  {{ row.notes }}
                </td>
                <td>{{ row.allocation && row.allocation.name }}</td>
              </tr>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ stockCorrection.form.notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="row col-sm-6 align-items-end m-0 p-0">
              <div class="row col-12 m-0 p-0">
                <div class="col-6 text-center">
                  <h6 class="mb-0">
                    {{ $t('requested by') | uppercase }}
                  </h6>
                  <div
                    class="mb-50"
                    style="font-size:11px"
                  >
                    {{ stockCorrection.form.date | dateFormat('DD MMMM YYYY') }}
                  </div>
                  {{ stockCorrection.form.createdByUser.fullName | uppercase }}
                  <div class="d-sm-block d-md-none mt-10" />
                </div>
                <div class="col-6 text-center">
                  <h6 class="mb-0">
                    {{ $t('approved by') | uppercase }}
                  </h6>
                  <div
                    class="mb-50"
                    style="font-size:11px"
                  >
                    <template v-if="stockCorrection.form.approvalAt">
                      {{ stockCorrection.form.approvalAt | dateFormat('DD MMMM YYYY') }}
                    </template>
                    <template v-else>
                      _______________
                    </template>
                  </div>
                  {{ stockCorrection.form.requestApprovalToUser.fullName | uppercase }}
                  <div style="font-size:11px">
                    {{ stockCorrection.form.requestApprovalToUser.email | lowercase }}
                  </div>
                </div>
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

    <print-stock-correction
      ref="print-correction"
      :stock-correction="stockCorrection"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '../Breadcrumb'
import PointTable from 'point-table-vue'
import PrintStockCorrection from './PrintStockCorrection'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable,
    PrintStockCorrection
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('inventoryCorrection', ['stockCorrection']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.stockCorrectionRequest()
      }
    }
  },
  created () {
    this.stockCorrectionRequest()
  },
  methods: {
    ...mapActions('inventoryCorrection', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      sendReport: 'sendReport'
    }),
    stockCorrectionRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'items.item;' +
            'items.allocation;' +
            'salesQuotation.form;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    onDelete (reason) {
      if (!reason) return this.$notification.error('Delete reason is required')

      this.isDeleting = true
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.stockCorrectionRequest()
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
        this.stockCorrectionRequest()
      }).catch(error => {
        if (error.message) return this.$notification.error(error.message)

        this.$notification.error('Something error when approving the stock correction creation')
      })
    },
    onReject (reason) {
      if (!reason) return this.$notification.error('Reject reason is required')

      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.stockCorrectionRequest()
      }).catch(error => {
        if (error.message) return this.$notification.error(error.message)

        this.$notification.error('Something error when rejecting the stock correction creation')
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/inventory/correction')
      }).catch(error => {
        if (error.message) return this.$notification.error(error.message)

        this.$notification.error('Something error when approving the stock correction cancellation')
      })
    },
    onCancellationReject (reason) {
      if (!reason) return this.$notification.error('Reject reason is required')

      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.stockCorrectionRequest()
      }).catch(error => {
        if (error.message) return this.$notification.error(error.message)

        this.$notification.error('Something error when rejecting the stock correction cancellation')
      })
    }
  }
}
</script>
