<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read manufacture processing')">
      <router-link
        :to="'/manufacture/processing/input'"
        class="nav-link"
        active-class="active">
        <span>{{ $t('input') | uppercase }}</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read manufacture processing')">
      <router-link
        :to="'/manufacture/processing/output'"
        class="nav-link"
        active-class="active">
        <span>{{ $t('output') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right"></slot>
  </ul>
</template>
