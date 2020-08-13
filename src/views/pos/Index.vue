<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">POS</span>
    </breadcrumb>

    <pos-menu />
  </div>
</template>

<script>
import PosMenu from './Menu'
import Breadcrumb from '@/views/Breadcrumb'

export default {
  components: {
    PosMenu,
    Breadcrumb
  }
}
</script>
