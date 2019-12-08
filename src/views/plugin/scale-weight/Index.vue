<template>
  <div>
    <breadcrumb>
      <router-link
        to="/plugin"
        class="breadcrumb-item">Plugin</router-link>
      <span class="breadcrumb-item active">Scale Weight</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        name="Scale Weight (Truck)"
        v-if="$permission.has('read scale weight truck')"
        link="/plugin/scale-weight/truck"
        icon="fa fa-truck"/>
      <p-box
        name="Scale Weight (Item)"
        v-if="$permission.has('read scale weight item')"
        link="/plugin/scale-weight/item"
        icon="fa fa-balance-scale"/>
      <p-box
        name="Scale Weight (Merge)"
        v-if="$permission.has('read scale weight item')"
        link="/plugin/scale-weight/merge"
        icon="fa fa-balance-scale"/>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import TabMenu from './TabMenu'

export default {
  components: {
    Breadcrumb,
    TabMenu
  }
}
</script>
