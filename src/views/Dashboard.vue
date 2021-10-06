<template>
  <div class="row gutters-tiny">
    <p-box
      :name="$t('main menu')"
      link="/menu"
      icon="si si-layers"
    />

    <p-box
      v-if="$plugin.has('PIN POINT') && $permission.has('menu pin point')"
      name="Sales Visitation"
      link="/plugin/pin-point"
      icon="fa fa-map-marker"
    />
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
