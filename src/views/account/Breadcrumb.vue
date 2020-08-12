<template>
  <div class="block">
    <nav class="breadcrumb bg-white push">
      <router-link
        to="/account"
        class="breadcrumb-item"
      >
        {{ $t('account') | uppercase }}
      </router-link>
      <slot />
    </nav>
  </div>
</template>
