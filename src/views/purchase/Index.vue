<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('purchase') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu></purchase-menu>

  </div>
</template>

<script>
import PurchaseMenu from './Menu'
import Breadcrumb from '@/views/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
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
