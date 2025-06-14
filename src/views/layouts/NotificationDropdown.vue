<template>
  <div
    v-click-outside="close"
    class="btn-group"
    role="group"
  >
    <a
      href="javascript:void(0)"
      class="btn text-black position-relative notification-bell"
      @click="toggle"
    >
      <i class="fa fa-bell" />
      <span
        v-if="unreadMessages > 0"
        class="badge badge-danger notification-badge"
      >
        {{ unreadMessages }}
      </span>
    </a>
    <div
      ref="dropdownMenu"
      class="dropdown-menu dropdown-menu-right notification-dropdown"
      :class="{'show': show}"
      @scroll.passive="handleScroll"
    >
      <div class="dropdown-header d-flex justify-content-between align-items-center">
        <span class="title">Notifications</span>
        <button
          v-if="unreadMessages > 0"
          class="btn btn-link mark-all-btn"
          @click="handleMarkAllAsRead"
        >
          Mark all as read
        </button>
      </div>
      <ul class="list-unstyled notification-list">
        <template
          v-for="(group, groupKey) in ['today', 'yesterday', 'older']"
        >
          <template v-if="categorizedNotifications[group].length">
            <li
              :key="groupKey"
              class="category-label"
            >
              {{ group.charAt(0).toUpperCase() + group.slice(1) }}
            </li>
            <li
              v-for="(notification, index) in categorizedNotifications[group]"
              :key="groupKey + '-' + index"
              class="notification-item d-flex align-items-start"
              :class="{ 'bg-light': notification.status === 'UNREAD' }"
              @click="handleNotificationClick(notification, index)"
            >
              <div class="notif-icon">
                <i
                  v-if="notification.type == 'info'"
                  class="fa fa-fw fa-info-circle text-info"
                />
                <i
                  v-if="notification.type == 'warning'"
                  class="fa fa-fw fa-exclamation-triangle text-warning"
                />
                <i
                  v-if="notification.type == 'reminder'"
                  class="fa fa-fw fa-calendar text-success"
                />
                <i
                  v-if="!['info','warning','reminder'].includes(notification.type)"
                  class="fa fa-fw fa-bell text-secondary"
                />
              </div>
              <div class="media-body pr-10">
                <div class="d-flex justify-content-between align-items-center">
                  <p
                    class="mb-0 notif-message"
                    :class="{ 'font-weight-bold': notification.status === 'UNREAD' }"
                  >
                    {{ notification.message }}
                    <span
                      v-if="notification.status === 'UNREAD'"
                      class="badge badge-danger ml-2 badge-new"
                    >NEW</span>
                  </p>
                  <span class="notif-label ml-2">
                    {{ getNotificationTimeLabel(notification.created_at || notification.createdAt) }}
                  </span>
                </div>
                <div class="notif-date">
                  {{ (notification.created_at || notification.createdAt) | fromNow }}
                </div>
                <!-- <a
                  class="stretched-link"
                  href="javascript:void(0)"
                  tabindex="-1"
                  aria-label="Open notification"
                  @click.prevent="handleNotificationClick(notification, index)"
                /> -->
              </div>
            </li>
          </template>
        </template>
        <li
          v-if="isLoadingMore"
          class="text-center py-10"
        >
          <i class="fa fa-spinner fa-spin" /> Loading...
        </li>
        <li
          v-if="!isLoading && !isLoadingMore && localNotifications.length === 0"
          class="text-center text-muted py-20"
        >
          <i class="fa fa-inbox fa-2x mb-10" /><br>
          No notifications
        </li>
      </ul>
      <div class="dropdown-divider" />
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
    },
    categorizedNotifications () {
      const now = Date.now()
      const today = []
      const yesterday = []
      const older = []
      this.localNotifications.forEach(notif => {
        const notifTime = new Date(notif.created_at || notif.createdAt).getTime()
        const diff = (now - notifTime) / (1000 * 60 * 60) // dalam jam
        if (diff <= 24) {
          today.push(notif)
        } else if (diff > 24 && diff <= 48) {
          yesterday.push(notif)
        } else {
          older.push(notif)
        }
      })
      return { today, yesterday, older }
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
    ...mapActions('notification', ['get', 'update', 'markAllAsRead']),
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
    },
    async handleMarkAllAsRead () {
      try {
        // Pastikan action mengembalikan data notifikasi yang sudah diupdate
        const response = await this.markAllAsRead()
        // Jika backend mengembalikan notifikasi yang sudah diupdate, gunakan itu
        if (response && response.data) {
          this.localNotifications = response.data
        } else {
          // Jika tidak, update status lokal saja
          this.localNotifications = this.localNotifications.map(notif => ({
            ...notif,
            status: 'READ'
          }))
        }
        this.unreadMessages = 0
      } catch (e) {
        // Optional: tampilkan error jika gagal
        this.$toast && this.$toast.error('Failed to mark all as read')
      }
    }
  }
}
</script>
<style scoped>
.notification-bell {
  margin-top: -4px;
  padding: 8px !important;
  font-size: 18px;
  transition: color 0.2s;
}
.notification-bell:hover {
  color: #1890ff;
}
.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 8px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.notification-dropdown {
  right: -130px;
  min-width: 380px;
  max-width: 400px;
  max-height: 600px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border: none;
  background: #fff;
  padding-bottom: 0;
}
.dropdown-header {
  padding: 12px 18px 12px 18px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
}
.title {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 1px;
}
.mark-all-btn {
  font-size: 11px;
  text-decoration: underline;
  color: #1890ff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.mark-all-btn:hover {
  color: #0056b3;
}
.notification-list {
  margin: 0;
  padding: 0 0 0 0;
}
.category-label {
  font-weight: bold;
  text-transform: uppercase;
  color: #bfbfbf;
  font-size: 12px;
  padding: 10px 18px 5px 18px;
  background: #f7f9fa;
  border-bottom: 1px solid #f0f0f0;
  letter-spacing: 1px;
}
.notification-item {
  padding: 12px 18px 12px 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: relative;
  transition: background 0.2s;
  border-radius: 0;
}
.notification-item.bg-light {
  background: #f0f5ff !important;
}
.notification-item:hover {
  background: #e6f7ff;
  cursor: pointer;
}
.notif-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 10px;
  border-radius: 50%;
  background: #f5f7fa;
}
.notif-message {
  font-size: 15px;
  margin-bottom: 0;
  color: #222;
}
.badge-new {
  font-size: 8px;
  padding: 2px 6px;
  border-radius: 6px;
  margin-left: 6px;
  background: #ff7875;
}
.notif-label {
  font-size: 11px;
  color: #bfbfbf;
  font-style: italic;
}
.notif-date {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
  font-style: italic;
}
.view-all-link {
  color: #1890ff;
  font-weight: 500;
  padding: 12px 0;
  border-radius: 0 0 10px 10px;
  background: #f7f9fa;
  transition: background 0.2s;
}
.view-all-link:hover {
  background: #e6f7ff;
  color: #0056b3;
}
</style>
