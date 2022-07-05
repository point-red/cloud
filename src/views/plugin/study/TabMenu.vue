<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <!-- <slot /> -->
    <li
      v-if="$permission.has('read study subjects')"
      class="nav-item"
    >
      <router-link
        :to="{name: 'PluginStudySheetIndex'}"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('study sheet') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read study sheets')"
      class="nav-item"
    >
      <router-link
        :to="{name: 'PluginStudySubject'}"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('study subject') | uppercase }}</span>
      </router-link>
    </li>
    <!-- <slot name="right" /> -->
  </ul>
</template>

<script>
export default {
}
</script>
