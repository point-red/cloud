<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('create play book procedure')"
      class="nav-item"
    >
      <router-link
        to="/plugin/play-book/approval/procedure"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('procedure') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('create play book instruction')"
      class="nav-item"
    >
      <router-link
        to="/plugin/play-book/approval/instruction"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('instruction') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right" />
  </ul>
</template>
