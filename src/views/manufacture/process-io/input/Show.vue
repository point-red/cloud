<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | uppercase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <template v-if="input.form.number">
        <span class="breadcrumb-item active">{{ input.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="input.origin" :to="{ name: 'manufacture.process.io.input.show', params: { id: id, inputId: input.origin.id }}" class="breadcrumb-item">
          {{ input.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('input')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="input.form.number">
                {{ input.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ input.form.edited_number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ input.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="machine"
            name="machine"
            :label="$t('machine')">
            <div slot="body" class="col-lg-9">
              <template v-if="input.manufacture_machine">
                {{ input.manufacture_machine.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-9">
              {{ input.notes }}
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
              </tr>
              <tr slot="p-body" v-for="(row, index) in input.finish_goods" :key="index">
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
                <th>&nbsp;</th>
                <th>Quantity</th>
                <th style="min-width: 120px">Warehouse</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in raw_materials_temporary" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    {{ row.item.label }}
                  </router-link>
                </td>
                <td>
                  <m-inventory
                    :id="'inventory-' + index"
                    :itemUnit="row.unit"
                    :inventories="row.inventories"
                    :requireExpiryDate="row.item.require_expiry_date"
                    :requireProductionNumber="row.item.require_production_number"
                    v-if="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1)"/>
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
            <tr slot="p-body" v-for="(approval, index) in input.form.approvals" :key="index">
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

          <h5 v-if="input.archives != undefined && input.archives.length > 0">Archives</h5>

          <point-table v-if="input.archives != undefined && input.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in input.archives" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'manufacture.process.io.input.show', params: { id: id, inputId: archived.id }}">
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </router-link>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>

          <router-link
            :to="{ path: '/manufacture/process-io/' + id + '/input/' + input.id + '/edit', params: { id: id, inputId: input.id }}"
            v-if="$permission.has('update manufacture') && $formRules.allowedToUpdate(input.form)"
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
      inputId: this.$route.params.inputId,
      isLoading: false,
      isDeleting: false,
      raw_materials_temporary: []
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
  methods: {
    ...mapActions('manufactureInput', ['find', 'delete']),
    manufactureInputRequest () {
      this.isLoading = true
      this.find({
        id: this.inputId,
        params: {
          with_archives: true,
          includes: 'manufactureMachine;rawMaterials.item.units;finishGoods.item.units;form.approvals.requestedBy;form.approvals.requestedTo;rawMaterials.warehouse;finishGoods.warehouse'
        }
      }).then(response => {
        this.raw_materials_temporary = []
        for (let index in this.input.raw_materials) {
          let rawMaterial = this.input.raw_materials[index]
          let rawMaterialTemporaryIndex = this.raw_materials_temporary.findIndex(o => o.item_id === rawMaterial.item_id && o.warehouse_id === rawMaterial.warehouse_id)
          if (rawMaterialTemporaryIndex < 0) {
            var newItem = Object.assign({}, rawMaterial)
            newItem.inventories = []
            newItem.inventories.push({
              'quantity': rawMaterial.quantity,
              'expiry_date': rawMaterial.expiry_date,
              'production_number': rawMaterial.production_number
            })
            this.raw_materials_temporary.push(newItem)
          } else {
            var existing = this.raw_materials_temporary[rawMaterialTemporaryIndex]
            existing.quantity += rawMaterial.quantity
            existing.inventories.push({
              'quantity': rawMaterial.quantity,
              'expiry_date': rawMaterial.expiry_date,
              'production_number': rawMaterial.production_number
            })
            this.raw_materials_temporary[rawMaterialTemporaryIndex] = existing
          }
        }
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
        this.$router.push('/manufacture/process-io/' + this.id + '/input')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.manufactureInputRequest()
  }
}
</script>
