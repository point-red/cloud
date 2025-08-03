<template>
  <div
    id="app"
    style="heigth: 900px"
    @click="closeHeaderDropdown($event)"
  >
    <network>
      <span slot="online">
        <transition name="fade">
          <router-view />
        </transition>
      </span>
      <span slot="offline">
        <div class="hero bg-white">
          <div class="hero-inner">
            <div class="content content-full">
              <div class="py-30 text-center">
                <div class="display-3 text-danger">
                  <i class="fa fa-plug" />
                </div>
                <h1 class="h2 font-w700 mt-30 mb-10 text-danger">Oops.. You are not connected to the internet..</h1>
                <h2 class="h3 font-w400 text-muted mb-50">Please connect to the internet..</h2>
              </div>
            </div>
          </div>
        </div>
      </span>
    </network>
    <notifications
      :max="3"
      :duration="5000"
      group="notification"
      position="bottom right"
    />
    <p-loading-block v-show="isLoadingBlock" />
  </div>
</template>

<script>
import Network from '@/network'
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase/app'

export default {
  name: 'App',
  components: {
    Network
  },
  computed: {
    ...mapGetters('uiHandler', ['isLoadingBlock']),
    isLoggedIn () {
      return !!this.$store.getters['auth/isAuthenticated'] // Check if user is logged in
    }
  },
  created () {
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()

      // Force ask notification permission on first load
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.registerPushNotificationToken(messaging)
          }
        })
      }

      messaging.requestPermission().then(() => {
        messaging.onMessage((payload) => {
          console.log('Message received. ', payload)
        })
      }).catch(error => {
        console.log('Unable to get permission to notify.', error)
      })
    } else {
      console.log('Push API not supported in this browser.')
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
    document.getElementById('app').style.minHeight = window.innerHeight + 'px'

    if ('Notification' in window && Notification.permission === 'granted') {
      const messaging = firebase.messaging()
      this.registerPushNotificationToken(messaging)
    }

    if ('serviceWorker' in navigator) {
      if (this._swMessageHandler) {
        navigator.serviceWorker.removeEventListener('message', this._swMessageHandler)
      }

      this._swMessageHandler = (event) => {
        const data = event.data
        if (!data || typeof data !== 'object') return

        if (data.type === 'notification-click' && data.path && data.domainProject) {
          console.log('Notification click event received:', data)

          let domainProject = (data.domainProject || '').replace(/\/$/, '')
          if (!/^https?:\/\//.test(domainProject)) {
            domainProject = `${window.location.protocol}//${domainProject}`
          }

          const currentDomain = window.location.origin
          const targetPath = data.path.startsWith('/') ? data.path : `/${data.path}`

          if (domainProject !== currentDomain) {
            this.$store.dispatch('uiHandler/showLoadingBlock', 'Mengalihkan ke aplikasi lain...')
            setTimeout(() => {
              this.$store.dispatch('uiHandler/dismissLoadingBlock')
              alert('Gagal mengalihkan ke aplikasi tujuan. Silakan cek koneksi atau hubungi admin.')
            }, 15000)

            window.location.assign(`${domainProject}${targetPath}`)
          } else {
            if (this.$router.currentRoute.path !== targetPath) {
              this.$router.push(targetPath).catch(() => {})
            }
          }
        }

        if (data.type === 'mark-as-read' && data.id) {
          this.markAsRead(data.id)
        }
      }

      navigator.serviceWorker.addEventListener('message', this._swMessageHandler)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions('notification', ['get', 'update', 'markAllAsRead', 'markAsRead']),
    ...mapActions('firebaseToken', ['create']),
    closeHeaderDropdown (event) {
      if (event.target.id !== 'page-header-user-dropdown') {
        this.$store.dispatch('uiHandler/closeHeaderDropdown')
      }
    },
    handleResize (event) {
      document.getElementById('app').style.minHeight = window.innerHeight + 'px'
    },
    async registerPushNotificationToken (messaging) {
      if (!this.isLoggedIn) {
        console.log('User is not logged in. Skipping token registration.')
        return
      }

      try {
        const token = await messaging.getToken()
        if (token) {
          console.log('Push notification token:', token)
          await this.create({ token })
          console.log('Push notification token registered successfully.')
        } else {
          console.log('No push notification token available.')
        }
      } catch (error) {
        console.error('Failed to register push notification token:', error)
      }
    }
  }
}
</script>

<style>
/* Existing styles */
</style>
