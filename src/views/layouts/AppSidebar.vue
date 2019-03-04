<template>
  <nav
    id="sidebar"
    ref="sidebarRef">
    <!-- Sidebar Scroll Container -->
    <div
      v-slimscroll="options"
      id="sidebar-scroll">
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
              @click="toggleLeftSidebar">
              <i class="fa fa-times text-danger"/>
            </button>
            <!-- END Close Sidebar -->

            <!-- Logo -->
            <div class="content-header-item">
              <router-link
                to="/"
                exact
                active-class="active"
                class="link-effect font-w700">
                  <span class="font-size-xl text-dual-primary-dark">POINT.</span>
                </router-link>
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
              alt="">
          </div>
          <!-- END Visible only in mini mode -->

          <!-- Visible only in normal mode -->
          <div class="sidebar-mini-hidden-b text-center">
            <a
              :href="accountPage"
              class="img-link">
              <img
                class="img-avatar"
                src="/assets/img/avatars/avatar0.jpg"
                alt="">
            </a>
            <ul class="list-inline mt-10">
              <li class="list-inline-item">
                <a
                  :href="accountPage"
                  class="link-effect text-dual-primary-dark font-size-xs font-w600 text-uppercase">
                  {{ userName }}
                </a>
              </li>
              <li class="list-inline-item">
                <!-- Layout API, functionality initialized in Codebase() -> uiApiLayout() -->
                <a
                  class="link-effect text-dual-primary-dark"
                  href="javascript:void(0)"
                  @click="toggleSidebarInverse">
                  <i class="si si-drop"/>
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  href="javascript:void(0)"
                  class="link-effect text-dual-primary-dark"
                  @click="logout">
                  <i class="si si-logout"/>
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
                to="/"
                exact
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-speedometer"/> {{ $t("dashboard") | titlecase }}</router-link>
            </li>
            <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/menu"
                exact
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-list"/> {{ $t("main menu") | titlecase }}</router-link>
            </li>
            <li class="nav-main-heading">
              <span class="sidebar-mini-visible">MD</span>
              <span class="sidebar-mini-hidden">Modules</span>
            </li>
            <li :class="{ 'open' : firstUri === 'master' }" v-if="$permission.has('menu master')">
              <router-link
                to="/master"
                class="nav-submenu"
                active-class="active">
                <i class="si si-layers"/>
                <span class="sidebar-mini-hide">{{ $t("master") | titlecase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read user')">
                  <router-link to="/master/user" active-class="active">
                    {{ $t('user') | titlecase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read role')">
                  <router-link to="/master/role" active-class="active">
                    {{ $t('role & permission') | titlecase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read customer')">
                  <router-link to="/master/customer" active-class="active">
                    {{ $t('customer') | titlecase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read supplier')">
                  <router-link to="/master/supplier" active-class="active">
                    {{ $t('supplier') | titlecase }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'human-resource' }" v-if="$permission.has('menu human resource')">
              <router-link to="/human-resource" class="nav-submenu" active-class="active">
                <i class="si si-emoticon-smile"/>
                <span class="sidebar-mini-hide">{{ $t("human resource") | titlecase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read employee') || $permission.has('create employee assessment') || $permission.has('read employee assessment')">
                  <router-link
                    to="/human-resource/employee"
                    active-class="active">{{ $t('employee') | titlecase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read employee kpi')">
                  <router-link
                    to="/human-resource/kpi"
                    active-class="active">{{ $t('kpi template') | titlecase }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'plugin' }" v-if="$permission.has('menu plugin')">
              <router-link
                to="/plugin"
                class="nav-submenu"
                active-class="active">
                <i class="si si-puzzle"/>
                <span class="sidebar-mini-hide">{{ $t("plugin") | titlecase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('menu scale weight')">
                  <router-link
                    to="/plugin/scale-weight"
                    active-class="active">{{ $t('scale weight') | titlecase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('menu pin point')">
                  <router-link
                    to="/plugin/pin-point"
                    active-class="active">{{'pin point' | titlecase }}
                  </router-link>
                </li>
              </ul>
            </li>
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
      accountPage: '//' + process.env.VUE_APP_DOMAIN + '/account',
      options: {
        height: window.innerHeight
      }
    }
  },
  methods: {
    ...mapActions('Auth', ['logout']),
    ...mapActions('UIHandler', ['toggleLeftSidebar', 'toggleSidebarInverse']),
    handleResize (event) {
      this.options.height = window.innerHeight + 'px'
      document.getElementById('sidebar-scroll').style.height = window.innerHeight + 'px'
      document.getElementById('sidebar-scroll').parentElement.style.height = window.innerHeight + 'px'
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
  }
}
</script>
