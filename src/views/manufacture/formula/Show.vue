<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link to="/manufacture/formula" class="breadcrumb-item">{{ $t('formula') | uppercase }}</router-link>
      <template v-if="formula.form.number">
        <span class="breadcrumb-item active">{{ formula.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="formula.origin" :to="{ name: 'manufacture.formula.show', params: { id: formula.origin.id }}" class="breadcrumb-item">
          {{ formula.form.edited_number | uppercase }}
        </router-link>
        <span class="breadcrumb-item active">{{ $t('archived') | uppercase }}</span>
      </template>
    </breadcrumb>

    <manufacture-menu/>

    <div class="alert alert-warning d-flex align-items-center justify-content-between mb-15" role="alert" v-if="formula.form.number != null && formula.form.approved == null && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
          {{ $t('pending approval warning', { form: 'purchase request', approvedBy: formula.form.approvals[0].requested_to.first_name + ' ' + formula.form.approvals[0].requested_to.last_name }) | uppercase }}
        </p>
        <div v-if="$permission.has('approve purchase request')" class="mt-10">
          <button type="button" @click="onApprove" class="btn btn-sm btn-primary mr-5">{{ $t('approve') | uppercase }}</button>
          <button type="button" @click="$refs.formReject.show()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
          <m-form-reject id="form-reject" ref="formReject" @reject="onReject($event)"></m-form-reject>
        </div>
      </div>
    </div>

    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15" role="alert" v-if="formula.form.approved == 0 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> {{ formula.form.approvals[0].reason }}</div>
      </div>
    </div>

    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="formula.form.number == null && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('archived') | uppercase }}
        </p>
      </div>
    </div>

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            :to="{ path: '/manufacture/formula/create' }"
            v-if="$permission.has('create manufacture formula')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            :to="{ path: '/manufacture/formula/' + formula.id + '/edit', params: { id: formula.id }}"
            v-if="$permission.has('update manufacture formula') && $formRules.allowedToUpdate(formula.form)"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button type="button" class="btn btn-sm btn-outline-secondary mr-5" :disabled="isDeleting" @click="onDelete">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="text-center m-0">{{ $t('formula') | uppercase }}</h4>
              <p class="text-center m-0">{{ formula.form.number }}</p>
            </div>
          </div>

          <hr>

          <p-form-row
            id="process"
            name="process"
            class="m-0"
            :label="$t('process')">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-if="formula.manufacture_process">
                {{ formula.manufacture_process.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="name"
            name="name"
            class="m-0"
            :label="$t('name')">
            <div slot="body" class="col-lg-9 mt-5">
              {{ formula.name }}
            </div>
          </p-form-row>

          <hr>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th style="width: 50px">#</th>
                <th style="min-width: 120px">Finished Goods</th>
                <th class="text-right">Quantity</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in formula.finished_goods" :key="index">
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
                <th style="width: 50px">#</th>
                <th style="min-width: 120px">Raw Material</th>
                <th class="text-right">Quantity</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in formula.raw_materials" :key="index">
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
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ formula.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ formula.form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ formula.form.created_by.first_name | uppercase }} {{ formula.form.created_by.last_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="formula.form.approvals[0].approval_at">
                  {{ formula.form.approvals[0].approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ formula.form.approvals[0].requested_to.first_name | uppercase }} {{ formula.form.approvals[0].requested_to.last_name | uppercase }}
              <div style="font-size:11px">{{ formula.form.approvals[0].requested_to.email | lowercase }}</div>
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
  methods: {
    ...mapActions('manufactureFormula', ['find', 'delete', 'approve', 'reject']),
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
            'form.approvals.requestedBy;' +
            'form.approvals.requestedTo'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$notification.success('delete success')
          this.$router.push('/manufacture/formula')
        }).catch(error => {
          this.isDeleting = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.formula.form.approved = response.data.form.approved
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.formula.form.approved = response.data.form.approved
        this.formula.form.approvals[0].reason = response.data.form.approvals[0].reason
      })
    }
  },
  created () {
    this.manufactureFormulaRequest()
  }
}
</script>
