<template>
  <header id="page-header">
    <!-- Header Loader -->
    <div
      v-show="isNewUpdateAvailable"
      style="position:relative"
      id="page-header-loader"
      class="overlay-header bg-danger text-white"
      :class="{ 'show': isNewUpdateAvailable === true }">
      <div class="content-header content-header-fullrow text-center">
        <div class="content-header-item">
          <i class="fa fa-warning"></i> UPDATE {{ version }} IS AVAILABLE <a href="javascript:void(0)" @click="updateNow()">UPDATE NOW</a> OR <a href="javascript:void(0)" @click="updateLater()">LATER</a>
        </div>
      </div>
    </div>
    <!-- END Header Loader -->

    <!-- Header Content -->
    <div class="content-header">
      <!-- Left Section -->
      <div class="content-header-section">
        <!-- Toggle Sidebar -->
        <!-- Layout API, functionality initialized in Codebase() -> uiApiLayout() -->
        <button
          type="button"
          class="btn btn-circle btn-dual-secondary"
          @click="toggleLeftSidebar">
          <i class="fa fa-navicon"/>
        </button>

        <span class="font-w600">{{ tenantName | uppercase }}</span>
        <!-- END Toggle Sidebar -->

        <!-- Open Search Section -->
        <!-- Layout API, functionality initialized in Codebase() -> uiApiLayout() -->
        <!-- <button
          type="button"
          class="btn btn-circle btn-dual-secondary"
          data-toggle="layout"
          data-action="header_search_on">
          <i class="fa fa-search"/>
        </button> -->
        <!-- END Open Search Section -->
      </div>
      <!-- END Left Section -->

      <!-- Right Section -->
      <div class="content-header-section">
        <notification-dropdown/>
        <header-dropdown/>

        <!-- Toggle Side Overlay -->
        <a
          href="javascript:void(0)"
          @click="toggleSideOverlay">
          <img
            class="img-avatar img-avatar32"
            src="/assets/img/avatars/vesa-girl.jpg"
            alt="">
        </a>
        <!-- END Toggle Side Overlay -->
      </div>
      <!-- END Right Section -->
    </div>
    <!-- END Header Content -->

    <!-- Header Search -->
    <div
      id="page-header-search"
      class="overlay-header">
      <div class="content-header content-header-fullrow">
        <form
          action=""
          method="post">
          <div class="input-group">
            <span class="input-group-btn">
              <!-- Close Search Section -->
              <!-- Layout API, functionality initialized in Codebase() -> uiApiLayout() -->
              <button
                type="button"
                class="btn btn-secondary px-15"
                data-toggle="layout"
                data-action="header_search_off">
                <i class="fa fa-times"/>
              </button>
              <!-- END Close Search Section -->
            </span>
            <input
              id="page-header-search-input"
              type="text"
              class="form-control"
              placeholder="Search or hit ESC.."
              name="page-header-search-input">
            <span class="input-group-btn">
              <button
                type="submit"
                class="btn btn-secondary px-15">
                <i class="fa fa-search"/>
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
    <!-- END Header Search -->
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import HeaderDropdown from './HeaderDropdown'
import NotificationDropdown from './NotificationDropdown'

export default {
  data () {
    return {
      tenantName: localStorage.getItem('tenantName'),
      isNewUpdateAvailable: false,
      version: ''
    }
  },
  components: {
    HeaderDropdown,
    NotificationDropdown
  },
  methods: {
    ...mapActions('uiHandler', ['toggleLeftSidebar', 'toggleSideOverlay']),
    updateLater () {
      this.isNewUpdateAvailable = false
    },
    updateNow () {
      window.location.reload(true)
    }
  },
  created () {
    this.version = process.env.VUE_APP_VERSION
    if (localStorage.getItem('version') !== process.env.VUE_APP_VERSION) {
      this.isNewUpdateAvailable = true
    }
  }
}
</script>
