<template>
  <div
    class="btn-group"
    role="group"
  >
    <button
      id="page-header-user-dropdown"
      type="button"
      class="btn btn-rounded btn-dual-secondary"
      @click="toggleHeaderDropdown"
    >
      {{ userName | uppercase }}<i class="fa fa-angle-down ml-5" />
    </button>
    <div
      :class="{ 'show' : openHeaderDropdown === true || openHeaderDropdown === 'true' }"
      class="dropdown-menu dropdown-menu-right min-width-150"
      aria-labelledby="page-header-user-dropdown"
    >
      <a
        :href="accountPage"
        class="dropdown-item"
      >
        <i class="si si-user mr-5" /> Account
      </a>
      <a
        class="dropdown-item"
        href="javascript:void(0)"
        data-toggle="layout"
        data-action="side_overlay_toggle"
        @click="clickLanguage"
      >
        <i class="si si-flag mr-5" /> Language
      </a>

      <router-link
        :to="'/account/storage'"
        class="dropdown-item"
      >
        <i class="si si-drawer mr-5" /> Storage
      </router-link>

      <div class="dropdown-divider" />
      <a
        class="dropdown-item"
        href="javascript:void(0)"
        @click="signout"
      >
        <i class="si si-logout mr-5" /> Sign Out
      </a>
    </div>

    <change-language-modal
      id="changeLanguage"
      ref="changeLanguageModalRef"
      title="CHANGE LANGUAGE"
    />
  </div>
  <!-- END User Dropdown -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ChangeLanguageModal from '../ChangeLanguageModal'

export default {
  components: {
    ChangeLanguageModal
  },
  data () {
    return {
      userName: localStorage.getItem('userName'),
      accountPage: '//' + process.env.VUE_APP_DOMAIN + '/account'
    }
  },
  computed: {
    ...mapGetters('uiHandler', ['openHeaderDropdown'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('uiHandler', ['toggleHeaderDropdown']),
    clickLanguage () {
      this.$refs.changeLanguageModalRef.show()
      this.toggleHeaderDropdown()
    },
    signout () {
      this.toggleHeaderDropdown()
      this.logout()
    }
  }
}
</script>
