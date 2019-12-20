<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | titlecase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/output'" class="breadcrumb-item">{{ $t('output') | titlecase }}</router-link>
      <template v-if="output.form.number">
        <span class="breadcrumb-item active">{{ output.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="output.origin" :to="{ name: 'manufacture.process.io.output.show', params: { id: id, outputId: output.origin.id }}" class="breadcrumb-item">
          {{ output.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('output')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="output.form.number">
                {{ output.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ output.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ output.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="machine"
            name="machine"
            :label="$t('machine')">
            <div slot="body" class="col-lg-9">
              <template v-if="output.manufacture_machine">
                {{ output.manufacture_machine.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-9">
              {{ output.notes }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h3>{{ $t('finished goods') | titlecase }}</h3>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">Item</th>
                <th>Estimation</th>
                <th>Output</th>
                <th>Expiry Date</th>
                <th>Production No.</th>
                <th style="min-width: 120px">Warehouse</th>
                <th></th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in output.finish_goods" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    [{{ row.item.code }}] {{ row.item.name }}
                  </router-link>
                </td>
                <td>
                  0 {{ row.unit }}
                </td>
                <td>
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td v-if="row.expiry_date">{{ row.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
                <td v-else>&nbsp;</td>
                <td>
                  {{ row.production_number }}
                </td>
                <td>
                  <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                    [{{ row.warehouse.code }}] {{ row.warehouse.name }}
                  </router-link>
                </td>
              </tr>
            </point-table>
          </p-block-inner>

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
            <tr slot="p-body" v-for="(approval, index) in output.form.approvals" :key="index">
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

          <h3 v-if="output.archives != undefined && output.archives.length > 0">Archives</h3>

          <point-table v-if="output.archives != undefined && output.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in output.archives" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'manufacture.process.io.output.show', params: { id: id, outputId: archived.id }}">
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </router-link>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>

          <router-link
            :to="{ path: '/manufacture/process-io/' + id + '/output/' + output.id + '/edit', params: { id: id, outputId: output.id }}"
            v-if="$permission.has('update manufacture output') && $formRules.allowedToUpdate(output.form)"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button type="submit" class="btn btn-sm btn-danger mr-5" :disabled="isDeleting" @click="onDelete">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Cancel
          </button>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
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
      outputId: this.$route.params.outputId,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('manufactureOutput', ['output'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.manufactureOutputRequest()
      }
    }
  },
  methods: {
    ...mapActions('manufactureOutput', ['find', 'delete']),
    manufactureOutputRequest () {
      this.isLoading = true
      this.find({
        id: this.outputId,
        params: {
          with_archives: true,
          includes: 'manufactureMachine;manufactureInput;finishGoods.item.units;form.approvals.requestedBy;form.approvals.requestedTo;finishGoods.warehouse'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.$router.push('/manufacture/process-io/' + this.id + '/output')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.manufactureOutputRequest()
  }
}
</script>
