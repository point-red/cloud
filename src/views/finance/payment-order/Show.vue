<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('payment order') | titlecase }}</router-link>
      <span class="breadcrumb-item active">{{ paymentOrder.form.number }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('payment order')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ paymentOrder.form.date | dateFormat }}
            </div>
          </p-form-row>

          <p-form-row
            id="payment-type"
            name="payment-type"
            :label="$t('payment type')">
            <div slot="body" class="col-lg-9">                
              {{ paymentOrder.payment_type.toLowerCase() }}
            </div>
          </p-form-row>

          <p-form-row
            id="payment-to"
            name="payment-to"
            :label="$t('payment to')">
            <div slot="body" class="col-lg-9 mt-5">
              {{ paymentOrder.paymentable_name }}
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-9 mt-5">
              {{ paymentOrder.form.notes }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h3>Detail</h3>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Account</th>
              <th>Notes</th>
              <th>Amount</th>
              <th style="min-width: 120px">Allocation</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in paymentOrder.details" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.account.number }} - {{ row.account.alias }}</td>
              <td>{{ row.notes }}</td>
              <td>{{ row.amount | numberFormat }}</td>
              <td>
                <template v-if="row.allocation">
                  {{ row.allocation.name }}
                </template>
              </td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td>{{ paymentOrder.amount | numberFormat }}</td>
              <td></td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h3 class="">Approver</h3>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Requested At</th>
              <th>Requested By</th>
              <th>Requested To</th>
              <th>Approval Status</th>
            </tr>
            <tr slot="p-body" v-for="(approver, index) in paymentOrder.form.approvals" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                {{ approver.requested_at | dateFormat('DD MMMM YYYY HH:mm') }}
              </td>
              <td>
                {{ approver.requested_by.first_name }} {{ approver.requested_by.last_name }} 
              </td>
              <td>
                {{ approver.requested_to.first_name }} {{ approver.requested_to.last_name }}
              </td>
              <td>
                <template v-if="approver.approval_at">
                  <span v-if="approver.approved == true" class="badge badge-primary">{{ $t('approved') }}</span>
                  <span v-if="approver.approved == false" class="badge badge-danger">{{ $t('rejected') }}</span>
                  {{ approver.approval_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </template>
                <template v-else>
                  <span class="badge badge-secondary">{{ $t('pending') }}</span>
                </template>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <div class="form-group row">
            <div class="col-md-12">
              
            </div>
          </div>
        </p-block-inner>        
      </p-block>
    </form>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
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
    ...mapGetters('financePaymentOrder', ['paymentOrder'])
  },
  methods: {
    ...mapActions('financePaymentOrder', ['find']),
    calculate: debounce (function () {
      var totalAmount = 0
      this.paymentOrder.details.forEach(function (element) {
        totalAmount += parseFloat(element.amount)
      })
      this.paymentOrder.amount = totalAmount
    }, 300)
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        with_archives: true,
        includes: 'details.account;details.allocation;form.approvals.requestedBy;form.approvals.requestedTo'
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
</script>
