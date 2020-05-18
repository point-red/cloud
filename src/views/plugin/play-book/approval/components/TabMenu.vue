<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('create play book procedures code')">
      <router-link
        to="/plugin/play-book/approval/procedure"
        class="nav-link"
        active-class="active">
        <span>{{ $t('procedure') | uppercase }}</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('create play book instructions')">
      <router-link
        to="/plugin/play-book/approval/instruction"
        class="nav-link"
        active-class="active">
        <span>{{ $t('instruction') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right"></slot>
  </ul>
</template>
