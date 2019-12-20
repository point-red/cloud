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
                <th>&nbsp;</th>
                <th>Output</th>
                <th style="min-width: 120px">Warehouse</th>
                <th></th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in finish_goods_temporary" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: row.item.id }}">
                    [{{ row.item.code }}] {{ row.item.name }}
                  </router-link>
                </td>
                <td>
                  {{ row.estimation_quantity | numberFormat }} {{ row.unit }}
                </td>
                <td>
                  <m-inventory
                    :id="'inventory-' + index"
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
      isDeleting: false,
      finish_goods_temporary: []
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
          includes: 'manufactureMachine;manufactureInput.finishGoods;finishGoods.item.units;form.approvals.requestedBy;form.approvals.requestedTo;finishGoods.warehouse'
        }
      }).then(response => {
        this.finish_goods_temporary = []
        for (let index in this.output.finish_goods) {
          let finishGood = this.output.finish_goods[index]
          let finishGoodTemporaryIndex = this.finish_goods_temporary.findIndex(o => o.item_id === finishGood.item_id && o.warehouse_id === finishGood.warehouse_id)
          var finishGoodTemporary
          if (finishGoodTemporaryIndex < 0) {
            finishGoodTemporary = Object.assign({}, finishGood)
            finishGoodTemporary.inventories = []
            finishGoodTemporary.inventories.push({
              'quantity': finishGood.quantity,
              'expiry_date': finishGood.expiry_date,
              'production_number': finishGood.production_number
            })
            this.finish_goods_temporary.push(finishGoodTemporary)
          } else {
            finishGoodTemporary = this.finish_goods_temporary[finishGoodTemporaryIndex]
            finishGoodTemporary.quantity += finishGood.quantity
            finishGoodTemporary.inventories.push({
              'quantity': finishGood.quantity,
              'expiry_date': finishGood.expiry_date,
              'production_number': finishGood.production_number
            })
            this.finish_goods_temporary[finishGoodTemporaryIndex] = finishGoodTemporary
          }
        }
        for (let index in this.finish_goods_temporary) {
          let finishGood = this.finish_goods_temporary[index]
          let inputFinishGoodIndex = this.output.manufacture_input.finish_goods.findIndex(o => o.item_id === finishGood.item_id && o.warehouse_id === finishGood.warehouse_id)
          if (inputFinishGoodIndex >= 0) {
            this.finish_goods_temporary[index].estimation_quantity = this.output.manufacture_input.finish_goods[inputFinishGoodIndex].quantity
          } else {
            this.finish_goods_temporary[index].estimation_quantity = 0
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
