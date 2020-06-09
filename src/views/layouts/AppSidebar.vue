<template>
  <nav id="sidebar">
    <!-- Sidebar Scroll Container -->
    <div id="sidebar-scroll" :v-scroll-lock="true">
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
            <ul class="list-inline mt-3 mb-0">
              <li class="list-inline-item">
                <a
                  :href="accountPage + '/profile'"
                  class="link-effect text-dual-primary-dark font-size-xs font-w600 text-uppercase">
                  {{ userName }}
                </a>
              </li>
              <li class="list-inline-item">
                |
                <a :href="accountPage + '/reward'" class="link-effect text-dual-primary-dark">
                  {{ balance || 0 }} <i class="si si-disc"></i>
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
                class="sidebar-mini-hide"><i class="si si-speedometer"/> {{ $t("dashboard") | uppercase }}</router-link>
            </li>
            <li @click="toggleLeftSidebar('close-xs')">
              <router-link
                to="/menu"
                exact
                active-class="active"
                class="sidebar-mini-hide"><i class="si si-list"/> {{ $t("main menu") | uppercase }}</router-link>
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
                <span class="sidebar-mini-hide">{{ $t("master") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read user')">
                  <router-link to="/master/user" active-class="active">
                    {{ $t('user') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read customer')">
                  <router-link to="/master/customer" active-class="active">
                    {{ $t('customer') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read supplier')">
                  <router-link to="/master/supplier" active-class="active">
                    {{ $t('supplier') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read warehouse')">
                  <router-link to="/master/warehouse" active-class="active">
                    {{ $t('warehouse') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read allocation')">
                  <router-link to="/master/allocation" active-class="active">
                    {{ $t('allocation') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read service')">
                  <router-link to="/master/service" active-class="active">
                    {{ $t('service') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read item')">
                  <router-link to="/master/item" active-class="active">
                    {{ $t('item') | uppercase }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'human-resource' }" v-if="$permission.has('menu human resource')">
              <router-link to="/human-resource" class="nav-submenu" active-class="active">
                <i class="si si-emoticon-smile"/>
                <span class="sidebar-mini-hide">{{ $t("human resource") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read employee') || $permission.has('create employee assessment') || $permission.has('read employee assessment')">
                  <router-link
                    to="/human-resource/employee"
                    active-class="active">{{ $t('employee') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$plugin.has('KPI') && $permission.has('read employee kpi')">
                  <router-link
                    to="/human-resource/kpi"
                    active-class="active">{{ $t('kpi template') | uppercase }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'purchase' }" v-if="$permission.has('menu purchase') && authUser.tenant_package_id > 1">
              <router-link to="/purchase" class="nav-submenu" active-class="active">
                <i class="si si-basket"/>
                <span class="sidebar-mini-hide">{{ $t("purchase") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase request')">
                  <router-link
                    to="/purchase/request"
                    active-class="active">{{ $t('purchase request') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase order')">
                  <router-link
                    to="/purchase/order"
                    active-class="active">{{ $t('purchase order') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase down payment')">
                  <router-link
                    to="/purchase/down-payment"
                    active-class="active">{{ $t('down payment') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase receive')">
                  <router-link
                    to="/purchase/receive"
                    active-class="active">{{ $t('purchase receive') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase invoice')">
                  <router-link
                    to="/purchase/invoice"
                    active-class="active">{{ $t('purchase invoice') | uppercase }}
                  </router-link>
                </li>
                <!-- <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase return')">
                  <router-link
                    to="/purchase/return"
                    active-class="active">{{ $t('return') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read purchase invoice')">
                  <router-link
                    to="/purchase/payment-order"
                    active-class="active">{{ $t('payment order') | uppercase }}
                  </router-link>
                </li> -->
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'sales' }" v-if="$permission.has('menu sales') && authUser.tenant_package_id > 1">
              <router-link to="/sales" class="nav-submenu" active-class="active">
                <i class="si si-basket-loaded"/>
                <span class="sidebar-mini-hide">{{ $t("sales") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read sales quotation')">
                  <router-link
                    to="/sales/quotation"
                    active-class="active">{{ $t('sales quotation') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read sales order')">
                  <router-link
                    to="/sales/order"
                    active-class="active">{{ $t('sales order') | uppercase }}
                  </router-link>
                </li>
              </ul>
            </li>
            <!-- <li :class="{ 'open' : firstUri === 'pos' }" v-if="$permission.has('menu pos')">
              <router-link to="/pos" class="nav-submenu" active-class="active">
                <i class="si si-basket-loaded"/>
                <span class="sidebar-mini-hide">{{ $t("pos") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read pos')">
                  <router-link
                    to="/pos/open-bill"
                    active-class="active">{{ $t('open bill') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read pos')">
                  <router-link
                    to="/pos/closed-bill"
                    active-class="active">{{ $t('closed bill') | uppercase }}
                  </router-link>
                </li>
              </ul>
            </li> -->
            <li :class="{ 'open' : firstUri === 'inventory' }" v-if="$permission.has('menu inventory') && authUser.tenant_package_id > 1">
              <router-link to="/inventory" class="nav-submenu" active-class="active">
                <i class="si si-tag"/>
                <span class="sidebar-mini-hide">{{ $t("inventory") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read inventory report')">
                  <router-link
                    to="/inventory/report"
                    active-class="active">{{ $t('inventory report') | uppercase }}
                  </router-link>
                </li>
                <!-- <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read inventory usage')">
                  <router-link
                    to="/inventory/usage"
                    active-class="active">{{ $t('inventory usage') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read inventory audit')">
                  <router-link
                    to="/inventory/audit"
                    active-class="active">{{ $t('inventory audit') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read stock correction')">
                  <router-link
                    to="/inventory/correction"
                    active-class="active">{{ $t('stock correction') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read transfer item')">
                  <router-link
                    to="/inventory/transfer"
                    active-class="active">{{ $t('transfer item') | uppercase }}
                  </router-link>
                </li> -->
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'manufacture' }" v-if="$permission.has('menu manufacture') && authUser.tenant_package_id > 1">
              <router-link to="/manufacture" class="nav-submenu" active-class="active">
                <i class="si si-settings"/>
                <span class="sidebar-mini-hide">{{ $t("manufacture") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read manufacture machine')">
                  <router-link
                    to="/manufacture/machine"
                    active-class="active">{{ $t('machine') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read manufacture process')">
                  <router-link
                    to="/manufacture/process"
                    active-class="active">{{ $t('process') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read manufacture formula')">
                  <router-link
                    to="/manufacture/formula"
                    active-class="active">{{ $t('formula') | uppercase }}
                  </router-link>
                </li>
                <!-- <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read manufacture processing')">
                  <router-link
                    to="/manufacture/processing"
                    active-class="active">{{ $t('processing') | uppercase }}
                  </router-link>
                </li> -->
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'finance' }" v-if="$permission.has('menu finance') && authUser.tenant_package_id > 1">
              <router-link to="/finance" class="nav-submenu" active-class="active">
                <i class="si si-wallet"/>
                <span class="sidebar-mini-hide">{{ $t("finance") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read payment order')">
                  <router-link
                    to="/finance/payment-order"
                    active-class="active">{{ $t('payment order') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read cash')">
                  <router-link
                    to="/finance/cash"
                    active-class="active">{{ $t('cash') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read bank')">
                  <router-link
                    to="/finance/bank"
                    active-class="active">{{ $t('bank') | uppercase }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li :class="{ 'open' : firstUri === 'accounting' }" v-if="$permission.has('menu accounting') && authUser.tenant_package_id > 1">
              <router-link to="/accounting" class="nav-submenu" active-class="active">
                <i class="si si-folder-alt"/>
                <span class="sidebar-mini-hide">{{ $t("accounting") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read chart of account')">
                  <router-link
                    to="/accounting/chart-of-account"
                    active-class="active">{{ $t('chart of account') | uppercase }}
                  </router-link>
                </li>
                <!-- <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read cut off')">
                  <router-link
                    to="/accounting/cut-off"
                    active-class="active">{{ $t('cut off') | uppercase }}
                  </router-link>
                </li> -->
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read balance sheet')">
                  <router-link
                    to="/accounting/balance-sheet"
                    active-class="active">{{ $t('balance sheet') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read profit and loss')">
                  <router-link
                    to="/accounting/profit-and-loss"
                    active-class="active">{{ $t('profit and loss') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$permission.has('read ratio report')">
                  <router-link
                    to="/accounting/ratio-report"
                    active-class="active">{{ $t('ratio report') | uppercase }}
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
                <span class="sidebar-mini-hide">{{ $t("plugin") | uppercase }}</span>
              </router-link>
              <ul>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$plugin.has('SCALE WEIGHT') && $permission.has('menu scale weight')">
                  <router-link
                    to="/plugin/scale-weight"
                    active-class="active">{{ $t('scale weight') | uppercase }}
                  </router-link>
                </li>
                <li @click="toggleLeftSidebar('close-xs')" v-if="$plugin.has('PIN POINT') && $permission.has('menu pin point')">
                  <router-link
                    to="/plugin/pin-point"
                    active-class="active">{{'pin point' | uppercase }}
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
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters('accountRewardToken', ['balance']),
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('uiHandler', ['toggleLeftSidebar', 'toggleSidebarInverse'])
  }
}
</script>

<style scoped>
#sidebar-scroll {
  overflow-y: auto;
  height: 100% !important;
}
#page-container.sidebar-inverse #sidebar .content-side-user {
  background-color: #424242;
  height: auto;
}
</style>
