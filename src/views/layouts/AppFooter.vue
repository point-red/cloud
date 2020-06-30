<template>
  <footer
    id="page-footer"
  >
    <div class="content py-20 font-size-xs clearfix">
      <div class="float-right">
        Crafted with <i class="fa fa-heart text-pulse" /> by <a
          class="font-w600"
          href="javascript:void(0)"
          target="_blank"
        >RED POINT</a>
      </div>
      <div class="float-left">
        VERSION {{ version }} | &copy; 2020
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      version: process.env.VUE_APP_VERSION
    }
  }
}
</script>
