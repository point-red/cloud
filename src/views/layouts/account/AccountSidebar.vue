<template>
  <nav id="sidebar">
    <!-- Sidebar Scroll Container -->
    <div
      id="sidebar-scroll"
      :v-scroll-lock="true"
    >
      <!-- Sidebar Content -->
      <div class="sidebar-content">
        <!-- Side Header -->
        <div class="content-header content-header-fullrow px-15">
          <!-- Mini Mode -->
          <div class="content-header-section sidebar-mini-visible-b">
            <!-- Logo -->
            <span class="content-header-item font-w700 font-size-xl float-left animated fadeIn">
              <span class="text-dual-primary-dark">p</span><span class="text-primary">r</span>
            </span>
            <!-- END Logo -->
          </div>
          <!-- END Mini Mode -->

          <!-- Normal Mode -->
          <div class="content-header-section text-center align-parent sidebar-mini-hidden">
            <!-- Close Sidebar, Visible only on mobile screens -->
            <!-- Layout API, functionality initialized in Codebase() -> uiApiLayout() -->
            <button
              type="button"
              class="btn btn-circle btn-dual-secondary d-lg-none align-v-r"
              @click="toggleLeftSidebar"
            >
              <i class="fa fa-times text-danger" />
            </button>
            <!-- END Close Sidebar -->

            <!-- Logo -->
            <div class="content-header-item">
              <a
                class="link-effect font-w700"
                href="javascript:void(0)"
              >
                <span class="font-size-xl text-dual-primary-dark">POINT.</span><span class="font-size-xl text-primary" />
              </a>
            </div>
            <!-- END Logo -->
          </div>
          <!-- END Normal Mode -->
        </div>
        <!-- END Side Header -->

        <!-- Side User -->
        <div class="content-side content-side-full content-side-user px-10 align-parent">
          <!-- Visible only in mini mode -->
          <div class="sidebar-mini-visible-b align-v animated fadeIn">
            <img
              class="img-avatar img-avatar32"
              src="/assets/img/avatars/avatar0.jpg"
              alt=""
            >
          </div>
          <!-- END Visible only in mini mode -->

          <!-- Visible only in normal mode -->
          <div class="sidebar-mini-hidden-b text-center">
            <router-link
              to="/account"
              class="img-link"
            >
              <img
                class="img-avatar"
                src="/assets/img/avatars/avatar0.jpg"
                alt=""
              >
            </router-link>
            <ul class="list-inline mt-3 mb-0">
              <li class="list-inline-item">
                <a
                  :href="accountPage + '/profile'"
                  class="link-effect text-dual-primary-dark font-size-xs font-w600 text-uppercase"
                >
                  {{ userName }}
                </a>
              </li>
            </ul>
          </div>
          <!-- END Visible only in normal mode -->
        </div>
        <!-- END Side User -->

        <!-- Side Navigation -->
        <div class="content-side content-side-full">
          <ul class="nav-main">
            <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/profile"
                active-class="active"
                class="sidebar-mini-hide"
              >
                <i class="si si-user" /> {{ $t("profile") | uppercase }}
              </router-link>
            </li>
            <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/project"
                active-class="active"
                class="sidebar-mini-hide"
              >
                <i class="si si-notebook" /> {{ $t("project") | uppercase }}
              </router-link>
            </li>
            <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/billing"
                active-class="active"
                class="sidebar-mini-hide"
              >
                <i class="si si-doc" /> {{ $t("billing") | uppercase }}
              </router-link>
            </li>
            <!-- <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/notification"
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-info"/> {{ $t("notification") | uppercase }}</router-link>
            </li> -->
            <!-- <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/reward"
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-diamond"/> {{ $t("reward") | uppercase }}</router-link>
            </li> -->
            <!-- <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/referral"
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-share"/> {{ $t("referral") | uppercase }}</router-link>
            </li> -->
            <!-- <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/account/email-subscription"
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-envelope"/> {{ $t("email subscription") | uppercase }}</router-link>
            </li> -->
          </ul>
        </div>
        <!-- END Side Navigation -->
      </div>
      <!-- Sidebar Content -->
    </div>
    <!-- END Sidebar Scroll Container -->
  </nav>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    firstUri: {
      type: String,
      required: true
    },
    secondUri: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      userName: localStorage.getItem('userName'),
      accountPage: '//' + process.env.VUE_APP_DOMAIN + '/account'
    }
  },
  methods: {
    ...mapActions('uiHandler', ['toggleLeftSidebar', 'toggleSidebarInverse'])
  }
}
</script>

<style scoped>
#sidebar-scroll {
  overflow-y: auto;
  height: 100% !important;
}
#page-container.sidebar-inverse #sidebar {
  background-color: #212121;
}
#page-container.sidebar-inverse #sidebar .content-side-user {
  background-color: #424242;
  height: auto;
}
</style>
