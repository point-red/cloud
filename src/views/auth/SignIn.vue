<template>
  <div>
    <!-- Header -->
    <div class="px-30 py-10 text-center">
      <div class="link-effect font-w700"><img
        src="/assets/img/guest/logo.svg"
        alt=""></div>
      <h1 class="h3 font-w700 mt-30 mb-10">Welcome to Point.RED</h1>
      <h2 class="h5 font-w400 text-muted mb-0">Please sign in</h2>
    </div>
    <!-- END Header -->

    <!-- Sign In Form -->
    <form
      class="px-30"
      @submit.prevent="onSubmit">
      <p-form-input-material
        id="username"
        v-model="username"
        label="Username"
        name="username"/>
      <p-form-input-material
        id="password"
        v-model="password"
        label="Password"
        type="password"
        name="password"/>
      <!-- <p-form-check-box id="remember-me" name="remember-me" description="Remember me"></p-form-check-box> -->

      <div class="form-group text-center">
        <button
          :disabled="loadingSaveButton"
          type="submit"
          class="btn btn-sm btn-hero btn-primary">
          <i
            v-show="loadingSaveButton"
            class="fa fa-asterisk fa-spin"/>
          <i
            v-show="!loadingSaveButton"
            class="si si-login mr-10"/> Sign In
        </button>
        <div class="mt-30">
          <router-link
            class="link-effect text-muted mb-5 d-inline-block"
            to="/auth/forgot-password">
            <i class="fa fa-warning mr-5"/> Forgot Password
          </router-link>
        </div>
      </div>
    </form>
    <!-- END Sign In Form -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      username: '',
      password: '',
      loadingSaveButton: false
    }
  },
  computed: {
    redirectTo () {
      if (this.$route.query.r) {
        return this.$route.query.r
      }

      return '/'
    }
  },
  created () {
    if (this.$cookie.get('TAT') !== null) {
      this.showLoadingBlock()
      this.tryAutoLogin().then((response) => {
        this.dismissLoadingBlock()
        this.$router.replace('/')
      }, (error) => {
        this.dismissLoadingBlock()
        console.log(error.message)
      })
    }
  },
  methods: {
    ...mapActions('auth', ['tryAutoLogin']),
    ...mapActions('uiHandler', ['showLoadingBlock', 'dismissLoadingBlock']),
    onSubmit () {
      this.loadingSaveButton = true
      this.$store.dispatch('auth/login', {
        username: this.username,
        password: this.password
      }).then(
        (response) => {
          this.loadingSaveButton = false
          this.$router.replace(this.redirectTo)
        },
        (error) => {
          this.$notification.error(error.data.message)
          this.loadingSaveButton = false
        }
      )
    }
  }
}
</script>
