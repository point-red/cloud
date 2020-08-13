<template>
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
  <div id="page-container">
    <!-- Main Container -->
    <main id="main-container">
      <!-- Page Content -->
      <div
        class="bg-image"
        style="background-image: url('/assets/img/guest/bg.jpg');"
      >
        <div class="row mx-0 bg-black-op">
          <div class="hero-static col-md-6 col-xl-8 d-none d-md-flex align-items-md-end">
            <div
              class="p-30 invisible"
              data-toggle="appear"
            >
              <p class="font-size-h3 font-w600 text-white">
                Open Beta
              </p>
              <p class="text-white blog-date">
                01 January 2019
              </p>
              <hr>
              <p class="text-white">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga ipsam tenetur expedita ullam mollitia porro, sit veniam consequuntur eveniet debitis consequatur corrupti? Quisquam, doloribus? Tenetur laborum esse est quidem quia! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga ipsam tenetur expedita ullam mollitia porro, sit veniam consequuntur eveniet debitis consequatur corrupti? Quisquam, doloribus? Tenetur laborum esse est quidem quia!
              </p>
              <p class="text-white mt-100">
                <a
                  class="text-white mr-15"
                  href="https://www.point.red"
                >WEBSITE</a>
                <a
                  class="text-white mr-15"
                  href="https://www.point.red/blog"
                >NEWS</a>
                <a
                  class="text-white mr-15"
                  href="https://www.point.red/terms"
                >TERMS OF SERVICE</a>
                <a
                  class="text-white mr-15"
                  href="https://www.point.red/privacy"
                >PRIVACY</a>
                <a
                  class="text-white mr-15"
                  href="https://www.point.red/helpdesk"
                >HELP</a>
              </p>
              <p class="font-italic text-white-op">
                Copyright &copy; <span class="js-year-copy">2017</span>
              </p>
            </div>
          </div>
          <div class="hero-static col-md-6 col-xl-4 d-flex align-items-center bg-white">
            <div class="content content-full">
              <router-view />
            </div>
          </div>
        </div>
      </div>
      <!-- END Page Content -->
    </main>
    <!-- END Main Container -->
  </div>
  <!-- END Page Container -->
</template>

<style scoped>
  .blog-date {
    margin-top: -20px;
  }
</style>
