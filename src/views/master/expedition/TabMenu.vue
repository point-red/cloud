<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read expedition')"
      class="nav-item"
    >
      <router-link
        to="/master/expedition"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('expedition') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right" />
  </ul>
</template>
