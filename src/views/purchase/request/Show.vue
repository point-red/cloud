<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/request" class="breadcrumb-item">{{ $t('purchase request') | uppercase }}</router-link>
      <template v-if="purchaseRequest.form.number">
        <span class="breadcrumb-item active">{{ purchaseRequest.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="purchaseRequest.origin" :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.origin.id }}" class="breadcrumb-item">
          {{ purchaseRequest.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('purchase request')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseRequest.form.number">
                {{ purchaseRequest.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ purchaseRequest.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ purchaseRequest.required_date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseRequest.supplier">
                {{ purchaseRequest.supplier.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="employee"
            name="employee"
            :label="$t('employee')">
            <div slot="body" class="col-lg-9">
              {{ purchaseRequest.employee.name }}
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-9">
              {{ purchaseRequest.form.notes }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5 class="">Item</h5>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th>Item</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Estimated Price</th>
                <th>Allocation</th>
                <th>Notes</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in purchaseRequest.items" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  [{{ row.item.code }}] {{ row.item.name }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.price | numberFormat }}
                </td>
                <td>
                  <template v-if="row.allocation">
                    {{ row.allocation.name }}
                  </template>
                </td>
                <td>
                  {{ row.notes }}
                </td>
              </tr>
            </point-table>
          </p-block-inner>

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
            <tr slot="p-body" v-for="(approver, index) in purchaseRequest.approvers" :key="index">
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

          <h5 v-if="purchaseRequest.archives != undefined && purchaseRequest.archives.length > 0">Archives</h5>

          <point-table v-if="purchaseRequest.archives != undefined && purchaseRequest.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in purchaseRequest.archives" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <template v-if="archived.id != id">
                  <router-link :to="{ name: 'purchase.request.show', params: { id: archived.id }}">
                    {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                  </router-link>
                </template>
                <template v-else>
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </template>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>

          <router-link
            :to="{ path: '/purchase/request/' + purchaseRequest.id + '/edit', params: { id: purchaseRequest.id }}"
            v-if="$permission.has('update purchase request') && $formRules.allowedToUpdate(purchaseRequest.form)"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <a
            href="javascript:void(0)"
            @click="onDelete"
            class="btn btn-sm btn-danger mr-5">
            Cancel
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
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequest'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseRequestRequest()
      }
    }
  },
  methods: {
    ...mapActions('purchaseRequest', ['find', 'delete']),
    purchaseRequestRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'employee;supplier;items.item;items.allocation;services.service;services.allocation;approvers.requestedBy;approvers.requestedTo'
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
        this.$router.push('/purchase/request')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.purchaseRequestRequest()
  }
}
</script>
