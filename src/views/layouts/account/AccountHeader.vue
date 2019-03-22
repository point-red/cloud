<template>
  <header id="page-header">
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

    <!-- Header Loader -->
    <div
      id="page-header-loader"
      class="overlay-header bg-primary">
      <div class="content-header content-header-fullrow text-center">
        <div class="content-header-item">
          <i class="fa fa-sun-o fa-spin text-white"/>
        </div>
      </div>
    </div>
    <!-- END Header Loader -->
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import HeaderDropdown from '../HeaderDropdown'
import NotificationDropdown from '../NotificationDropdown'

export default {
  components: {
    HeaderDropdown,
    NotificationDropdown
  },
  methods: {
    ...mapActions('UIHandler', ['toggleLeftSidebar'])
  }
}
</script>
