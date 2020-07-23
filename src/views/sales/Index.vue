<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('sales') | uppercase }}</span>
    </breadcrumb>

    <sales-menu></sales-menu>

  </div>
</template>

<script>
import SalesMenu from './Menu'
import Breadcrumb from '@/views/Breadcrumb'

export default {
  components: {
    SalesMenu,
    Breadcrumb
  },
  computed: {
  },
  methods: {
  },
  created () {
  }
}
</script>
