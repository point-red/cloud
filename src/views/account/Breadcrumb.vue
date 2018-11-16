<template>
  <div class="block">
    <nav class="breadcrumb bg-white push">
      <router-link
        to="/account"
        class="breadcrumb-item">Account</router-link>
      <slot/>
    </nav>
  </div>
</template>
