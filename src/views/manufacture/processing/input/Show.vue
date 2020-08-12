<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="'/manufacture/processing'"
        class="breadcrumb-item"
      >
        {{ $t('processing') | uppercase }}
      </router-link>
      <router-link
        :to="'/manufacture/processing/input'"
        class="breadcrumb-item"
      >
        {{ $t('input') | uppercase }}
      </router-link>
      <template v-if="input.form.number">
        <span class="breadcrumb-item active">{{ input.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link
          v-if="input.origin"
          :to="{ name: 'manufacture.process.io.input.show', params: { id: id }}"
          class="breadcrumb-item"
        >
          {{ input.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />

    <div
      v-if="input.form.number != null && input.form.approval_status == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending approval warning', { form: 'manufacture', approvedBy: input.form.request_approval_to.full_name }) | uppercase }}
        </p>
        <hr>
        <div
          v-if="$permission.has('approve purchase request')"
          class="mt-10"
        >
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            @click="onApprove"
          >
            {{ $t('approve') | uppercase }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="$refs.formReject.show()"
          >
            {{ $t('reject') | uppercase }}
          </button>
          <m-form-approval-reject
            id="form-reject"
            ref="formReject"
            @reject="onReject($event)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="input.form.number != null && input.form.cancellation_status == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending cancellation warning', { form: 'manufacture', approvedBy: input.form.request_approval_to.full_name }) | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> {{ input.form.request_cancellation_reason }}
        </div>
        <hr>
        <div
          v-if="$permission.has('approve purchase request')"
          class="mt-10"
        >
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            @click="onCancellationApprove"
          >
            {{ $t('approve') | uppercase }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="$refs.formCancellationReject.show()"
          >
            {{ $t('reject') | uppercase }}
          </button>
          <m-form-approval-reject
            id="form-cancellation-reject"
            ref="formCancellationReject"
            @reject="onCancellationReject($event)"
          />
        </div>
      </div>
    </div>

    <p-info-form-rejected
      v-if="input.form.approval_status == -1 && isLoading == false"
      :reason="input.form.approval_reason"
    />
    <p-info-form-cancellation-rejected
      v-if="input.form.cancellation_status == -1 && isLoading == false"
      :reason="input.form.cancellation_reason"
    />
    <p-info-form-archived v-if="input.form.number == null && isLoading == false" />
    <p-info-form-deleted v-if="input.form.cancellation_status == 1 && isLoading == false" />

    <div class="row">
      <p-block>
        <div class="row">
          <div class="col-sm-12">
            <div class="text-right">
              <router-link
                :to="{ name: 'manufacture.processing.input.create' }"
                class="btn btn-sm btn-outline-secondary mr-5"
              >
                {{ $t('create') | uppercase }}
              </router-link>
              <router-link
                :to="{ name: 'manufacture.processing.input.edit', params: { id: id }}"
                class="btn btn-sm btn-outline-secondary mr-5"
              >
                {{ $t('edit') | uppercase }}
              </router-link>
              <button
                v-if="input.form.cancellation_status < 1"
                type="button"
                class="btn btn-sm btn-outline-secondary mr-5"
                :disabled="isDeleting"
                @click="$refs.formRequestDelete.show()"
              >
                <i
                  v-show="isDeleting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('delete') | uppercase }}
              </button>
              <m-form-request-delete
                id="form-delete"
                ref="formRequestDelete"
                @deleted="onRequestDelete($event)"
              />
            </div>
            <hr>
            <h4 class="text-center m-0">
              {{ $t('processing input') | uppercase }}
            </h4>
            <p class="text-center m-0">
              {{ input.form.number }}
            </p>
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="process"
            name="process"
            :label="$t('process')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              <template v-if="input.manufacture_process">
                {{ input.manufacture_process.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="machine"
            name="machine"
            :label="$t('machine')"
          >
            <div
              slot="body"
              class="col-lg-9 mt-5"
            >
              <template v-if="input.manufacture_machine">
                {{ input.manufacture_machine.name }}
              </template>
            </div>
          </p-form-row>

          <hr>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th style="min-width: 120px">
                  Warehouse
                </th>
                <th class="text-right">
                  Quantity
                </th>
              </tr>
              <tr slot="p-body">
                <th />
                <td
                  colspan="3"
                  class="font-weight-bold"
                >
                  {{ $t('finished goods') | uppercase }}
                </td>
              </tr>
              <tr
                v-for="(row, index) in input.finished_goods"
                slot="p-body"
                :key="'finished-goods-' + index"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td>{{ row.warehouse.name }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
              </tr>
              <tr slot="p-body">
                <th />
                <td
                  colspan="3"
                  class="font-weight-bold"
                >
                  {{ $t('raw materials') | uppercase }}
                </td>
              </tr>
              <tr
                v-for="(row, index) in materials"
                slot="p-body"
                :key="'raw-materials-' + index"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td>{{ row.warehouse.name }}</td>
                <td class="text-right">
                  <template v-if="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1)">
                    <a
                      href="javascript:void(0)"
                      @click="$refs.inventoryDna.show(row.dna, row.unit, row.item)"
                    >
                      {{ row.quantity | numberFormat }} {{ row.unit }}
                    </a>
                  </template>
                  <template v-else>
                    {{ row.quantity | numberFormat }} {{ row.unit }}
                  </template>
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <m-inventory-dna
            :id="'inventory-dna'"
            :ref="'inventoryDna'"
          />

          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ input.form.notes }}
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
                {{ input.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ input.form.created_by.full_name | uppercase }}
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
                <template v-if="input.form.approval_at">
                  {{ input.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ input.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ input.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from '../TabMenu'
import ManufactureMenu from '../../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      materials: []
    }
  },
  computed: {
    ...mapGetters('manufactureInput', ['input'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.manufactureInputRequest()
      }
    }
  },
  created () {
    this.manufactureInputRequest()
  },
  methods: {
    ...mapActions('manufactureInput', ['find', 'delete', 'approve', 'reject', 'cancellationApprove', 'cancellationReject']),
    manufactureInputRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'manufactureMachine;' +
            'manufactureProcess;' +
            'rawMaterials.item.units;' +
            'finishedGoods.item.units;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.requestCancellationTo;' +
            'rawMaterials.warehouse;' +
            'finishedGoods.warehouse'
        }
      }).then(response => {
        this.materials = []
        response.data.raw_materials.forEach(rawMaterial => {
          rawMaterial.row_id = this.materials.length
          rawMaterial.item.unit = {
            label: rawMaterial.unit,
            name: rawMaterial.unit,
            converter: rawMaterial.converter
          }

          const foundIndex = this.materials.findIndex(o =>
            o.item_id === rawMaterial.item_id &&
            o.warehouse_id === rawMaterial.warehouse_id
          )

          if (rawMaterial.item.require_expiry_date || rawMaterial.item.require_production_number) {
            if (foundIndex == -1) {
              rawMaterial.dna = []
              rawMaterial.dna.push({
                item_id: rawMaterial.item_id,
                quantity: rawMaterial.quantity,
                expiry_date: rawMaterial.expiry_date,
                production_number: rawMaterial.production_number
              })
              this.materials.push(rawMaterial)
            } else {
              var material = this.materials[foundIndex]
              material.quantity += rawMaterial.quantity
              material.dna.push({
                item_id: rawMaterial.item_id,
                quantity: rawMaterial.quantity,
                expiry_date: rawMaterial.expiry_date,
                production_number: rawMaterial.production_number
              })
              this.materials[foundIndex] = material
            }
          } else {
            this.materials.push(rawMaterial)
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.input.form.approval_status = response.data.form.approval_status
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        approval_reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.input.form.approval_status = response.data.form.approval_status
        this.input.form.approval_reason = response.data.form.approval_reason
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.input.form.cancellation_status = response.data.form.cancellation_status
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        cancellation_reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.input.form.cancellation_status = response.data.form.cancellation_status
        this.input.form.cancellation_reason = response.data.form.cancellation_reason
      })
    },
    onRequestDelete (reason) {
      this.isDeleting = true
      this.delete({
        id: this.id,
        params: {
          request_cancellation_reason: reason
        }
      }).then(response => {
        this.isDeleting = false
        this.input.form.cancellation_status = 0
        this.input.form.request_cancellation_reason = response.data.form.request_cancellation_reason
        this.$router.push('/manufacture/processing/input/' + this.id)
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
