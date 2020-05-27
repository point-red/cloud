<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('finance') | uppercase }}</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        :name="$t('payment order')"
        v-if="$permission.has('read payment order')"
        link="/finance/payment-order"
        icon="si si-doc"/>
      <p-box
        :name="$t('cash')"
        v-if="$permission.has('read cash')"
        link="/finance/cash"
        icon="si si-wallet"/>
      <!-- <p-box
        :name="$t('bank')"
        v-if="$permission.has('read bank')"
        link="/finance/bank"
        icon="si si-credit-card"/> -->
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'

export default {
  components: {
    Breadcrumb
  }
}
</script>
