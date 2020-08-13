<template>
  <div
    class="d-flex flex-nowrap"
    style="overflow-x:auto"
  >
    <router-link
      to="/purchase/request"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/request')}"
      active-class="btn-primary"
    >
      <span>{{ $t('purchase request') | uppercase }}</span>
    </router-link>
    <router-link
      to="/purchase/order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/order')}"
      active-class="btn-primary"
    >
      <span>{{ $t('purchase order') | uppercase }}</span>
    </router-link>
    <router-link
      to="/purchase/down-payment"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/down-payment')}"
      active-class="btn-primary"
    >
      <span>{{ $t('down payment') | uppercase }}</span>
    </router-link>
    <router-link
      to="/purchase/receive"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/receive')}"
      active-class="btn-primary"
    >
      <span>{{ $t('purchase receive') | uppercase }}</span>
    </router-link>
    <router-link
      to="/purchase/invoice"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/invoice')}"
      active-class="btn-primary"
    >
      <span>{{ $t('purchase invoice') | uppercase }}</span>
    </router-link>
    <!-- <router-link
      to="/purchase/return"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/return')}"
      active-class="btn-primary">
      <span>{{ $t('return') | uppercase }}</span>
    </router-link>
    <router-link
      to="/purchase/payment-order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/payment-order')}"
      active-class="btn-primary">
      <span>{{ $t('payment order') | uppercase }}</span>
    </router-link> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: this.$route.path
    }
  },
  methods: {
    isMatch (value) {
      return this.path.substring(0, value.length) == value
    }
  }
}
</script>
