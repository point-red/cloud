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
      </template>
    </breadcrumb>

    <manufacture-menu/>

    <div class="row">
      <p-block :title="$t('formula')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="formula.form.number">
                {{ formula.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ formula.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ formula.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="process"
            name="process"
            :label="$t('process')">
            <div slot="body" class="col-lg-9">
              <template v-if="formula.manufacture_process">
                {{ formula.manufacture_process.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="name"
            name="name"
            :label="$t('name')">
            <div slot="body" class="col-lg-9">
              {{ formula.name }}
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-9">
              {{ formula.notes }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5>{{ $t('finished goods') | titlecase }}</h5>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">Item</th>
                <th>Quantity</th>
                <th style="min-width: 120px">Warehouse</th>
                <th></th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in formula.finished_goods" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td>
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td>
                  <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                    {{ row.warehouse.name }}
                  </router-link>
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-separator></p-separator>

          <h5>{{ $t('raw materials') | titlecase }}</h5>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">Item</th>
                <th>Quantity</th>
                <th style="min-width: 120px">Warehouse</th>
                <th></th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in formula.raw_materials" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td>
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td>
                  <router-link :to="{ name: 'warehouse.show', params: { id: row.warehouse.id }}">
                    {{ row.warehouse.name }}
                  </router-link>
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-separator></p-separator>

          <h5 class="">Approver</h5>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Requested At</th>
              <th>Requested By</th>
              <th>Requested To</th>
              <th>Approval Status</th>
            </tr>
            <tr slot="p-body" v-for="(approval, index) in formula.form.approvals" :key="index">
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

          <h5 v-if="formula.archives != undefined && formula.archives.length > 0">Archives</h5>

          <point-table v-if="formula.archives != undefined && formula.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in formula.archives" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'manufacture.formula.show', params: { id: archived.id }}">
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </router-link>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>

          <router-link
            :to="{ path: '/manufacture/formula/' + formula.id + '/edit', params: { id: formula.id }}"
            v-if="$permission.has('update manufacture formula') && $formRules.allowedToUpdate(formula.form)"
            class="btn btn-sm btn-primary mr-5">
            {{ $t('edit') | uppercase }}
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
    ...mapActions('manufactureFormula', ['find', 'delete']),
    manufactureFormulaRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'manufactureProcess;rawMaterials.item.units;finishedGoods.item.units;form.approvals.requestedBy;form.approvals.requestedTo;rawMaterials.warehouse;finishedGoods.warehouse'
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
        this.$router.push('/manufacture/formula')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.manufactureFormulaRequest()
  }
}
</script>
