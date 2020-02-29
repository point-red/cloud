<template>
  <div>
    <breadcrumb v-if="purchaseRequest">
      <breadcrumb-purchase/>
      <router-link to="/purchase/request" class="breadcrumb-item">{{ $t('purchase request') | uppercase }}</router-link>
      <template v-if="purchaseRequest.form.number">
        <span class="breadcrumb-item active">{{ purchaseRequest.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="purchaseRequest.origin" :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.origin.id }}" class="breadcrumb-item">
          {{ purchaseRequest.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <purchase-menu/>

    <div class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="purchaseRequest.form.approved == null && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
          {{ $t('pending approval warning', { form: 'purchase request', approvedBy: purchaseRequest.approvers[0].requested_to.first_name + ' ' + purchaseRequest.approvers[0].requested_to.last_name }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve purchase request')">
          <button type="button" @click="onApprove" class="btn btn-sm btn-primary mr-5">{{ $t('approve') | uppercase }}</button>
          <button type="button" @click="$refs.formReject.show()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
          <m-form-reject id="form-reject" ref="formReject" @reject="onReject($event)"></m-form-reject>
        </div>
      </div>
    </div>

    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="purchaseRequest.form.approved == 0 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> {{ purchaseRequest.form.approvals[0].reason }}</div>
      </div>
    </div>

    <div class="row" v-if="purchaseRequest">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link :to="{ name: 'purchase.request.create' }" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link :to="{ name: 'purchase.request.edit', params: { id: purchaseRequest.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link>
              </div>
              <hr>
              <h4 class="text-center">{{ $t('purchase request') | uppercase }}</h4>
              <hr>
              <div class="float-sm-right text-right">
                <h6 class="mb-0">{{ authUser.tenant_name | uppercase }}</h6>
                {{ authUser.tenant_address | uppercase }} <br v-if="authUser.tenant_address">
                {{ authUser.tenant_phone | uppercase }} <br v-if="authUser.tenant_phone">
              </div>
              <div class="float-sm-left">
                <h6 class="mb-0 ">{{ $t('supplier') | uppercase }}</h6>
                {{ purchaseRequest.supplier_name | uppercase }}
                <div style="font-size:12px">
                  {{ purchaseRequest.supplier_address | uppercase }}
                  <br v-if="purchaseRequest.supplier_phone">{{ purchaseRequest.supplier_phone }}
                  <br v-if="purchaseRequest.supplier_email">{{ purchaseRequest.supplier_email | uppercase }}
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div><b>{{ $t('form number') | uppercase }} : </b>{{ purchaseRequest.form.number }}</div>
          <div><b>{{ $t('required date') | uppercase }} : </b>{{ purchaseRequest.required_date | dateFormat('DD MMMM YYYY') }}</div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">#</th>
              <th>Item</th>
              <th>Notes</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Estimated Price</th>
              <th width="50px"></th>
            </tr>
            <template v-for="(row, index) in purchaseRequest.items">
              <tr slot="p-body" :key="index">
                <th class="text-center">{{ index + 1 }}</th>
                <td>
                  <router-link
                    :to="'/master/item/' + row.item_id"
                    v-if="$permission.has('read item')">
                    {{ row.item.name }}
                  </router-link>
                </td>
                <td>{{ row.notes }}</td>
                <td class="text-right">{{ row.quantity | numberFormat }} {{ row.unit }}</td>
                <td class="text-right">{{ row.price | numberFormat }}</td>
                <td>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="row.more = !row.more">
                    <i class="fa fa-ellipsis-h"/>
                  </button>
                </td>
              </tr>
              <template v-if="row.more">
              <tr slot="p-body" :key="'ext-'+index" class="bg-gray-light">
                <th class="bg-gray-light"></th>
                <td colspan="4">
                  <p-form-row
                    id="allocation"
                    name="allocation"
                    :label="$t('allocation')">
                    <div slot="body">
                      <template v-if="row.allocation">{{ row.allocation.name }}</template>
                    </div>
                  </p-form-row>
                </td>
              </tr>
              </template>
            </template>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right"><b>{{ totalPrice | numberFormat }}</b></td>
              <td></td>
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ purchaseRequest.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ purchaseRequest.form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ purchaseRequest.form.created_by.first_name | uppercase }} {{ purchaseRequest.form.created_by.last_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="purchaseRequest.approvers[0].approval_at">
                  {{ purchaseRequest.approvers[0].approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseRequest.approvers[0].requested_to.first_name | uppercase }} {{ purchaseRequest.approvers[0].requested_to.last_name | uppercase }}
              <div style="font-size:11px">{{ purchaseRequest.approvers[0].requested_to.email | lowercase }}</div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
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
      isLoading: false,
      totalPrice: null
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
  methods: {
    ...mapActions('purchaseRequest', ['find', 'delete', 'approve', 'reject']),
    findPurchaseRequisition () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'supplier;' +
            'items.item;' +
            'items.allocation;' +
            'services.service;' +
            'services.allocation;' +
            'form.approvals;' +
            'approvers.requestedBy;' +
            'approvers.requestedTo'
        }
      }).then(response => {
        this.isLoading = false
        this.purchaseRequest.items.forEach((element, index) => {
          this.$set(this.purchaseRequest.items[index], 'more', false)
          this.totalPrice += element.price
        })
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
        this.$router.push('/purchase/request')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.purchaseRequest.errors.record(error.errors)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.purchaseRequest.form.approved = response.data.form.approved
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        console.log(response.data.form)
        this.$notification.success('reject success')
        this.purchaseRequest.form.approved = response.data.form.approved
        this.purchaseRequest.form.approvals[0].reason = response.data.form.approvals[0].reason
      })
    }
  },
  created () {
    this.findPurchaseRequisition()
  }
}
</script>