<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read manufacture')"
      class="nav-item"
    >
      <router-link
        :to="'/manufacture/processing/input'"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('input') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read manufacture')"
      class="nav-item"
    >
      <router-link
        :to="'/manufacture/processing/output'"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('output') | uppercase }}</span>
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
