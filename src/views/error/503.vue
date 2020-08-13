<template>
  <div class="hero bg-white">
    <div class="hero-inner">
      <div class="content content-full">
        <div class="py-30 text-center">
          <div class="display-3 text-danger">
            <i class="fa fa-warning" /> Maintenance
          </div>
          <h1 class="h2 font-w700 mt-30 mb-10">
            We're undergoing a bit of scheduled maintenance for updating feature and performance.
          </h1>
          <h2 class="h3 font-w400 text-muted mb-50">
            Sorry for the inconvenience. We'll be back up and running as fast as possible.
          </h2>
          <a
            href="javascript:void(0)"
            class="btn btn-hero btn-rounded btn-alt-secondary"
            @click="refresh"
          >
            <i class="fa fa-refresh mr-10" /> Refresh
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    refresh () {
      this.$router.replace('/')
    }
  }
}
</script>
