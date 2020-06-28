<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-15"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li class="nav-item">
      <router-link
        to="/account/project"
        class="nav-link"
        active-class="active"
      >
        {{ $t('project') | uppercase }}
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        :to="'/account/join-project'"
        exact
        class="nav-link"
        active-class="active"
      >
        {{ $t('join') | uppercase }}
      </router-link>
    </li>
    <slot name="right" />
  </ul>
</template>
