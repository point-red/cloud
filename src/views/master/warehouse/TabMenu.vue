<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read warehouse')">
      <router-link
        to="/master/warehouse"
        class="nav-link"
        active-class="active">
        <span>{{ $t('warehouse') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right"></slot>
  </ul>
</template>
