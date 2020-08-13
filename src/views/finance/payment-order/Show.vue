<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ paymentOrder.form.number }}</span>
    </breadcrumb>

    <div
      v-if="paymentOrder.form.cancellation_status != 0 && paymentOrder.form.approval_status == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending approval warning', { form: 'payment order', approvedBy: paymentOrder.form.request_approval_to.full_name }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve payment order')">
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
      v-if="paymentOrder.form.cancellation_status == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending cancellation warning', { form: 'payment order', approvedBy: paymentOrder.form.request_approval_to.full_name }) | uppercase }}
        </p>
        <p
          class="mb-0"
          style="font-size: 10px"
        >
          <b>{{ $t('reason') | uppercase }}</b> : <pre>{{ paymentOrder.form.request_cancellation_reason | uppercase }}</pre>
        </p>
        <hr>
        <div v-if="$permission.has('approve payment order')">
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
      v-if="paymentOrder.form.approval_status == -1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('approval rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ paymentOrder.form.approval_reason }}</pre>
        </div>
      </div>
    </div>

    <div
      v-if="paymentOrder.form.cancellation_status == -1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('cancellation request rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ paymentOrder.form.cancellation_approval_reason }}</pre>
        </div>
      </div>
    </div>

    <div
      v-if="paymentOrder.form.cancellation_status == 1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('canceled') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ paymentOrder.form.request_cancellation_reason }}</pre>
        </div>
      </div>
    </div>

    <form class="row">
      <p-block :title="$t('payment order')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'finance.payment-order.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <!-- <router-link :to="{ name: 'finance.payment-order.edit', params: { id: id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link> -->
                <button
                  v-if="paymentOrder.form.cancellation_status != 1"
                  type="button"
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
              <h4>{{ $t('payment order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ paymentOrder.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('required date') | uppercase }}
                  </td>
                  <td>{{ paymentOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('payment type') | uppercase }}
                  </td>
                  <td>{{ paymentOrder.payment_type }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="paymentOrder.form.branch">
                {{ paymentOrder.form.branch.address | uppercase }} <br v-if="paymentOrder.form.branch.address">
                {{ paymentOrder.form.branch.phone | uppercase }} <br v-if="paymentOrder.form.branch.phone">
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('to') | uppercase }} :
              </h6>
              {{ paymentOrder.paymentable.label }}
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
              <th style="min-width: 120px">
                Allocation
              </th>
              <th class="text-right">
                Amount
              </th>
            </tr>
            <tr
              v-for="(row, index) in paymentOrder.details"
              slot="p-body"
              :key="index"
            >
              <th>{{ index + 1 }}</th>
              <td>{{ row.account.number }} - {{ row.account.alias }}</td>
              <td>{{ row.notes }}</td>
              <td>
                <template v-if="row.allocation">
                  {{ row.allocation.name }}
                </template>
              </td>
              <td class="text-right">
                {{ row.amount | numberFormat }}
              </td>
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                {{ paymentOrder.amount | numberFormat }}
              </td>
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ paymentOrder.form.notes }}
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
                {{ paymentOrder.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ paymentOrder.form.created_by.full_name | uppercase }}
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
                <template v-if="paymentOrder.form.approval_at">
                  {{ paymentOrder.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ paymentOrder.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:9px">
                {{ paymentOrder.form.request_approval_to.email | uppercase }}
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
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('financePaymentOrder', ['paymentOrder']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('financePaymentOrder', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    calculate: debounce(function () {
      var totalAmount = 0
      this.paymentOrder.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.paymentOrder.amount = totalAmount
    }, 300),
    onDelete (reason) {
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.$notification.success('cancel success')
        this.search()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approval approved')
        this.search()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('approval rejected')
        this.search()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/finance/payment-order')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.search()
      }).catch(error => {
        console.log(error.message)
      })
    },
    search () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'form;' +
            'paymentable;' +
            'details.account;' +
            'details.allocation;' +
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
    }
  }
}
</script>
