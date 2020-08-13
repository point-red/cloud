<template>
  <div>
    <div class="content content-full">
      <div class="text-center">
        <div class="display-3 text-danger" />
        <h1 class="h2 font-w700 mt-30 mb-10 text-danger">
          <i class="fa fa-warning" /> {{ title }}
        </h1>
        <h2 class="h3 font-w400 text-muted mb-50">
          {{ message }}
        </h2>
        <a
          href="javascript:void(0)"
          class="btn btn-hero btn-rounded btn-alt-secondary"
          @click="back"
        >
          <i class="fa fa-arrow-left mr-10" /> Back
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$route.params.title || 'Whoops.. You just found an error page',
      message: this.$route.params.message || 'We are sorry but the page you are looking for was not found..'
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
