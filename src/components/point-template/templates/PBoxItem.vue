<template>
  <div class="col-sm-3">
    <a href="javascript:void(0)" class="block text-center" @click="clicked(item)">
      <div class="mt-10 mr-5">
        <img class="img-fluid" src="/300x175.jpg">
        <p class="font-w600 mb-0" v-if="unit">{{ name | uppercase }}</p>
        <p class="font-w600 mb-0" v-else>{{ name | uppercase }}</p>
        <p class="font-w400" v-if="price">{{ price | numberFormat }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    clicked: {
      type: Function
    },
    item: {
      type: Object
    },
    price: {
      type: Number,
      default: null
    },
    unit: {
      type: String,
      default: null
    }
  }
}
</script>
