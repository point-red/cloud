<template>
  <div class="d-flex flex-nowrap" style="overflow-x:auto">
    <router-link
      to="/purchase/request"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/request')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('purchase request') | titlecase }}</span>
    </router-link>
    <router-link
      to="/purchase/order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/order')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('purchase order') | titlecase }}</span>
    </router-link>
    <router-link
      to="/purchase/down-payment"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/down-payment')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('down payment') | titlecase }}</span>
    </router-link>
    <router-link
      to="/purchase/receive"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/receive')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('purchase receive') | titlecase }}</span>
    </router-link>
    <router-link
      to="/purchase/invoice"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/invoice')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('invoice') | titlecase }}</span>
    </router-link>
    <router-link
      to="/purchase/return"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/return')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('return') | titlecase }}</span>
    </router-link>
    <router-link
      to="/purchase/payment-order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/payment-order')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> {{ $t('payment order') | titlecase }}</span>
    </router-link>
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
