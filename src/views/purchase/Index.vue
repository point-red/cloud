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
  },
  methods: {
  },
  created () {
  }
}
</script>
