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
          <i class="fa fa-warning"></i> UPDATE {{ version }} IS AVAILABLE <a href="">UPDATE NOW</a> OR <a href="javascript:void(0)" @click="updateLater()">LATER</a>
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
        <!-- END Toggle Sidebar -->
      </div>
      <!-- END Left Section -->

      <!-- Right Section -->
      <div class="content-header-section">
        <notification-dropdown/>
        <header-dropdown/>
      </div>
      <!-- END Right Section -->
    </div>
    <!-- END Header Content -->
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import HeaderDropdown from './HeaderDropdown'
import NotificationDropdown from '../NotificationDropdown'

export default {
  data () {
    return {
      isNewUpdateAvailable: false,
      version: ''
    }
  },
  components: {
    HeaderDropdown,
    NotificationDropdown
  },
  methods: {
    ...mapActions('uiHandler', ['toggleLeftSidebar']),
    updateLater () {
      this.isNewUpdateAvailable = false
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
