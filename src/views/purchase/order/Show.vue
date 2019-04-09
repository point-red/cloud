<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/order" class="breadcrumb-item">Purchase Order</router-link>
      <template v-if="purchaseOrder.form.number">
        <span class="breadcrumb-item active">{{ purchaseOrder.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="purchaseOrder.origin" :to="{ name: 'purchase.order.show', params: { id: purchaseOrder.origin.id }}" class="breadcrumb-item">
          {{ purchaseOrder.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('purchase order')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseOrder.form.number">
                {{ purchaseOrder.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ purchaseOrder.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ purchaseOrder.required_date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseOrder.supplier">
                {{ purchaseOrder.supplier.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="employee"
            name="employee"
            :label="$t('employee')">
            <div slot="body" class="col-lg-9">
              {{ purchaseOrder.employee.name }}
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-9">
              {{ purchaseOrder.form.notes }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h3 class="">Item</h3>

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
              <tr slot="p-body" v-for="(row, index) in purchaseOrder.items" :key="index">
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

          <h3 class="">Approver</h3>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Ordered At</th>
              <th>Ordered By</th>
              <th>Ordered To</th>
              <th>Approval Status</th>
            </tr>
            <tr slot="p-body" v-for="(approver, index) in purchaseOrder.approvers" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                {{ approver.ordered_at | dateFormat('DD MMMM YYYY HH:mm') }}
              </td>
              <td>
                {{ approver.ordered_by.first_name }} {{ approver.ordered_by.last_name }} 
              </td>
              <td>
                {{ approver.ordered_to.first_name }} {{ approver.ordered_to.last_name }}
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

          <h3 v-if="purchaseOrder.archives != undefined && purchaseOrder.archives.length > 0">Archives</h3>

          <point-table v-if="purchaseOrder.archives != undefined && purchaseOrder.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in purchaseOrder.archives" :key="index">
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

          <router-link
            :to="{ path: '/purchase/order/' + purchaseOrder.id + '/edit', params: { id: purchaseOrder.id }}"
            v-if="$permission.has('update purchase order') && $formRules.allowedToUpdate(purchaseOrder.form)"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
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
    ...mapGetters('purchaseOrder', ['purchaseOrder'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseOrderOrder()
      }
    }
  },
  methods: {
    ...mapActions('purchaseOrder', ['find']),
    purchaseOrderOrder () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'employee;supplier;items.item;items.allocation;services.service;services.allocation;approvers.orderedBy;approvers.orderedTo'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.purchaseOrderOrder()
  }
}
</script>
