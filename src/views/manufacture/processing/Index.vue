<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <span class="breadcrumb-item active">{{ $t('processing') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />
  </div>
</template>

<script>
import ManufactureMenu from '../Menu'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'

export default {
  components: {
    ManufactureMenu,
    TabMenu,
    Breadcrumb,
    BreadcrumbManufacture
  }
}
</script>
