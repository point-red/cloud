<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/processing'" class="breadcrumb-item">{{ $t('processing') | uppercase }}</router-link>
      <router-link :to="'/manufacture/processing/input'" class="breadcrumb-item">{{ $t('input') | uppercase }}</router-link>
      <template v-if="input.form.number">
        <span class="breadcrumb-item active">{{ input.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="input.origin" :to="{ name: 'manufacture.process.io.input.show', params: { id: id }}" class="breadcrumb-item">
          {{ input.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="row">
          <div class="col-sm-12">
            <div class="text-right">
              <router-link :to="{ name: 'manufacture.processing.input.create' }" class="btn btn-sm btn-outline-secondary mr-5">
                {{ $t('create') | uppercase }}
              </router-link>
              <router-link :to="{ name: 'manufacture.processing.input.edit', params: { id: input.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                {{ $t('edit') | uppercase }}
              </router-link>
              <button type="submit" class="btn btn-sm btn-outline-secondary mr-5" :disabled="isDeleting" @click="onDelete">
                <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('archive') | uppercase }}
              </button>
            </div>
            <hr>
            <h4 class="text-center m-0">{{ $t('processing input') | uppercase }}</h4>
            <p class="text-center m-0">{{ input.form.number }}</p>
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="machine"
            name="machine"
            :label="$t('machine')">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-if="input.manufacture_machine">
                {{ input.manufacture_machine.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="process"
            name="process"
            :label="$t('process')">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-if="input.manufacture_process">
                {{ input.manufacture_process.name }}
              </template>
            </div>
          </p-form-row>

          <hr>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">Finished Goods</th>
                <th>Quantity</th>
                <th style="min-width: 120px">Warehouse</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in input.finished_goods" :key="index">
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
                  {{ row.warehouse.name }}
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">{{ $t('raw materials') }}</th>
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
                <td></td>
                <td>
                  <template v-if="(row.item.require_expiry_date === 1 || row.item.require_production_number === 1)">
                    <a href="javascript:void(0)" @click="$refs.inventoryDna.show(row.inventories, row.unit, row.item)">
                      {{ row.quantity | numberFormat }} {{ row.unit }}
                    </a>
                  </template>
                  <template v-else>
                    {{ row.quantity | numberFormat }} {{ row.unit }}
                  </template>
                </td>
                <td>
                  {{ row.warehouse.name }}
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <m-inventory-dna :id="'inventory-dna'" :ref="'inventoryDna'"/>

          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ input.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ input.form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ input.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="input.form.approvals[0].approval_at">
                  {{ input.form.approvals[0].approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ input.form.approvals[0].requested_to.full_name | uppercase }}
              <div style="font-size:11px">{{ input.form.approvals[0].requested_to.email | lowercase }}</div>
            </div>
          </div>

          <p-separator v-if="input.archives != undefined && input.archives.length > 0"></p-separator>

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
                <router-link :to="{ name: 'manufacture.process.io.input.show', params: { id: id }}">
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </router-link>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>
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
        id: this.id,
        params: {
          with_archives: true,
          includes: 'manufactureMachine;manufactureProcess;rawMaterials.item.units;finishedGoods.item.units;form.createdBy;form.approvals.requestedBy;form.approvals.requestedTo;rawMaterials.warehouse;finishedGoods.warehouse'
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
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$notification.success('archive success')
          this.$router.push('/manufacture/processing/' + this.id + '/input')
        }).catch(error => {
          this.isDeleting = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
      })
    }
  },
  created () {
    this.manufactureInputRequest()
  }
}
</script>
