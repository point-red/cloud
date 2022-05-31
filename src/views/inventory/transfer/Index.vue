<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <span class="breadcrumb-item active">{{ $t('transfer item') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read transfer item')"
        name="Send"
        link="/inventory/transfer/send"
        icon="fa fa-truck"
      />
      <p-box
        v-if="$permission.has('read transfer item')"
        name="Receive"
        link="/inventory/transfer/receive"
        icon="fa fa-home"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory
  }
}
</script>
