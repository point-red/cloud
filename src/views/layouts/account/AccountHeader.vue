<template>
  <header id="page-header">
    <!-- Header Loader -->
    <!-- <div
      v-show="pointUpdateAvailable"
      style="position:relative"
      id="page-header-loader"
      class="overlay-header bg-danger text-white"
      :class="{ 'show': pointUpdateAvailable === true }">
      <div class="content-header content-header-fullrow text-center">
        <div class="content-header-item">
          <i class="fa fa-warning"></i> UPDATE {{ pointSwVersion }} IS AVAILABLE <a href="javascript:void(0)" @click="updateNow()">UPDATE NOW</a> OR <a href="javascript:void(0)" @click="updateLater()">LATER</a>
        </div>
      </div>
    </div> -->
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
          @click="toggleLeftSidebar"
        >
          <i class="fa fa-navicon" />
        </button>
        <!-- END Toggle Sidebar -->
      </div>
      <!-- END Left Section -->

      <!-- Right Section -->
      <div class="content-header-section">
        <notification-dropdown />
        <header-dropdown />
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
  components: {
    HeaderDropdown,
    NotificationDropdown
  },
  created () {
    console.log(this.pointSwVersion + ' !== ' + this.pointPackageVersion)
    if (this.pointSwVersion !== this.pointPackageVersion) {
      this.pointUpdateAvailable = true
    }
  },
  methods: {
    ...mapActions('uiHandler', ['toggleLeftSidebar']),
    updateLater () {
      this.pointUpdateAvailable = false
    },
    updateNow () {
      localStorage.setItem('pointSwVersion', this.pointPackageVersion)
      window.location.reload(true)
    }
  }
}
</script>
