<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
    </breadcrumb>

    <purchase-menu></purchase-menu>

    <div class="row">
      <p-block>
        <h3>Purchase Request</h3>
        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>{{ $t('date') }}</th>
              <th>{{ $t('number') }}</th>
              <th class="text-right">{{ $t('action') }}</th>
            </tr>
            <tr slot="p-body" v-for="(form, index) in forms" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ form.date | dateFormat('DD MMMM YYYY') }}</td>
              <td>{{ form.number }}</td>
              <td></td>
            </tr>
          </point-table>
        </p-block-inner>

        <p-separator></p-separator>

        <h3>Purchase Order</h3>
        <hr>
        <p>
          Purchase order telah dibuat, silahkan membuat laporan penerimaan barang jika barang
          telah diterima
        </p>
        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>{{ $t('date') }}</th>
              <th>{{ $t('number') }}</th>
              <th class="text-right">{{ $t('action') }}</th>
            </tr>
            <tr slot="p-body" v-for="(form, index) in forms" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ form.date | dateFormat('DD MMMM YYYY') }}</td>
              <td>{{ form.number }}</td>
              <td></td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import PurchaseMenu from './Menu'
import BreadcrumbPurchase from './Breadcrumb'
import Breadcrumb from '@/views/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  computed: {
    ...mapGetters('purchasePending', ['forms'])
  },
  methods: {
    ...mapActions('purchasePending', ['get'])
  },
  created () {
    this.get()
  }
}
</script>
