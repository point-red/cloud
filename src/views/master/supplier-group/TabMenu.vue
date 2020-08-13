<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read supplier')"
      class="nav-item"
    >
      <router-link
        to="/master/supplier"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('supplier') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read supplier')"
      class="nav-item"
    >
      <router-link
        to="/master/supplier-group"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('group') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right" />
  </ul>
</template>
