<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read warehouse')"
      class="nav-item"
    >
      <router-link
        to="/master/warehouse"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('warehouse') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right" />
  </ul>
</template>
