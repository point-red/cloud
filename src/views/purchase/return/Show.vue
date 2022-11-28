<template>
  <div>
    <breadcrumb v-if="purchaseReturn">
      <breadcrumb-purchase />
      <router-link
        to="/purchase/return"
        class="breadcrumb-item"
      >
        {{ $t('purchase return') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ purchaseReturn.form.number | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchaseReturn.form.requestApprovalTo.full_name"
      :cancellation-status="purchaseReturn.form.cancellationStatus"
      :approval-status="purchaseReturn.form.approvalStatus"
      :approval-reason="purchaseReturn.form.approvalReason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchaseReturn.form.cancellationStatus"
      :cancellation-approval-reason="purchaseReturn.form.cancellationApprovalReason"
      :request-cancellation-reason="purchaseReturn.form.requestCancellationReason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="purchaseReturn"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'purchase.return.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'purchase.return.edit', params: { id: purchaseReturn.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="purchaseReturn.form.cancellationStatus == null || purchaseReturn.form.cancellationStatus == -1"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="$refs.formRequestDelete.open()"
                >
                  {{ $t('delete') | uppercase }}
                </button>
                <m-form-request-delete
                  ref="formRequestDelete"
                  @delete="onDelete($event)"
                />
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('purchase return') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ purchaseReturn.form.number }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form reference') | uppercase }}
                  </td>
                  <td>{{ purchaseReturn.purchaseInvoice.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('warehouse') | uppercase }}
                  </td>
                  <td>{{ purchaseReturn.warehouse.name }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="purchaseReturn.form.branch">
                {{ purchaseReturn.form.branch.address | uppercase }}
                <br v-if="purchaseReturn.form.branch.phone">{{ purchaseReturn.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('supplier') | uppercase }}
              </h6>
              {{ purchaseReturn.supplierName | uppercase }}
              <div style="font-size:12px">
                {{ purchaseReturn.supplierAddress | uppercase }}
                <br v-if="purchaseReturn.supplierPhone">{{ purchaseReturn.supplierPhone }}
                <br v-if="purchaseReturn.supplierEmail">{{ purchaseReturn.supplierEmail | uppercase }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                No
              </th>
              <th>Item</th>
              <th class="text-right">
                Quantity Invoice
              </th>
              <th class="text-right">
                Quantity Return
              </th>
              <th class="text-right">
                Price
              </th>
              <th class="text-right">
                Discount
              </th>
              <th class="text-right">
                Total
              </th>
              <th class="text-center">
                Allocation
              </th>
            </tr>
            <template v-for="(row, index) in purchaseReturn.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.label }}</td>
                <td class="text-right">
                  {{ row.quantityInvoice | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.discountValue | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.quantity * (row.price - row.discountValue) | numberFormat }}
                </td>
                <td class="text-center">
                  {{ row.allocation.name }}
                </td>
              </tr>
            </template>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('subtotal') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ subTotal | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('tax base') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ subTotal | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('tax') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ purchaseReturn.tax | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('total') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ purchaseReturn.amount | numberFormat }}</b>
              </td>
              <td />
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ purchaseReturn.form.notes }}
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
                {{ purchaseReturn.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ purchaseReturn.form.createdBy.fullName | uppercase }}
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
                <template v-if="purchaseReturn.form.approvalAt">
                  {{ purchaseReturn.form.approvalAt | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseReturn.form.requestApprovalTo.fullName | uppercase }}
              <div style="font-size:11px">
                {{ purchaseReturn.form.requestApprovalTo.email | lowercase }}
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
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters } from 'vuex'

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
      isDeleting: false,
      purchaseReturn: {
        id: 1,
        purchaseInvoiceId: 1,
        supplierId: 1,
        supplierName: 'Supplier',
        supplierAddress: '-',
        tax: 7272.727272727279,
        amount: 80000,
        warehouseId: 1,
        items: [{
          id: 1,
          purchaseReturnId: 1,
          itemId: 1,
          quantityInvoice: 90,
          quantity: 10,
          price: 10000,
          discountValue: 2000,
          unit: 'PCS',
          converter: 1,
          allocationId: 1,
          item: {
            label: 'Item'
          },
          allocation: {
            name: 'Musi'
          }
        }],
        warehouse: {
          name: 'CENTRAL'
        },
        form: {
          id: 1,
          branchId: 1,
          date: '2022-11-26 10:00:00',
          number: 'PR22110018',
          notes: 'note',
          createdBy: {
            id: 1,
            name: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            fullName: 'admin admin',
            email: 'admin@point.net'
          },
          requestApprovalTo: {
            id: 1,
            name: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            email: 'admin@point.net'
          }
        },
        purchaseInvoice: {
          id: 1,
          form: {
            number: 'PI22110018'
          }
        }
      }
    }
  },
  computed: {
    // ...mapGetters('purchaseReturn', ['purchaseReturn']),
    ...mapGetters('auth', ['authUser']),
    subTotal () {
      var subtotal = 0
      this.purchaseReturn.items.forEach(function (element) {
        const total = element.quantity * (element.price - element.discountValue)
        subtotal += parseFloat(total)
      })
      return subtotal
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseReturnRequest()
      }
    }
  },
  created () {
    this.purchaseReturnRequest()
  },
  methods: {
    // ...mapActions('purchaseReturn', {
    //   find: 'find',
    //   delete: 'delete',
    //   approve: 'approve',
    //   reject: 'reject',
    //   cancellationApprove: 'cancellationApprove',
    //   cancellationReject: 'cancellationReject'
    // }),
    purchaseReturnRequest () {
      // this.isLoading = true
      // this.find({
      //   id: this.id,
      //   params: {
      //     with_archives: true,
      //     with_origin: true,
      //     includes: 'supplier;' +
      //       'items.item;' +
      //       'items.allocation;' +
      //       'form.createdBy;' +
      //       'form.requestApprovalTo;' +
      //       'form.branch'
      //   }
      // }).then(response => {
      //   this.calculate()
      // }).catch(error => {
      //   this.$notification.error(error.message)
      // }).finally(() => {
      //   this.isLoading = false
      // })
    },
    calculate () {
      var subtotal = 0
      this.purchaseReturn.items.forEach(function (element) {
        if (element.discount_percent > 0) {
          element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        } else if (element.discount_value > 0) {
          element.total = element.quantity * (element.price - element.discount_value)
        } else {
          element.total = element.quantity * element.price
        }
        subtotal += parseFloat(element.total)
      })
      this.purchaseReturn.subtotal = subtotal
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
        this.purchaseInvoiceRequest()
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
        this.purchaseInvoiceRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.purchaseInvoiceRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/purchase/invoice')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.purchaseInvoiceRequest()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
