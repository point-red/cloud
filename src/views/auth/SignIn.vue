<template>
  <div>
    <!-- Header -->
    <div class="px-30 py-10 text-center">
      <div class="link-effect font-w700">
        <!-- ...logo SVG... -->
      </div>
      <h1 class="h3 font-w700 mt-30 mb-10">
        Welcome to Point.RED
      </h1>
    </div>
    <!-- END Header -->

    <div class="mb-30">
      <a
        class="btn btn-block btn-social btn-google text-white"
        href="javascript:void(0)"
        @click="loginWithGoogle()"
      >
        <span class="fa fa-google" /> Sign in with Google
      </a>
      <a
        class="btn btn-block btn-social btn-github text-white"
        href="javascript:void(0)"
        @click="loginWithGithub()"
      >
        <span class="fa fa-github" /> Sign in with Github
      </a>
    </div>
    <hr>
    <h2 class="h5 font-w400 text-muted mx-30 text-center">
      OR
    </h2>
    <!-- Sign In Form -->
    <form
      class="px-30"
      @submit.prevent="onSubmit"
    >
      <p-form-input-material
        id="username"
        v-model="username"
        label="Username"
        name="username"
      />
      <p-form-input-material
        id="password"
        v-model="password"
        label="Password"
        type="password"
        name="password"
      />

      <div class="form-group text-center">
        <button
          :disabled="isLoading || !fcmReady"
          type="submit"
          class="btn btn-sm btn-hero btn-outline-dark mb-10"
        >
          <i
            v-show="isLoading"
            class="fa fa-asterisk fa-spin"
          /> Sign In
        </button>
      </div>
      <span>{{ token }}</span>
      <div class="form-group text-center">
        <a
          class="text-center"
          href="/auth/forgot-password"
        >Forgot Password</a>
      </div>
      <div
        v-if="!fcmReady"
        class="text-danger text-center mt-2"
      >
        Mohon izinkan notifikasi untuk melanjutkan login.
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
      isLoading: false,
      fcmReady: false // <-- tambahkan state ini
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
    if (this.$route.query.access_token) {
      this.$cookie.set('TTT', 'Bearer', { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
      this.$cookie.set('TID', this.$route.query.id, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
      this.$cookie.set('TAT', this.$route.query.access_token, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
      this.$cookie.set('TED', this.$route.query.ed, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
    }
    if (this.$cookie.get('TAT') !== null) {
      this.showLoadingBlock()
      this.tryAutoLogin().then(response => {
        this.dismissLoadingBlock()
        this.$router.replace('/')
      }).catch(error => {
        this.dismissLoadingBlock()
        console.log(error.message)
      })
    }

    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()
      messaging.requestPermission().then(() => {
        return messaging.getToken()
      }).then(token => {
        this.token = token
        this.fcmReady = true // enable tombol login
      }).catch(error => {
        this.fcmReady = false // disable tombol login jika gagal
        console.log('Unable to get permission to notify.', error)
      })
    } else {
      // Jika browser tidak support, tetap enable login
      this.fcmReady = true
    }
  },
  methods: {
    ...mapActions('auth', ['tryAutoLogin']),
    ...mapActions('uiHandler', ['showLoadingBlock', 'dismissLoadingBlock']),
    ...mapActions('firebaseToken', ['create']),
    loginWithGoogle () {
      const url = process.env.VUE_APP_API_DOMAIN + '/login/google?callback=https://' + window.location.hostname + '/auth/signin'
      window.open(url, '_self')
    },
    loginWithGithub () {
      const url = process.env.VUE_APP_API_DOMAIN + '/login/github?callback=https://' + window.location.hostname + '/auth/signin'
      window.open(url, '_self')
    },
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
            this.$store.dispatch('reloadVuex')
            this.$router.replace(this.redirectTo)
          })
        } else {
          this.isLoading = false
          this.$store.dispatch('reloadVuex')
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
