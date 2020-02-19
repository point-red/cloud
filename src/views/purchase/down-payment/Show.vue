<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('down payment') | titlecase }}</router-link>
      <template v-if="downPayment.form && downPayment.form.number">
        <span class="breadcrumb-item active">{{ downPayment.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="downPayment.form && downPayment.origin" :to="{ name: 'purchase.order.show', params: { id: downPayment.origin.id }}" class="breadcrumb-item">
          {{ downPayment.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('down payment')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="downPayment.form && downPayment.form.number">
                {{ downPayment.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ downPayment.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ downPayment.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9">
              <template v-if="downPayment.supplier">
                {{ downPayment.supplier.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="amount"
            name="amount"
            :label="$t('amount')">
            <div slot="body" class="col-lg-9">
              <template v-if="downPayment.amount">
                {{ downPayment.amount | numberFormat }}
              </template>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5 class="">Approver</h5>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Requested At</th>
              <th>Requested By</th>
              <th>Requested To</th>
              <th>Approval Status</th>
            </tr>
            <tr slot="p-body" v-for="(approval, index) in downPayment.form.approvals" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                {{ approval.requested_at | dateFormat('DD MMMM YYYY HH:mm') }}
              </td>
              <td>
                {{ approval.requested_by.first_name }} {{ approval.requested_by.last_name }}
              </td>
              <td>
                {{ approval.requested_to.first_name }} {{ approval.requested_to.last_name }}
              </td>
              <td>
                <template v-if="approval.approval_at">
                  <span v-if="approval.approved == true" class="badge badge-primary">{{ $t('approved') }}</span>
                  <span v-if="approval.approved == false" class="badge badge-danger">{{ $t('rejected') }}</span>
                  {{ approval.approval_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </template>
                <template v-else>
                  <span class="badge badge-secondary">{{ $t('pending') }}</span>
                </template>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h5 v-if="downPayment.archives != undefined && downPayment.archives.length > 0">Archives</h5>

          <point-table v-if="downPayment.archives != undefined && downPayment.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in downPayment.archives" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'purchase.order.show', params: { id: archived.id }}">
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </router-link>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>

          <a
            href="javascript:void(0)"
            @click="onDelete"
            class="btn btn-sm btn-danger mr-5">
            {{ $t('cancel') | uppercase }}
          </a>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
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
    ...mapGetters('purchaseDownPayment', ['downPayment'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.downPaymentRequest()
      }
    }
  },
  methods: {
    ...mapActions('purchaseDownPayment', ['find', 'delete']),
    downPaymentRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'supplier;form.approvals.requestedBy;form.approvals.requestedTo'
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
        this.$router.push('/purchase/down-payment')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.downPaymentRequest()
  }
}
</script>
