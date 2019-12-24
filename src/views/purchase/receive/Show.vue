<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/receive" class="breadcrumb-item">{{ $t('purchase receive') | titlecase }}</router-link>
      <template v-if="purchaseReceive.form">
        <span class="breadcrumb-item active">{{ purchaseReceive.form.number | uppercase }}</span>
      </template>
      <template v-else>
        <router-link v-if="purchaseReceive.origin" :to="{ name: 'purchase.receive.show', params: { id: purchaseReceive.origin.id }}" class="breadcrumb-item">
          {{ purchaseReceive.form.edited_number | uppercase }}
        </router-link>
      </template>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('purchase receive')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseReceive.form">
                <template v-if="purchaseReceive.form.number">
                  {{ purchaseReceive.form.number }}
                </template>
                <template v-else>
                  <span class="badge badge-danger">{{ $t('archived') }}</span>
                  {{ purchaseReceive.form.edited_number }}
                </template>
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ purchaseReceive.date | dateFormat('DD MMMM YYYY HH:mm') }}
            </div>
          </p-form-row>

          <p-form-row
            id="warehouse"
            name="warehouse"
            :label="$t('warehouse')">
            <div slot="body" class="col-lg-9">
              {{ purchaseReceive.warehouse.name }}
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseReceive.supplier">
                {{ purchaseReceive.supplier.name }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="driver"
            name="driver"
            :label="$t('driver')">
            <div slot="body" class="col-lg-9">
              {{ purchaseReceive.driver }}
            </div>
          </p-form-row>

          <p-form-row
            id="license_plate"
            name="license_plate"
            :label="$t('license plate')">
            <div slot="body" class="col-lg-9">
              {{ purchaseReceive.license_plate }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5 class="">Item</h5>

          <p-block-inner>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th>Item</th>
                <th>Notes</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Expiry Date</th>
                <th class="text-right">Production No.</th>
              </tr>
              <tr slot="p-body" v-for="(row, index) in purchaseReceive.items" :key="index">
                <th>{{ index + 1 }}</th>
                <td>
                  [{{ row.item.code }}] {{ row.item.name }}
                </td>
                <td>
                  {{ row.notes }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right" v-if="row.expiry_date">
                  {{ row.expiry_date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td class="text-right" v-else>
                  &nbsp;
                </td>
                <td class="text-right">
                  {{ row.production_number }}
                </td>
              </tr>
            </point-table>
          </p-block-inner>

          <p-separator></p-separator>

          <h5 v-if="purchaseReceive.archives != undefined && purchaseReceive.archives.length > 0">Archives</h5>

          <point-table v-if="purchaseReceive.archives != undefined && purchaseReceive.archives.length > 0">
            <tr slot="p-head">
              <th>#</th>
              <th>Edited Date</th>
              <th>Edited Reason</th>
            </tr>
            <tr slot="p-body" v-for="(archived, index) in purchaseReceive.archives" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'purchase.receive.show', params: { id: archived.id }}">
                  {{ archived.form.updated_at | dateFormat('DD MMMM YYYY HH:mm') }}
                </router-link>
              </td>
              <td>
                {{ archived.edited_notes }}
              </td>
            </tr>
          </point-table>

          <router-link
            :to="{ path: '/purchase/receive/' + purchaseReceive.id + '/edit', params: { id: purchaseReceive.id }}"
            v-if="$permission.has('update purchase receive') && $formRules.allowedToUpdate(purchaseReceive.form)"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <a
            href="javascript:void(0)"
            @click="onDelete"
            class="btn btn-sm btn-danger mr-5">
            Cancel
          </a>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
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
    ...mapGetters('purchaseReceive', ['purchaseReceive'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseReceiveRequest()
      }
    }
  },
  methods: {
    ...mapActions('purchaseReceive', ['find', 'delete']),
    purchaseReceiveRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          includes: 'supplier;' +
            'warehouse;' +
            'items.item.units;' +
            'items.allocation;' +
            'services.service;' +
            'services.allocation;' +
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
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.$router.push('/purchase/receive')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  },
  created () {
    this.purchaseReceiveRequest()
  }
}
</script>
