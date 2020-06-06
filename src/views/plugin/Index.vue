<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('plugin') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        name="Scale Weight"
        v-if="$plugin.has('SCALE WEIGHT') && $permission.has('menu scale weight')"
        link="/plugin/scale-weight"
        icon="fa fa-balance-scale"/>

      <p-box
        name="Pin Point"
        v-if="$plugin.has('PIN POINT') && $permission.has('menu pin point')"
        link="/plugin/pin-point"
        icon="fa fa-map-marker"/>

      <p-box
        name="Play Book"
        v-if="$permission.has('menu play book')"
        link="/plugin/play-book"
        icon="fa fa-folder"/>
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
