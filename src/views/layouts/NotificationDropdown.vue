<template>
  <div
    v-click-outside="close"
    class="btn-group"
    role="group"
  >
    <a
      href="javascript:void(0)"
      class="btn text-black position-relative"
      style="margin-top: -4px; padding: 8px !important"
      @click="toggle"
    >
      <i
        class="fa fa-bell"
        style="font-size: 18px;"
      />
      <span
        v-if="unreadMessages > 0"
        class="badge badge-danger position-absolute"
        style="top: 2px; right: 2px; font-size: 10px;"
      >
        {{ unreadMessages }}
      </span>
    </a>
    <div
      ref="dropdownMenu"
      class="dropdown-menu dropdown-menu-right min-width-300"
      style="right: -130px; max-height: 400px; overflow-y: auto;"
      :class="{'show': show}"
      @scroll.passive="handleScroll"
    >
      <h5 class="h6 text-center py-10 mb-0 border-b text-uppercase">
        Notifications
      </h5>
      <ul class="list-unstyled my-20">
        <li
          v-for="(notification, index) in localNotifications"
          :key="index"
        >
          <a
            class="text-body-color-dark media mb-15"
            href="javascript:void(0)"
            :style="notification.status === 'UNREAD' ? 'font-weight: bold;' : ''"
            @click.prevent="handleNotificationClick(notification, index)"
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
              <div class="text-muted font-size-sm font-italic">
                {{ notification.createdAt | fromNow }}
                <span class="ml-5">• {{ getNotificationTimeLabel(notification.created_at) }}</span>
              </div>
            </div>
          </a>
        </li>
        <li
          v-if="isLoadingMore"
          class="text-center py-10"
        >
          <i class="fa fa-spinner fa-spin" /> Loading...
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
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  data () {
    return {
      show: false,
      page: 1,
      isLoading: false,
      isLoadingMore: false,
      allLoaded: false,
      localNotifications: [],
      unsubscribeFirestore: null,
      unreadMessages: 0
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('notification', ['pagination']),
    totalNotifications () {
      return this.pagination && this.pagination.total
        ? this.pagination.total
        : 0
    }
  },
  watch: {
    authUser: {
      handler (val) {
        if (val) {
          this.listenFirestore()
          this.resetAndFetch()
        } else {
          this.unsubscribeFirestore && this.unsubscribeFirestore()
        }
      },
      immediate: true
    },
    show (val) {
      if (val) {
        this.resetAndFetch()
      }
    }
  },
  beforeDestroy () {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore()
    }
  },
  methods: {
    ...mapActions('notification', ['get', 'update']),
    fetchNotifications (append = false) {
      if (this.isLoading || this.isLoadingMore || this.allLoaded) return
      if (append) this.isLoadingMore = true
      else this.isLoading = true

      this.get({
        params: {
          page: this.page,
          per_page: 10
        }
      }).then(response => {
        const data = response.data || []
        this.unreadMessages = response.unread_count || 0
        if (append) {
          this.localNotifications = [...this.localNotifications, ...data]
        } else {
          this.localNotifications = data
        }
        if (data.length < 10) this.allLoaded = true
        this.page++
      }).finally(() => {
        this.isLoading = false
        this.isLoadingMore = false
      })
    },
    handleScroll (e) {
      const el = e.target
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        this.fetchNotifications(true)
      }
    },
    toggle () {
      this.show = !this.show
    },
    close () {
      this.show = false
    },
    resetAndFetch () {
      this.page = 1
      this.allLoaded = false
      this.isLoading = false
      this.isLoadingMore = false
      this.localNotifications = []
      this.fetchNotifications(false)
    },
    listenFirestore () {
      if (this.unsubscribeFirestore) {
        this.unsubscribeFirestore()
      }
      if (!this.authUser || !this.authUser.id) return
      const query = firebase.firestore()
        .collection('notifications')
        .where('userId', '==', this.authUser.id)
      this.unsubscribeFirestore = query.onSnapshot(() => {
        this.resetAndFetch()
      })
    },
    handleNotificationClick (notification, index) {
      if (notification.status === 'UNREAD') {
        // Update status ke backend
        this.update({ id: notification.id, status: 'READ' }).then(() => {
          // Update status di local agar langsung berubah warna
          this.$set(this.localNotifications, index, {
            ...notification,
            status: 'READ'
          })
          // Redirect ke url tujuan
          window.location.href = notification.link
        })
      } else {
        window.location.href = notification.link
      }
    },
    getNotificationTimeLabel (dateString) {
      const notifDate = new Date(dateString)
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      function isSameDay (d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
      }

      if (isSameDay(notifDate, today)) {
        return 'Today'
      } else if (isSameDay(notifDate, yesterday)) {
        return 'Yesterday'
      } else {
        return 'Older'
      }
    }
  }
}
</script>
