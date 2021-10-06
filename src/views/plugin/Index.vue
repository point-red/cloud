<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('plugin') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$plugin.has('SCALE WEIGHT') && $permission.has('menu scale weight')"
        name="Scale Weight"
        link="/plugin/scale-weight"
        icon="fa fa-balance-scale"
      />

      <p-box
        v-if="$plugin.has('PIN POINT') && $permission.has('menu pin point')"
        name="Sales Visitation"
        link="/plugin/pin-point"
        icon="fa fa-map-marker"
      />

      <p-box
        v-if="$permission.has('menu play book')"
        name="Play Book"
        link="/plugin/play-book"
        icon="fa fa-folder"
      />
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
