<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Plugin</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        name="Scale Weight"
        v-if="$permission.has('menu scale weight')"
        link="/plugin/scale-weight"
        icon="fa fa-balance-scale"/>

      <p-box
        name="Pin Point"
        v-if="$permission.has('menu pin point')"
        link="/plugin/pin-point"
        icon="fa fa-map-marker"/>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'

export default {
  components: {
    Breadcrumb
  }
}
</script>
