<template>
  <div
    v-click-outside="close"
    class="btn-group"
    role="group"
  >
    <button
      type="button"
      class="btn btn-rounded btn-dual-secondary"
      @click="toggle"
    >
      <i class="fa fa-bell mr-5" />
      <span
        v-if="notifications.length > 0"
        class="badge badge-danger badge-pill"
      >{{ notifications.length }}</span>
    </button>
    <div
      class="dropdown-menu dropdown-menu-right min-width-300"
      :class="{'show': show}"
    >
      <h5 class="h6 text-center py-10 mb-0 border-b text-uppercase">
        Notifications
      </h5>
      <ul class="list-unstyled my-20">
        <li
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <a
            class="text-body-color-dark media mb-15"
            :href="'//'+notification.clickAction"
          >
            <div class="ml-5 mr-15">
              <i
                v-if="notification.type == 'info'"
                class="fa fa-fw fa-info-circle text-primary"
              />
              <i
                v-if="notification.type == 'warning'"
                class="fa fa-fw fa-warning text-warning"
              />
              <i
                v-if="notification.type == 'reminder'"
                class="fa fa-fw fa-calendar text-info"
              />
            </div>
            <div class="media-body pr-10">
              <p class="mb-0">{{ notification.message }}</p>
              <div class="text-muted font-size-sm font-italic">{{ notification.createdAt | fromNow }}</div>
            </div>
          </a>
        </li>
      </ul>
      <div class="dropdown-divider" />
      <a
        class="dropdown-item text-center mb-0"
        href="javascript:void(0)"
      >
        <i class="fa fa-bell mr-5" /> View All
      </a>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { mapGetters } from 'vuex'
import Echo from 'laravel-echo'
window.io = require('socket.io-client')

export default {
  data () {
    return {
      show: false,
      notifications: [],
      echo: new Echo({
        broadcaster: 'socket.io',
        // host: 'http://127.0.0.1:6001'
        host: process.env.VUE_APP_API_SOCKET
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    authUser () {
      var self = this
      if (this.authUser) {
        firebase.firestore().collection('notifications')
          .orderBy('createdAt', 'desc')
          .where('userId', '==', this.authUser.id)
          .limit(4)
          .onSnapshot(function (querySnapshot) {
            self.notifications = []
            querySnapshot.forEach(function (doc) {
              const data = {
                type: 'info',
                message: doc.data().message,
                clickAction: doc.data().clickAction,
                createdAt: doc.data().createdAt
              }
              self.notifications.push(data)
            })
          })
      }
    }
  },
  mounted () {
    // Contract Reminder
    this.echo.channel('EveryoneChannel')
      .listen('.EveryoneMessage', (e) => {
        const notifIndex = this.notifications
          .findIndex(o => o.message === e.message)

        if (this.authUser.id === e.user && notifIndex < 0) {
          const data = {
            type: 'reminder',
            message: e.message,
            clickAction: 'klik',
            createdAt: new Date()
          }

          this.notifications.push(data)
        }
      })
  },
  methods: {
    toggle () {
      this.show = !this.show
    },
    close () {
      this.show = false
    }
  }
}
</script>
