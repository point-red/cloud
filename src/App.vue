<template>
  <div
    id="app"
    style="heigth: 900px"
    @click="closeHeaderDropdown($event)">
    <network>
      <span slot="online">
        <transition name="fade">
          <router-view/>
        </transition>
      </span>
      <span slot="offline">
        <div class="hero bg-white">
          <div class="hero-inner">
            <div class="content content-full">
              <div class="py-30 text-center">
                <div class="display-3 text-danger">
                  <i class="fa fa-plug"/>
                </div>
                <h1 class="h2 font-w700 mt-30 mb-10 text-danger">Oops.. You are not connected to the internet..</h1>
                <h2 class="h3 font-w400 text-muted mb-50">Please connect to the internet..</h2>
              </div>
            </div>
          </div>
        </div>
      </span>
    </network>
    <notifications
      :max="3"
      :duration="5000"
      group="notification"
      position="bottom right" />
    <p-loading-block v-show="isLoadingBlock" />
  </div>
</template>

<script>
import Network from '@/network'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    Network
  },
  computed: {
    ...mapGetters('UIHandler', ['isLoadingBlock'])
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
    document.getElementById('app').style.minHeight = window.innerHeight + 'px'
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    closeHeaderDropdown (event) {
      if (event.target.id !== 'page-header-user-dropdown') {
        this.$store.dispatch('UIHandler/closeHeaderDropdown')
      }
    },
    handleResize (event) {
      document.getElementById('app').style.minHeight = window.innerHeight + 'px'
    },
    closeModal () {
      const els = document.getElementsByClassName('modal open')
      Array.prototype.forEach.call(els, function (el) {
        el.classList.remove('open')
        el.style.display = 'none'
      })
      document.body.classList.remove('modal-open')
    }
  }
}
</script>

<style>
  .no-wrap {
    white-space: nowrap;
  }
  .vue-notification.info {
    background: #0c80df;
    border-left-color: #0073d1;
  }
  .full-width {
    width: 100%;
  }
  .block.block-mode-loading::after {
    top: 50px;
  }

  .block-content-inner {
    padding: 0px !important;
  }
  /* .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to
  {
    opacity: 0;
    transition: opacity;
  } */
</style>
