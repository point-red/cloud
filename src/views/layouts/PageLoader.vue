<template>
  <div
    id="page-loader"
    :class="{ 'show' : isPageLoaderOpened}"
    class="bg-gd-cherry"
  />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('uiHandler', ['isPageLoaderOpened'])
  }
}
</script>
