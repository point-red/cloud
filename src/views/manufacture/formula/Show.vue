<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        to="/manufacture/formula"
        class="breadcrumb-item"
      >
        {{ $t('formula') | uppercase }}
      </router-link>
      <template v-if="formula.form.number">
        <span class="breadcrumb-item active">{{ formula.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link
          v-if="formula.origin"
          :to="{ name: 'manufacture.formula.show', params: { id: formula.origin.id }}"
          class="breadcrumb-item"
        >
          {{ formula.form.edited_number | uppercase }}
        </router-link>
        <span class="breadcrumb-item active">{{ $t('archived') | uppercase }}</span>
      </template>
    </breadcrumb>

    <manufacture-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="formula.form.request_approval_to.full_name"
      :cancellation-status="formula.form.cancellation_status"
      :approval-status="formula.form.approval_status"
      :approval-reason="formula.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="formula.form.cancellation_status"
      :cancellation-approval-reason="formula.form.cancellation_approval_reason"
      :request-cancellation-reason="formula.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            v-if="$permission.has('create manufacture formula')"
            :to="{ path: '/manufacture/formula/create' }"
            class="btn btn-sm btn-outline-secondary mr-5"
          >
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            v-if="$permission.has('update manufacture formula') && $formRules.allowedToUpdate(formula.form)"
            :to="{ path: '/manufacture/formula/' + formula.id + '/edit', params: { id: formula.id }}"
            class="btn btn-sm btn-outline-secondary mr-5"
          >
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            v-if="formula.form.cancellation_status == null || formula.form.cancellation_status == -1"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            :disabled="isDeleting"
            @click="$refs.formRequestDelete.open()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
          <m-form-request-delete
            ref="formRequestDelete"
            @delete="onRequestDelete($event)"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('formula') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ formula.form.number }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('process') | uppercase }}
                  </td>
                  <td>{{ formula.manufacture_process.name }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('name') | uppercase }}
                  </td>
                  <td>{{ formula.name }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="formula.form.branch">
                {{ formula.form.branch.address | uppercase }}
                <br v-if="formula.form.branch.phone">{{ formula.form.branch.phone | uppercase }}
              </template>
            </div>
          </div>

          <hr>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th style="width: 50px">
                  #
                </th>
                <th style="min-width: 120px">
                  Finished Goods
                </th>
                <th class="text-right">
                  Quantity
                </th>
              </tr>
              <tr
                v-for="(row, index) in formula.finished_goods"
                slot="p-body"
                :key="index"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th style="width: 50px">
                  #
                </th>
                <th style="min-width: 120px">
                  Raw Material
                </th>
                <th class="text-right">
                  Quantity
                </th>
              </tr>
              <tr
                v-for="(row, index) in formula.raw_materials"
                slot="p-body"
                :key="index"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ formula.form.notes }}
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
                {{ formula.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ formula.form.created_by.first_name | uppercase }} {{ formula.form.created_by.last_name | uppercase }}
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
                <template v-if="formula.form.approval_at">
                  {{ formula.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ formula.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ formula.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture,
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
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('manufactureFormula', ['formula'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.manufactureFormulaRequest()
      }
    }
  },
  created () {
    this.manufactureFormulaRequest()
  },
  methods: {
    ...mapActions('manufactureFormula', ['find', 'delete', 'approve', 'reject', 'cancellationApprove', 'cancellationReject']),
    manufactureFormulaRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_origin: true,
          includes: 'form.createdBy;' +
            'manufactureProcess;' +
            'rawMaterials.item.units;' +
            'finishedGoods.item.units;' +
            'form.branch;' +
            'form.requestApprovalTo;' +
            'form.requestCancellationTo'
        }
      }).then(response => {
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
        this.manufactureFormulaRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.manufactureFormulaRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.manufactureFormulaRequest()
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.manufactureFormulaRequest()
      })
    },
    onRequestDelete (reason) {
      this.isDeleting = true
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.isDeleting = false
        this.$router.push('/manufacture/formula/' + this.id)
        this.manufactureFormulaRequest()
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
