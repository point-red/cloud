<template>
  <!-- built files will be auto injected -->
  <!-- Page Container -->
  <!--
      Available classes for #page-container:

  GENERIC

      'enable-cookies'                            Remembers active color theme between pages (when set through color theme helper Codebase() -> uiHandleTheme())

  SIDEBAR & SIDE OVERLAY

      'sidebar-r'                                 Right Sidebar and left Side Overlay (default is left Sidebar and right Side Overlay)
      'sidebar-mini'                              Mini hoverable Sidebar (screen width > 991px)
      'sidebar-o'                                 Visible Sidebar by default (screen width > 991px)
      'sidebar-o-xs'                              Visible Sidebar by default (screen width < 992px)
      'sidebar-inverse'                           Dark themed sidebar

      'side-overlay-hover'                        Hoverable Side Overlay (screen width > 991px)
      'side-overlay-o'                            Visible Side Overlay by default

      'side-scroll'                               Enables custom scrolling on Sidebar and Side Overlay instead of native scrolling (screen width > 991px)

  HEADER

      ''                                          Static Header if no class is added
      'page-header-fixed'                         Fixed Header

  HEADER STYLE

      ''                                          Classic Header style if no class is added
      'page-header-modern'                        Modern Header style
      'page-header-inverse'                       Dark themed Header (works only with classic Header style)
      'page-header-glass'                         Light themed Header with transparency by default
                                                  (absolute position, perfect for light images underneath - solid light background on scroll if the Header is also set as fixed)
      'page-header-glass page-header-inverse'     Dark themed Header with transparency by default
                                                  (absolute position, perfect for dark images underneath - solid dark background on scroll if the Header is also set as fixed)

  MAIN CONTENT LAYOUT

      ''                                          Full width Main Content if no class is added
      'main-content-boxed'                        Full width Main Content with a specific maximum width (screen width > 1200px)
      'main-content-narrow'                       Full width Main Content with a percentage width (screen width > 1200px)
  -->
  <div
    id="page-container"
    :class="{
      'sidebar-o' : openLeftSidebar === true || openLeftSidebar === 'true',
      'sidebar-o-xs' : openLeftSidebarXs === true || openLeftSidebarXs === 'true',
      'side-overlay-o' : openSideOverlay === true || openSideOverlay === 'true',
      'sidebar-inverse' : isSidebarInverse === true || isSidebarInverse === 'true'
    }"
    class="side-scroll page-header-modern"
  >
    <!-- Side Overlay-->
    <app-side-overlay />
    <!-- END Side Overlay -->

    <!-- Sidebar -->
    <!--
          Helper classes

          Adding .sidebar-mini-hide to an element will make it invisible (opacity: 0) when the sidebar is in mini mode
          Adding .sidebar-mini-show to an element will make it visible (opacity: 1) when the sidebar is in mini mode
              If you would like to disable the transition, just add the .sidebar-mini-notrans along with one of the previous 2 classes

          Adding .sidebar-mini-hidden to an element will hide it when the sidebar is in mini mode
          Adding .sidebar-mini-visible to an element will show it only when the sidebar is in mini mode
              - use .sidebar-mini-visible-b if you would like to be a block when visible (display: block)
      -->
    <app-sidebar
      :first-uri="firstUri"
      :second-uri="secondUri"
    />
    <!-- END Sidebar -->

    <!-- Header -->
    <app-header />
    <!-- END Header -->

    <!-- Main Container -->
    <main id="main-container">
      <!-- Page Content -->
      <div class="content">
        <transition name="fade">
          <router-view />
        </transition>

        <!-- <p-block title="Virtual Assistance"
                :isPinned="true"
                :showFullscreenButton="false"
                :showPrinterButton="false">

                <form action="be_comp_chat_single.html" method="post">
                    <input class="js-chat-input form-control" type="text" data-target-chat-id="4" placeholder="Type and hit enter..">
                </form>
            </p-block> -->
      </div>
      <!-- END Page Content -->
    </main>
    <!-- END Main Container -->

    <!-- Footer -->
    <app-footer />
    <!-- END Footer -->
  </div>
  <!-- END Page Container -->
</template>

<script>
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'
import AppSideOverlay from './AppSideOverlay'
import AppFooter from './AppFooter'
import { mapGetters } from 'vuex'

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppSideOverlay,
    AppFooter
  },
  data () {
    return {
      firstUri: '',
      secondUri: ''
    }
  },
  computed: {
    ...mapGetters('uiHandler', ['openLeftSidebar', 'openLeftSidebarXs', 'openSideOverlay', 'isSidebarInverse'])
  },
  created () {
    this.$store.dispatch('path/updateUri', this.$route.path)
    this.firstUri = this.$store.state.path.firstUri
    this.secondUri = this.$store.state.path.secondUri
  },
  updated () {
    this.$store.dispatch('path/updateUri', this.$route.path)
    this.firstUri = this.$store.state.path.firstUri
    this.secondUri = this.$store.state.path.secondUri
  }
}
</script>
