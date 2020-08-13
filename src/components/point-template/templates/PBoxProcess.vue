<template>
  <div class="col-6 col-sm-4 col-md-3 col-xl-2">
    <a
      v-show="!link && !outerLink"
      href="javascript:void(0)"
      class="block text-center"
    >
      <div
        :class="backgroundColor"
        class="block-content ribbon ribbon-bookmark ribbon-crystal ribbon-left"
      >
        <div
          v-if="ribbon"
          class="ribbon-box"
        >{{ ribbonValue }}</div>
        <p class="mt-5">
          <i
            :class="icon"
            class="fa-3x"
          />
        </p>
        <p class="font-w600">{{ name | uppercase }}</p>
      </div>
    </a>
    <div v-show="link">
      <router-link
        :to="{ path: link, params: linkParams }"
        class="block text-center"
      >
        <div
          :class="backgroundColor"
          class="block-content ribbon ribbon-bookmark ribbon-crystal ribbon-left"
        >
          <div
            v-if="ribbon"
            class="ribbon-box"
          >
            {{ ribbonValue }}
          </div>
          <p class="mt-5">
            <i
              :class="icon"
              class="fa-3x"
            />
          </p>
          <p class="font-w600">
            {{ name | uppercase }}
          </p>
        </div>
      </router-link>
    </div>

    <div v-show="outerLink">
      <a
        :href="outerLink"
        class="block text-center"
      >
        <div
          :class="backgroundColor"
          class="block-content ribbon ribbon-bookmark ribbon-crystal ribbon-left"
        >
          <div
            v-if="ribbon"
            class="ribbon-box"
          >{{ ribbonValue }}</div>
          <p class="mt-5">
            <i
              :class="icon"
              class="fa-3x"
            />
          </p>
          <p class="font-w600">{{ name | uppercase }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    linkParams: {
      type: Object,
      default: null
    },
    outerLink: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      // options: http://simplelineicons.com
      default: 'si si-folder-alt'
    },
    ribbon: {
      type: Boolean,
      default: false
    },
    ribbonValue: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    }
  }
}
</script>
