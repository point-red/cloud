<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
    </breadcrumb>

    <purchase-menu></purchase-menu>

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
