<template>
  <div class="d-flex flex-nowrap" style="overflow-x:auto">
    <!-- <router-link
      to="/manufacture/processing"
      class="btn btn-secondary mr-5 mb-15"
      active-class="active"
      v-if="$permission.has('read manufacture processing')">
      <span>{{ $t('processing') | uppercase }}</span>
    </router-link> -->
    <router-link
      to="/manufacture/machine"
      class="btn btn-secondary mr-5 mb-15"
      active-class="active"
      v-if="$permission.has('read manufacture machine')">
      <span>{{ $t('machine') | uppercase }}</span>
    </router-link>
    <router-link
      to="/manufacture/process"
      class="btn btn-secondary mr-5 mb-15"
      active-class="active"
      v-if="$permission.has('read manufacture process')">
      <span>{{ $t('process') | uppercase }}</span>
    </router-link>
    <!-- <router-link
      to="/manufacture/formula"
      class="btn btn-secondary mr-5 mb-15"
      active-class="active"
      v-if="$permission.has('read manufacture formula')">
      <span>{{ $t('formula') | uppercase }}</span>
    </router-link> -->
  </div>
</template>
