<template>
  <div class="col-6 col-sm-4 col-md-3">
    <a
      href="javascript:void(0)"
      class="block text-center"
      @click="clicked(item)"
    >
      <div class="mt-10 mr-5">
        <img
          class="img-fluid"
          src="/300x175.jpg"
        >
        <p class="font-w600 mb-0">{{ itemName | uppercase }} <template v-if="itemUnit">({{ itemUnit.label }})</template></p>
        <p
          v-if="itemPrice"
          class="font-w400"
        >{{ itemPrice | numberFormat }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    itemName: {
      type: String,
      default: null
    },
    itemPrice: {
      type: [String, Number],
      default: null
    },
    itemUnit: {
      type: Object,
      default: null
    },
    clicked: {
      type: Function,
      default: null
    }
  }
}
</script>
