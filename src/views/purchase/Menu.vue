<template>
  <div class="d-flex flex-nowrap" style="overflow-x:auto">
    <router-link
      to="/purchase/purchase-request"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/purchase-request')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Purchase Request</span>
    </router-link>
    <router-link
      to="/purchase/purchase-order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/purchase-order')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Purchase Order</span>
    </router-link>
    <router-link
      to="/purchase/downpayment"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/downpayment')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Downpayment</span>
    </router-link>
    <router-link
      to="/purchase/purchase-receive"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/purchase-receive')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Purchase Receive</span>
    </router-link>
    <router-link
      to="/purchase/invoice"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/invoice')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Invoice</span>
    </router-link>
    <router-link
      to="/purchase/return"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/return')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Return</span>
    </router-link>
    <router-link
      to="/purchase/payment-order"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/purchase/payment-order')}"
      active-class="btn-primary">
      <span><i class="si si-folder-alt"></i> Payment Order</span>
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
