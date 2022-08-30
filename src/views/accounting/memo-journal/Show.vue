<template>
  <div>
    <breadcrumb v-if="accountingMemoJournal">
      <breadcrumb-accounting />
      <span class="breadcrumb-item">
        <router-link
          to="/accounting/memo-journal"
          class="breadcrumb-item"
        >{{ $t('memo jurnal') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">
        <span v-if="accountingMemoJournal.form.number">
          {{ accountingMemoJournal.form.number | uppercase }}
        </span>
        <span v-if="accountingMemoJournal.form.edited_number">
          {{ $t('archive') | uppercase }}
        </span>
      </span>
    </breadcrumb>

    <span v-if="accountingMemoJournal.form.number">
      <p-show-form-approval-status-custom
        form-name="Memo Jurnal"
        :is-loading="isLoading"
        :approved-by="accountingMemoJournal.form.request_approval_to.full_name"
        :cancellation-status="accountingMemoJournal.form.cancellation_status"
        :approval-status="accountingMemoJournal.form.approval_status"
        :approval-reason="accountingMemoJournal.form.approval_reason"
        @onApprove="onApprove"
        @onReject="onReject"
      />
      <p-show-form-cancellation-status-custom
        form-name="Memo Jurnal"
        :is-loading="isLoading"
        :approved-by="accountingMemoJournal.form.request_approval_to.full_name"
        :cancellation-status="accountingMemoJournal.form.cancellation_status"
        :cancellation-approval-reason="accountingMemoJournal.form.cancellation_approval_reason"
        :request-cancellation-reason="accountingMemoJournal.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />
    </span>

    <div
      v-if="accountingMemoJournal"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="accountingMemoJournal.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <span v-if="accountingMemoJournal.form.number">
                <div class="text-right">
                  <button
                    class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                    title="Print memo jurnal"
                    @click="() => $refs['print-memo-journal'].open()"
                  >
                    <i class="si si-printer" />
                  </button>
                  <router-link
                    v-if="$permission.has('create memo journal')"
                    :to="{ name: 'accounting.memo.journal.create' }"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('create') | uppercase }}
                  </router-link>
                  <router-link
                    v-if="$permission.has('update memo journal')"
                    :to="{ name: 'accounting.memo.journal.edit', params: { id: accountingMemoJournal.id }}"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('edit') | uppercase }}
                  </router-link>
                  <button
                    v-if="$permission.has('delete memo journal') && (accountingMemoJournal.form.cancellation_status == null || accountingMemoJournal.form.cancellation_status == -1)"
                    class="btn btn-sm btn-outline-secondary mr-5"
                    @click="$refs.formRequestDelete.open()"
                  >
                    {{ $t('delete') | uppercase }}
                  </button>
                </div>
              </span>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('memo jurnal') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ accountingMemoJournal.form.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td v-if="accountingMemoJournal.form.number">
                    {{ accountingMemoJournal.form.number }}
                  </td>
                  <td v-if="accountingMemoJournal.form.edited_number">
                    {{ accountingMemoJournal.form.edited_number }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="accountingMemoJournal.form.branch">
                {{ accountingMemoJournal.form.branch.address | uppercase }} <br v-if="accountingMemoJournal.form.branch.address">
                {{ accountingMemoJournal.form.branch.phone | uppercase }} <br v-if="accountingMemoJournal.form.branch.phone">
              </template>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                #
              </th>
              <th>Account</th>
              <th>Master</th>
              <th>Reference</th>
              <th class="text-right">
                Debit
              </th>
              <th class="text-right">
                Credit
              </th>
              <th class="text-right">
                Notes
              </th>
            </tr>
            <template slot="p-body">
              <tr
                v-for="(row, index) in accountingMemoJournal.items"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>
                  {{ row.chart_of_account.label }}
                </td>
                <td>
                  <template v-if="row.masterable">
                    {{ row.masterable.name }}
                  </template>
                </td>
                <td>
                  <template v-if="row.form">
                    {{ row.form.number }}
                  </template>
                </td>
                <td class="text-right">
                  {{ row.debit | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.credit | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.notes }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  align="center"
                >
                  <b>Total</b>
                </td>
                <td align="right">
                  {{ (accountingMemoJournal.items.reduce((total, item) => total + parseFloat(item.debit), 0)) | numberFormat }}
                </td>
                <td align="right">
                  {{ (accountingMemoJournal.items.reduce((total, item) => total + parseFloat(item.credit), 0)) | numberFormat }}
                </td>
                <td />
              </tr>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ accountingMemoJournal.form.notes }}
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
                {{ accountingMemoJournal.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ accountingMemoJournal.form.created_by.full_name | uppercase }}
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
                <template v-if="accountingMemoJournal.form.approval_at">
                  {{ accountingMemoJournal.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ accountingMemoJournal.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ accountingMemoJournal.form.request_approval_to.email | lowercase }}
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
    <m-form-approval-reject
      ref="formApprovalReject"
      @reject="onReject($event)"
    />
    <m-form-cancellation-reject
      ref="formCancellationReject"
      @reject="onCancellationReject($event)"
    />
    <print-memo-journal
      ref="print-memo-journal"
      :memojournal="accountingMemoJournal"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import PrintMemoJournal from './PrintMemoJournal'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable,
    PrintMemoJournal
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      lines: []
    }
  },
  computed: {
    ...mapGetters('accountingMemoJournal', ['accountingMemoJournal']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.accountingMemoJournalRequest()
      }
    }
  },
  created () {
    this.accountingMemoJournalRequest()
  },
  methods: {
    ...mapActions('accountingMemoJournal', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      addHistories: 'addHistories'
    }),
    toggleMore () {
      const isMoreActive = this.accountingMemoJournal.items.some(function (el, index) {
        return el.more === false
      })
      this.accountingMemoJournal.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    accountingMemoJournalRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'items.chart_of_account;items.form;items.masterable;form.createdBy;form.requestApprovalTo;form.branch;'
        }
      }).then(response => {
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
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
        this.accountingMemoJournalRequest()
        this.addHistories({ id: this.id, activity: 'Deleted' })
          .catch(error => {
            console.log(error.message)
          })
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
        this.accountingMemoJournalRequest()
        this.addHistories({ id: response.data.id, activity: 'Approved' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        this.$notification.error(error.message + ', please edit the document')
        console.log(error.message)
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.accountingMemoJournalRequest()
        this.addHistories({ id: response.data.id, activity: 'Rejected' })
          .catch(error => {
            console.log(error.message)
          })
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/accounting/memo-journal')
        this.addHistories({ id: response.data.id, activity: 'Cancelation Approved' })
          .catch(error => {
            console.log(error.message)
          })
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.accountingMemoJournalRequest()
        this.addHistories({ id: response.data.id, activity: 'Cancelation Rejected' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        console.log(error.message)
      })
    },
    onCloseApprove () {
      const items = []
      this.accountingMemoJournal.items.forEach(itemTransfer => {
        this.accountingMemoJournal.receive_item.items.forEach(itemReceive => {
          if (itemReceive.item_id == itemTransfer.item_id && itemReceive.production_number == itemTransfer.production_number && itemReceive.expiry_date == itemTransfer.expiry_date) {
            if (itemReceive.quantity < itemTransfer.quantity) {
              items.push({
                item_id: itemTransfer.item_id,
                difference: itemTransfer.quantity - itemReceive.quantity
              })
            }
          }
        })
      })
      this.closeApprove({
        id: this.id,
        items: items
      }).then(response => {
        this.$notification.success('close form approved')
        this.accountingMemoJournalRequest()
        this.addHistories({ id: response.data.id, activity: 'Close Form Approved' })
          .catch(error => {
            console.log(error.message)
          })
      })
    }
  }
}
</script>
