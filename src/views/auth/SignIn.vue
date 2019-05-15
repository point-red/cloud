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
          :disabled="isLoading"
          type="submit"
          class="btn btn-sm btn-hero btn-primary">
          <i
            v-show="isLoading"
            class="fa fa-asterisk fa-spin"/>
          <i
            v-show="!isLoading"
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
import firebase from 'firebase/app'

export default {
  data () {
    return {
      username: '',
      password: '',
      token: '',
      isLoading: false
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

    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()
      console.log('Created Messaging.')
      messaging.requestPermission().then(function () {
        console.log('Notification permission granted.')
        return messaging.getToken()
      }).then(token => {
        this.token = token      
      }).catch(error => {
        console.log('Unable to get permission to notify.', error)
      })
    }
    
  },
  methods: {
    ...mapActions('auth', ['tryAutoLogin']),
    ...mapActions('uiHandler', ['showLoadingBlock', 'dismissLoadingBlock']),
    ...mapActions('firebaseToken', ['create']),
    onSubmit () {
      this.isLoading = true
      this.$store.dispatch('auth/login', {
        username: this.username,
        password: this.password
      }).then(response => {
        if (this.token) {
          this.create({
            token: this.token
          }).then(response => {
          }).catch(error => {
            console.log(error)
          }).then(() => {
            this.isLoading = false
            this.$router.replace(this.redirectTo)
          })
        } else {
          this.isLoading = false
          this.$router.replace(this.redirectTo)
        }
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.data.message)
      })
    }
  }
}
</script>
