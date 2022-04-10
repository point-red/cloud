<template>
  <div>
    <breadcrumb v-if="inventoryAudit">
      <breadcrumb-inventory />
      <router-link
        to="/inventory/audit"
        class="breadcrumb-item"
      >
        {{ $t('inventory audit') | uppercase }}
      </router-link>
      <template v-if="inventoryAudit.form.number">
        <span class="breadcrumb-item active">{{ inventoryAudit.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link
          v-if="inventoryAudit.origin"
          :to="{ name: 'inventory.audit.show', params: { id: inventoryAudit.origin.id }}"
          class="breadcrumb-item"
        >
          {{ inventoryAudit.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <!-- <div class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="inventoryAudit.form.approved == null && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
          {{ $t('pending approval warning', { form: 'inventory audit', approvedBy: inventoryAudit.form.request_approval_to.first_name + ' ' + inventoryAudit.form.request_approval_to.last_name }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve inventory audit')">
          <button type="button" @click="onApprove" class="btn btn-sm btn-primary mr-5">{{ $t('approve') | uppercase }}</button>
          <button type="button" @click="$refs.formReject.show()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
          <m-form-approval-reject id="form-reject" ref="formReject" @reject="onReject($event)"></m-form-approval-reject>
        </div>
      </div>
    </div> -->

    <!-- <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="inventoryAudit.form.approved == 0 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> {{ inventoryAudit.form.approvals[0].reason }}</div>
      </div>
    </div> -->

    <div
      v-if="inventoryAudit"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'inventory.audit.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <!-- <router-link :to="{ name: 'inventory.audit.edit', params: { id: inventoryAudit.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link> -->
              </div>
              <hr>
              <h4 class="text-center m-0">
                {{ $t('inventory audit') | uppercase }}
              </h4>
              <p class="text-center m-0">
                {{ inventoryAudit.form.number }}
              </p>
              <hr>
              <div class="float-sm-right text-right">
                <h6 class="mb-0">
                  {{ authUser.tenant_name | uppercase }}
                </h6>
                {{ authUser.tenant_address | uppercase }} <br v-if="authUser.tenant_address">
                {{ authUser.tenant_phone | uppercase }} <br v-if="authUser.tenant_phone">
              </div>
              <div class="float-sm-left">
                <h6 class="mb-0 ">
                  {{ $t('warehouse') | uppercase }}
                </h6>
                {{ inventoryAudit.warehouse.name }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th
                class="text-center"
                width="50px"
              >
                #
              </th>
              <th>Item</th>
              <th>Notes</th>
              <th>Production Number</th>
              <th class="text-right">
                Quantity
              </th>
            </tr>
            <template v-for="(row, index) in inventoryAudit.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.label }}</td>
                <td>{{ row.notes }}</td>
                <td>{{ row.production_number }}</td>
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
                {{ inventoryAudit.form.notes }}
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
                {{ inventoryAudit.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ inventoryAudit.form.created_by.full_name | uppercase }}
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
                <template v-if="inventoryAudit.form.request_approval_at">
                  {{ inventoryAudit.form.request_approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ inventoryAudit.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ inventoryAudit.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
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
    ...mapGetters('inventoryAudit', ['inventoryAudit']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.findInventoryAudit()
      }
    }
  },
  created () {
    this.findInventoryAudit()
  },
  methods: {
    ...mapActions('inventoryAudit', ['find', 'delete', 'approve', 'reject']),
    findInventoryAudit () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'warehouse;' +
            'items.item;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.isLoading = false
        this.inventoryAudit.items.forEach((element, index) => {
          this.$set(this.inventoryAudit.items[index], 'more', false)
          this.totalPrice += element.price
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    toggleMore () {
      const isMoreActive = this.inventoryAudit.items.some(function (el, index) {
        return el.more === false
      })
      this.inventoryAudit.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.$router.push('/inventory/audit')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.inventoryAudit.errors.record(error.errors)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.inventoryAudit.form.approved = response.data.form.approved
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.inventoryAudit.form.approved = response.data.form.approved
        this.inventoryAudit.form.approvals[0].reason = response.data.form.approvals[0].reason
      })
    }
  }
}
</script>
