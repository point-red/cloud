<template>
  <div>
    <breadcrumb v-if="deliveryNote">
      <breadcrumb-sales />
      <router-link
        to="/sales/delivery-note"
        class="breadcrumb-item"
      >
        {{ $t('delivery note') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ deliveryNote.form.number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div
      v-if="deliveryNote"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'sales.delivery-note.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <!-- <router-link
                  :to="{ name: 'sales.delivery-note.edit', params: { id: deliveryNote.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link> -->
                <!-- <button
                  v-if="deliveryNote.form.cancellation_status == null || deliveryNote.form.cancellation_status == -1"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="$refs.formRequestDelete.open()"
                >
                  {{ $t('delete') | uppercase }}
                </button> -->
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
              <h4>{{ $t('delivery note') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="deliveryNote.sales_order">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.sales_order.form.number }}</td>
                </tr>
                <tr v-if="deliveryNote">
                  <td class="font-weight-bold">
                    {{ $t('warehouse') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.warehouse.name }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('driver') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.driver }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('license plate') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.license_plate }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="deliveryNote.form.branch">
                {{ deliveryNote.form.branch.address | uppercase }}
                <br v-if="deliveryNote.form.branch.phone">{{ deliveryNote.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('customer') | uppercase }}
              </h6>
              {{ deliveryNote.customer_name | uppercase }}
              <div style="font-size:12px">
                {{ deliveryNote.customer_address | uppercase }}
                <br v-if="deliveryNote.customer_phone">{{ deliveryNote.customer_phone }}
                <br v-if="deliveryNote.customer_email">{{ deliveryNote.customer_email | uppercase }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                #
              </th>
              <th>Item</th>
              <th class="text-right">
                Quantity
              </th>
            </tr>
            <template v-for="(row, index) in deliveryNote.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.label }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
              </tr>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ deliveryNote.form.notes }}
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
                {{ deliveryNote.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ deliveryNote.form.created_by.full_name | uppercase }}
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
                <template v-if="deliveryNote.form.approval_at">
                  {{ deliveryNote.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ deliveryNote.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ deliveryNote.form.request_approval_to.email | lowercase }}
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
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
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
    ...mapGetters('salesDeliveryNote', ['deliveryNote']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.deliveryNoteRequest()
      }
    }
  },
  created () {
    this.deliveryNoteRequest()
  },
  methods: {
    ...mapActions('salesDeliveryNote', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    toggleMore () {
      const isMoreActive = this.deliveryNote.items.some(function (el, index) {
        return el.more === false
      })
      this.deliveryNote.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    deliveryNoteRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'warehouse;' +
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
      this.deliveryNote.items.forEach(function (element) {
        if (element.discount_percent > 0) {
          element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        } else if (element.discount_value > 0) {
          element.total = element.quantity * (element.price - element.discount_value)
        } else {
          element.total = element.quantity * element.price
        }
        subtotal += parseFloat(element.total)
      })
      this.deliveryNote.subtotal = subtotal
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
        this.deliveryNoteRequest()
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
        this.deliveryNoteRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.deliveryNoteRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/delivery-note')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.deliveryNoteRequest()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
