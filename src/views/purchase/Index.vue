<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('purchase') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />
  </div>
</template>

<script>
import PurchaseMenu from './Menu'
import Breadcrumb from '@/views/Breadcrumb'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>
