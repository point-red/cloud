<template>
  <div>
    <breadcrumb v-if="inventoryUsage">
      <breadcrumb-inventory />
      <router-link
        to="/inventory/usage"
        class="breadcrumb-item"
      >
        {{ $t('inventory usage') | uppercase }}
      </router-link>
      <template v-if="inventoryUsage.form.number">
        <span class="breadcrumb-item active">{{ inventoryUsage.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link
          v-if="inventoryUsage.origin"
          :to="{ name: 'inventory.usage.show', params: { id: inventoryUsage.origin.id }}"
          class="breadcrumb-item"
        >
          {{ inventoryUsage.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <!-- <div class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="inventoryUsage.form.approved == null && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
          {{ $t('pending approval warning', { form: 'inventory usage', approvedBy: inventoryUsage.form.request_approval_to.first_name + ' ' + inventoryUsage.form.request_approval_to.last_name }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve inventory usage')">
          <button type="button" @click="onApprove" class="btn btn-sm btn-primary mr-5">{{ $t('approve') | uppercase }}</button>
          <button type="button" @click="$refs.formReject.show()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
          <m-form-approval-reject id="form-reject" ref="formReject" @reject="onReject($event)"></m-form-approval-reject>
        </div>
      </div>
    </div> -->

    <!-- <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="inventoryUsage.form.approved == 0 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> {{ inventoryUsage.form.approvals[0].reason }}</div>
      </div>
    </div> -->

    <div
      v-if="inventoryUsage"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'inventory.usage.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <!-- <router-link :to="{ name: 'inventory.usage.edit', params: { id: inventoryUsage.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link> -->
              </div>
              <hr>
              <h4 class="text-center m-0">
                {{ $t('inventory usage') | uppercase }}
              </h4>
              <p class="text-center m-0">
                {{ inventoryUsage.form.number }}
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
                {{ inventoryUsage.warehouse.name | uppercase }}
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
              <th>Account</th>
              <th>Notes</th>
              <th class="text-right">
                Quantity
              </th>
              <th width="50px">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="toggleMore()"
                >
                  <i class="fa fa-ellipsis-h" />
                </button>
              </th>
            </tr>
            <template v-for="(row, index) in inventoryUsage.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.label }}</td>
                <td>{{ row.account.label }}</td>
                <td>{{ row.notes }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="row.more = !row.more"
                  >
                    <i class="fa fa-ellipsis-h" />
                  </button>
                </td>
              </tr>
              <template v-if="row.more">
                <tr
                  slot="p-body"
                  :key="'ext-'+index"
                  class="bg-gray-light"
                >
                  <th class="bg-gray-light" />
                  <td colspan="4">
                    <p-form-row
                      id="allocation"
                      name="allocation"
                      :label="$t('allocation')"
                    >
                      <div slot="body">
                        <template v-if="row.allocation">
                          {{ row.allocation.name }}
                        </template>
                      </div>
                    </p-form-row>
                  </td>
                </tr>
              </template>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ inventoryUsage.form.notes }}
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
                {{ inventoryUsage.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ inventoryUsage.form.created_by.full_name | uppercase }}
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
                <template v-if="inventoryUsage.form.request_approval_at">
                  {{ inventoryUsage.form.request_approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ inventoryUsage.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ inventoryUsage.form.request_approval_to.email | lowercase }}
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
    ...mapGetters('inventoryUsage', ['inventoryUsage']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.findInventoryUsage()
      }
    }
  },
  created () {
    this.findInventoryUsage()
  },
  methods: {
    ...mapActions('inventoryUsage', ['find', 'delete', 'approve', 'reject']),
    findInventoryUsage () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'warehouse;' +
            'items.account;' +
            'items.item;' +
            'items.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.requestCancellationTo'
        }
      }).then(response => {
        this.isLoading = false
        this.inventoryUsage.items.forEach((element, index) => {
          this.$set(this.inventoryUsage.items[index], 'more', false)
          this.totalPrice += element.price
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    toggleMore () {
      const isMoreActive = this.inventoryUsage.items.some(function (el, index) {
        return el.more === false
      })
      this.inventoryUsage.items.forEach(element => {
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
        this.$router.push('/inventory/usage')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.inventoryUsage.errors.record(error.errors)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.inventoryUsage.form.approved = response.data.form.approved
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.inventoryUsage.form.approved = response.data.form.approved
        this.inventoryUsage.form.approvals[0].reason = response.data.form.approvals[0].reason
      })
    }
  }
}
</script>
