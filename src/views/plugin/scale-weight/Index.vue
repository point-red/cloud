<template>
  <div>
    <breadcrumb>
      <router-link
        to="/plugin"
        class="breadcrumb-item"
      >
        {{ $t('plugin') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('scale weight') | uppercase }}</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read scale weight truck')"
        name="Scale Weight (Truck)"
        link="/plugin/scale-weight/truck"
        icon="fa fa-truck"
      />
      <p-box
        v-if="$permission.has('read scale weight item')"
        name="Scale Weight (Item)"
        link="/plugin/scale-weight/item"
        icon="fa fa-balance-scale"
      />
      <p-box
        v-if="$permission.has('read scale weight item')"
        name="Scale Weight (Merge)"
        link="/plugin/scale-weight/merge"
        icon="fa fa-balance-scale"
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
