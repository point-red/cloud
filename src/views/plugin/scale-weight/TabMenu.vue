<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read scale weight truck')"
      class="nav-item"
    >
      <router-link
        to="/plugin/scale-weight/truck"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('scale weight truck') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read scale weight item')"
      class="nav-item"
    >
      <router-link
        to="/plugin/scale-weight/item"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('scale weight item') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read scale weight truck') || $permission.has('read scale weight item')"
      class="nav-item"
    >
      <router-link
        to="/plugin/scale-weight/merge"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('scale weight') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right" />
  </ul>
</template>

<script>
export default {
  data () {
    return {
      id: this.$route.params.id
    }
  }
}
</script>
