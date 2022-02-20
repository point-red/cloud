<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read fixed asset')"
      class="nav-item"
    >
      <router-link
        to="/master/fixed-assets"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('fixed asset') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read fixed asset')"
      class="nav-item"
    >
      <router-link
        to="/master/fixed-asset-groups"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('group') | uppercase }}</span>
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
