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
import { mapGetters } from 'vuex'
import firebase from 'firebase/app'

export default {
  name: 'App',
  components: {
    Network
  },
  computed: {
    ...mapGetters('uiHandler', ['isLoadingBlock'])
  },
  created () {
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()
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
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    closeHeaderDropdown (event) {
      if (event.target.id !== 'page-header-user-dropdown') {
        this.$store.dispatch('uiHandler/closeHeaderDropdown')
      }
    },
    handleResize (event) {
      document.getElementById('app').style.minHeight = window.innerHeight + 'px'
    }
  }
}
</script>

<style>
.no-wrap {
  white-space: nowrap;
}
.vue-notification.info {
  background: #0c80df;
  border-left-color: #0073d1;
}
.vue-notification-group {
  z-index: 9999 !important;
}
.full-width {
  width: 100%;
}
.block.block-mode-loading::after {
  top: 50px;
}

.block-content-inner {
  padding: 0px !important;
}
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to
{
  opacity: 0;
  transition: opacity;
} */

.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.invalid-input {
  display: block;
  margin-top: .25rem;
  font-size: .875rem;
  color: #ef5350;
}
.swal2-container {
  z-index: 9060 !important;
}
</style>
