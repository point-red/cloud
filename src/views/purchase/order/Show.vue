<template>
  <div>
    <breadcrumb v-if="purchaseOrder">
      <breadcrumb-purchase/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('purchase order') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ purchaseOrder.form.number | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <div class="row" v-if="purchaseOrder">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link :to="{ name: 'purchase.order.create' }" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link :to="{ name: 'purchase.order.edit', params: { id: purchaseOrder.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('purchase order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td width="150px" class="font-weight-bold">{{ $t('form number') | uppercase }}</td>
                  <td>{{ purchaseOrder.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">{{ $t('date') | uppercase }}</td>
                  <td>{{ purchaseOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">{{ authUser.tenant_name | uppercase }}</h6>
              <template v-if="purchaseOrder.form.branch">
                {{ purchaseOrder.form.branch.address | uppercase }}
                <br v-if="purchaseOrder.form.branch.phone">{{ purchaseOrder.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">{{ $t('supplier') | uppercase }}</h6>
              {{ purchaseOrder.supplier_name | uppercase }}
              <div style="font-size:12px">
                {{ purchaseOrder.supplier_address | uppercase }}
                <br v-if="purchaseOrder.supplier_phone">{{ purchaseOrder.supplier_phone }}
                <br v-if="purchaseOrder.supplier_email">{{ purchaseOrder.supplier_email | uppercase }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">#</th>
              <th>Item</th>
              <th>Notes</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Discount</th>
              <th class="text-right">Total</th>
              <th width="50px"></th>
            </tr>
            <template v-for="(row, index) in purchaseOrder.items">
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
                <td class="text-right">{{ row.discount_percent | numberFormat }}</td>
                <td class="text-right">{{ row.quantity * row.price - row.discount_value | numberFormat }}</td>
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
                    <div slot="body" class="mt-5">
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
              <td></td>
              <td class="text-right"><b>{{ $t('subtotal') | uppercase }}</b></td>
              <td class="text-right"><b>{{ purchaseOrder.subtotal | numberFormat }}</b></td>
              <td></td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right"><b>{{ $t('discount') | uppercase }}</b></td>
              <td class="text-right"><b>{{ purchaseOrder.discount_value | numberFormat }}</b></td>
              <td></td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right"><b>{{ $t('tax') | uppercase }}</b></td>
              <td class="text-right"><b>{{ purchaseOrder.tax | numberFormat }}</b></td>
              <td></td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right"><b>{{ $t('total') | uppercase }}</b></td>
              <td class="text-right"><b>{{ purchaseOrder.amount | numberFormat }}</b></td>
              <td></td>
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ purchaseOrder.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ purchaseOrder.form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ purchaseOrder.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="purchaseOrder.form.approval_at">
                  {{ purchaseOrder.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseOrder.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">{{ purchaseOrder.form.request_approval_to.email | lowercase }}</div>
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
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrder']),
    ...mapGetters('auth', ['authUser']),
    totalPrice () {
      return this.purchaseOrder.items.reduce((carry, item) => {
        return carry + item.quantity * (item.price - item.discount_value)
      }, 0)
    }
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
    ...mapActions('purchaseOrder', ['find', 'delete', 'approve', 'reject']),
    purchaseOrderRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'supplier;' +
            'items.item;' +
            'items.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.calculate()
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    calculate () {
      var subtotal = 0
      this.purchaseOrder.items.forEach(function (element) {
        element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        subtotal += parseFloat(element.total)
      })
      this.purchaseOrder.subtotal = subtotal
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
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.purchaseOrder.form.approval_status = response.data.form.approval_status
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        approval_reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.purchaseOrder.form.approval_status = response.data.form.approval_status
        this.purchaseOrder.form.approval_reason = response.data.form.approval_reason
      })
    }
  },
  created () {
    this.purchaseOrderRequest()
  }
}
</script>
