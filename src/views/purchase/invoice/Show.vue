<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('purchase order') | titlecase }}</router-link>
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
              {{ purchaseOrder.date | dateFormat('DD MMMM YYYY HH:mm') }}
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

          <p-separator></p-separator>

          <h3 class="">Item</h3>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th>Item</th>
                <th>Notes</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Price</th>
                <th class="text-right">Discount</th>
                <th class="text-right">Total</th>
                <th>Allocation</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in purchaseOrder.items" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  [{{ row.item.code }}] {{ row.item.name }}
                </td>
                <td>
                  {{ row.notes }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.discount_percent | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.total | numberFormat }}
                </td>
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
                <td class="text-right">{{ purchaseOrder.total_quantity | numberFormat }}</td>
                <td></td>
                <td></td>
                <td class="text-right">{{ purchaseOrder.subtotal | numberFormat }}</td>
                <td></td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-6">
              <h3>Notes</h3>
              <hr>
              {{ purchaseOrder.form.notes }}
            </div>
            <div class="col-sm-6">
              <p-form-row
                id="discount"
                name="discount"
                :label="$t('discount')">
                <div slot="body" class="col-lg-9 mt-5">
                  <p-discount
                    id="discount"
                    name="discount"
                    v-model="purchaseOrder.discount_percent"
                    :readonly="true"
                    @keyup.native="calculate()"/>
                </div>
              </p-form-row>
              <p-form-row
                id="need-down-payment"
                name="need-down-payment"
                :label="$t('tax')">
                <div slot="body" class="col-lg-9">
                  <p-form-check-box
                    class="mb-0"
                    style="float:left"
                    id="need-down-payment"
                    name="need-down-payment"
                    :checked="purchaseOrder.type_of_tax == 'include'"
                    :description="$t('include tax')"/>
                  <p-form-check-box
                    id="need-down-payment"
                    name="need-down-payment"
                    :checked="purchaseOrder.type_of_tax == 'exclude'"
                    :description="$t('exclude tax')"/>
                  <p-form-number
                    :id="'total'"
                    :name="'total'"
                    :readonly="true"
                    v-model="purchaseOrder.tax"/>
                </div>
              </p-form-row>
              <p-form-row
                id="total"
                name="total"
                :label="$t('total')">
                <div slot="body" class="col-lg-9 mt-5">
                  <p-form-number
                    :id="'total'"
                    :name="'total'"
                    :readonly="true"
                    v-model="purchaseOrder.amount"/>
                </div>
              </p-form-row>
            </div>
          </div>

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
            <tr slot="p-body" v-for="(approval, index) in purchaseOrder.form.approvals" :key="index">
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
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrder'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseOrderRequest()
      }
    }
  },
  methods: {
    ...mapActions('purchaseOrder', ['find', 'delete']),
    purchaseOrderRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'supplier;items.item.units;items.allocation;services.service;services.allocation;form.approvals.requestedBy;form.approvals.requestedTo'
        }
      }).then(response => {
        this.isLoading = false
        this.calculate()
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    calculate () {
      var subtotal = 0
      var totalQuantity = 0
      this.purchaseOrder.items.forEach(function (element) {
        element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        subtotal += parseFloat(element.total)
        totalQuantity += parseFloat(element.quantity)
      })
      this.purchaseOrder.subtotal = subtotal
      this.purchaseOrder.total_quantity = totalQuantity
      this.purchaseOrder.tax_base = this.purchaseOrder.subtotal - (this.purchaseOrder.subtotal * this.purchaseOrder.discount_percent / 100)
      if (this.purchaseOrder.type_of_tax == 'include') {
        this.purchaseOrder.tax = this.purchaseOrder.tax_base * 10 / 100
        this.purchaseOrder.amount = this.purchaseOrder.tax_base
      } else if (this.purchaseOrder.type_of_tax == 'exclude') {
        this.purchaseOrder.tax = this.purchaseOrder.tax_base * 10 / 100
        this.purchaseOrder.amount = this.purchaseOrder.tax_base + this.purchaseOrder.tax
      } else {
        this.purchaseOrder.tax = 0
        this.purchaseOrder.amount = this.purchaseOrder.tax_base
      }
    },
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.$router.push('/purchase/order')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.purchaseOrderRequest()
  }
}
</script>
