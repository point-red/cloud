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

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase
  }
}
</script>
