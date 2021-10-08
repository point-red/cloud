<template>
  <div
    class="d-flex flex-nowrap"
    style="overflow-x:auto"
  >
    <router-link
      to="/sales/quotation"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/quotation')}"
      active-class="btn-primary"
    >
      <span>{{ $t('sales quotation') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/order')}"
      active-class="btn-primary"
    >
      <span>{{ $t('sales order') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/down-payment"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/down-payment')}"
      active-class="btn-primary"
    >
      <span>{{ $t('down payment') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/delivery-order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/delivery-order')}"
      active-class="btn-primary"
    >
      <span>{{ $t('delivery order') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/delivery-note"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/delivery-note')}"
      active-class="btn-primary"
    >
      <span>{{ $t('delivery note') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/report"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/report')}"
      active-class="btn-primary"
    >
      <span>{{ $t('sales report') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/invoice"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/invoice')}"
      active-class="btn-primary"
    >
      <span>{{ $t('sales invoice') | uppercase }}</span>
    </router-link>
    <router-link
      to="/sales/summary"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/summary')}"
      active-class="btn-primary"
    >
      <span>{{ $t('sales summary') | uppercase }}</span>
    </router-link>
    <!-- <router-link
      to="/sales/return"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/return')}"
      active-class="btn-primary">
      <span>{{ $t('return') | uppercase }}</span>
    </router-link> -->
    <!-- <router-link
      to="/sales/payment-collection"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/sales/payment-collection')}"
      active-class="btn-primary">
      <span>{{ $t('payment collection') | uppercase }}</span>
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
