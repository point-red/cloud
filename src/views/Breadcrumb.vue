<template>
  <div class="block">
    <nav class="breadcrumb bg-white push">
      <router-link
        to="/menu"
        class="breadcrumb-item">Menu</router-link>
      <slot/>
    </nav>
  </div>
</template>
