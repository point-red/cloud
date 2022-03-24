<template>
  <div>
    <breadcrumb v-if="cashAdvance.archived_at == null">
      <breadcrumb-finance />
      <router-link
        to="/finance/cash-advance"
        class="breadcrumb-item"
      >
        {{ $t('cash advance') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ cashAdvance.form.number }}</span>
    </breadcrumb>
    <breadcrumb v-else>
      <breadcrumb-finance />
      <router-link
        to="/finance/cash-advance"
        class="breadcrumb-item"
      >
        {{ $t('cash advance') | uppercase }}
      </router-link>
      <span class="breadcrumb-item">{{ $t('archive') | uppercase }}</span>
    </breadcrumb>

    <div
      v-if="cashAdvance.archived_at == null && cashAdvance.form.cancellation_status != 1 && cashAdvance.form.approval_status == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending approval warning', { form: 'cash advance', approvedBy: cashAdvance.form.request_approval_to.full_name }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve cash advance')">
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            @click="onApprove"
          >
            {{ $t('approve') | uppercase }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="$refs.formApprovalReject.open()"
          >
            {{ $t('reject') | uppercase }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="cashAdvance.archived_at == null && cashAdvance.form.cancellation_status == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending cancellation warning', { form: 'cash advance', approvedBy: cashAdvance.form.request_approval_to.full_name }) | uppercase }}
        </p>
        <p
          class="mb-0"
          style="font-size: 10px"
        >
          <b>{{ $t('reason') | uppercase }}</b> : <pre>{{ cashAdvance.form.request_cancellation_reason | uppercase }}</pre>
        </p>
        <hr>
        <div v-if="$permission.has('approve cash advance')">
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            @click="onCancellationApprove"
          >
            {{ $t('approve') | uppercase }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="$refs.formCancellationReject.open()"
          >
            {{ $t('reject') | uppercase }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="cashAdvance.archived_at == null && cashAdvance.form.approval_status == -1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('approval rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ cashAdvance.form.approval_reason }}</pre>
        </div>
      </div>
    </div>

    <div
      v-if="cashAdvance.form.cancellation_status == -1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('cancellation request rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ cashAdvance.form.cancellation_approval_reason }}</pre>
        </div>
      </div>
    </div>

    <div
      v-if="cashAdvance.archived_at == null && cashAdvance.form.cancellation_status == 1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('canceled') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ cashAdvance.form.request_cancellation_reason }}</pre>
        </div>
      </div>
    </div>

    <form class="row">
      <p-block :title="$t('cash advance')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div
              v-if="cashAdvance.archived_at != null"
              class="col-sm-12"
            >
              <h4 class="mb-0">
                {{ $t('Archive') | uppercase }}
              </h4>
            </div>
            <div
              v-else
              class="col-sm-12"
            >
              <div class="text-right">
                <a
                  v-if="cashAdvance.employee.emails.length!=0"
                  :href="'mailto:' + cashAdvance.employee.emails[0].email + '?Subject=Invoice Cash Advance&body=Content Body'"
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Print cash advance"
                >
                  <i class="fa fa-paper-plane" />
                </a>
                <button
                  type="button"
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Print cash advance"
                  @click="$refs.printForm.open()"
                >
                  <i class="si si-printer" />
                </button>
                <router-link
                  v-if="$permission.has('create cash advance')"
                  :to="{ name: 'finance.cash-advance.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  v-if="$permission.has('update cash advance')"
                  :to="{ name: 'finance.cash-advance.edit', params: { id: id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="$permission.has('delete cash advance')
                    && (cashAdvance.form.request_cancellation_to == null
                      || cashAdvance.form.cancellation_status == -1)"
                  type="button"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="$refs.formRequestDelete.open()"
                >
                  {{ $t('delete') | uppercase }}
                </button>
                <button
                  v-if="cashAdvance.form.approval_status == 1 && !cashAdvance.form.done && cashAdvance.form.cancellation_status != 1"
                  type="button"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="onRefund()"
                >
                  {{ $t('refund') | uppercase }}
                </button>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('cash advance') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ cashAdvance.form.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td v-if="cashAdvance.archived_at != null">
                    {{ cashAdvance.form.edited_number }}
                  </td>
                  <td v-else>
                    {{ cashAdvance.form.number }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="cashAdvance.form.branch">
                {{ cashAdvance.form.branch.address | uppercase }} <br v-if="cashAdvance.form.branch.address">
                {{ cashAdvance.form.branch.phone | uppercase }} <br v-if="cashAdvance.form.branch.phone">
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('to') | uppercase }} :
              </h6>
              {{ cashAdvance.employee.name }}
            </div>
          </div>

          <hr>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">
                Account
              </th>
              <th>Notes</th>
              <th class="text-right">
                Amount
              </th>
            </tr>
            <tr
              v-for="(row, index) in cashAdvance.details"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>{{ row.account.number }} - {{ row.account.alias }}</td>
              <td>{{ row.notes }}</td>
              <td class="text-right">
                {{ row.amount | numberFormat }}
              </td>
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td class="text-right">
                {{ cashAdvance.amount | numberFormat }}
              </td>
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ cashAdvance.form.notes }}
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
                {{ cashAdvance.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ cashAdvance.form.created_by.full_name | uppercase }}
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
                <template v-if="cashAdvance.form.approval_at">
                  {{ cashAdvance.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ cashAdvance.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:9px">
                {{ cashAdvance.form.request_approval_to.email | uppercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
    <m-form-approval-reject
      ref="formApprovalReject"
      @reject="onReject($event)"
    />
    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />
    <m-form-cancellation-reject
      ref="formCancellationReject"
      @reject="onCancellationReject($event)"
    />
    <print-form
      ref="printForm"
      :cash="cashAdvance"
      @history="storeHistoryRecord($event)"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import PointTable from 'point-table-vue'
import PrintForm from './PrintForm'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbFinance,
    PrintForm
  },
  data () {
    return {
      id: this.$route.params.id,
      apporval: this.$route.query.approval,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('financeCashAdvance', ['cashAdvance']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.search()
  },
  mounted () {
    if (this.apporval == 'approve') {
      this.onApprove()
    } else if (this.apporval == 'reject') {
      this.onReject()
    }
  },
  methods: {
    ...mapActions('financeCashAdvance', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      refund: 'refund',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      storeHistory: 'storeHistory'
    }),
    calculate: debounce(function () {
      var totalAmount = 0
      this.cashAdvance.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.cashAdvance.amount = totalAmount
    }, 300),
    onDelete (reason) {
      if (reason.length == 0) {
        this.$notification.error('reason delete required')
      } else {
        this.delete({
          id: this.id,
          data: {
            reason: reason,
            activity: 'Request Cancellation'
          }
        }).then(response => {
          this.$notification.success('cancel success')
          this.search()
        }).catch(error => {
          this.$notification.error(error.message)
        })
      }
    },
    onApprove () {
      this.approve({
        id: this.id,
        activity: 'Approved'
      }).then(response => {
        this.$notification.success('approval approved')
        this.search()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason,
        activity: 'Rejected'
      }).then(response => {
        this.$notification.success('approval rejected')
        this.search()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id,
        activity: 'Cancellation Approve'
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/finance/cash-advance')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason,
        activity: 'Cancellation Rejected'
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.search()
      })
    },
    onRefund () {
      this.refund({
        id: this.id,
        activity: 'Refunded'
      }).then(response => {
        this.$notification.success('refund success')
        this.search()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    search () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'form;' +
            'employee.emails;' +
            'details.account;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.isLoading = false
        this.calculate()
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    storeHistoryRecord (history) {
      this.storeHistory({
        id: this.id,
        activity: history
      }).then(response => {
        this.$notification.success('history recorded : ' + history)
      }).catch(error => {
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
