<template>
  <aside id="side-overlay">
    <!-- Side Overlay Scroll Container -->
    <div id="side-overlay-scroll">
      <!-- Side Header -->
      <div class="content-header content-header-fullrow">
        <div class="content-header-section align-parent">
          <!-- Close Side Overlay -->
          <button
            type="button"
            class="btn btn-circle btn-dual-secondary align-v-r"
            @click="toggleSideOverlay"
          >
            <i class="fa fa-times text-danger" />
          </button>
          <!-- END Close Side Overlay -->

          <!-- User Info -->
          <div class="content-header-item">
            <a
              class="img-link mr-5"
              href="javascript:void(0)"
            >
              <img
                class="img-avatar img-avatar32"
                src="/assets/img/avatars/vesa-girl.jpg"
                alt=""
              >
            </a>
            <a
              class="align-middle link-effect text-primary-dark font-w600"
              href="javascript:void(0)"
            >Vesa</a>
          </div>
          <!-- END User Info -->
        </div>
      </div>
      <!-- END Side Header -->

      <!-- Side Content -->
      <div class="content-side">
        <!-- Block -->
        <div class="block pull-r-l">
          <div class="block-content">
            <div
              v-for="(vesaChat, index) in vesaChats"
              :key="index"
              :class="{
                'rounded p-10 mb-10 animated fadeIn mr-50 bg-primary-lighter text-primary-darker': vesaChat.from === 'vesa',
                'rounded p-10 mb-10 animated fadeIn ml-50 bg-flat-lighter': vesaChat.from === 'user' }"
            >
              {{ vesaChat.message }}
            </div>
            <div
              v-show="vesaChats.length === 1"
              class="rounded p-10 mb-10 animated fadeIn ml-50 bg-flat-lighter"
            >
              <div class="text-center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="vesaTalk"
                >
                  Okay, I understand
                </button>
              </div>
            </div>
            <div
              v-show="vesaChats.length === 3"
              class="rounded p-10 mb-10 animated fadeIn ml-50 bg-flat-lighter"
            >
              <div class="text-center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="vesaTalk('yes')"
                >
                  Yes, please notice me
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="vesaTalk('no')"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- END Block -->
      </div>
      <!-- END Side Content -->
    </div>
    <!-- END Side Overlay Scroll Container -->
  </aside>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      vesaChats: [
        {
          from: 'vesa',
          message: 'Hi, my name is Vesa your Virtual Assistance. Unfortunately, I am not yet available to help you right now'
        }
      ]
    }
  },
  methods: {
    ...mapActions('uiHandler', ['toggleSideOverlay']),
    vesaTalk (response) {
      if (this.vesaChats.length === 1) {
        this.vesaChats.push({
          from: 'user',
          message: 'Okay, I understand'
        })
        var self = this
        setTimeout(function () {
          self.vesaChats.push({
            from: 'vesa',
            message: 'Thank you, do you want to get notice when i\'m available ?'
          })
        }, 1000)
      } else if (this.vesaChats.length === 3) {
        if (response === 'yes') {
          this.vesaChats.push({
            from: 'user',
            message: 'Yes, please notice me'
          })
          self = this
          setTimeout(function () {
            self.vesaChats.push({
              from: 'vesa',
              message: 'Thank you. I will send you an email(martiendt@gmail.com) when i\'m ready'
            })
          }, 1000)
        } else {
          this.vesaChats.push({
            from: 'user',
            message: 'No'
          })
          self = this
          setTimeout(function () {
            self.vesaChats.push({
              from: 'vesa',
              message: 'Thank you.'
            })
          }, 1000)
        }
      }
    }
  }
}
</script>
