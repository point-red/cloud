<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('finance') | uppercase }}</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read payment order')"
        :name="$t('payment order')"
        link="/finance/payment-order"
        icon="si si-doc"
      />
      <p-box
        v-if="$permission.has('read cash')"
        :name="$t('cash')"
        link="/finance/cash"
        icon="si si-wallet"
      />
      <p-box
        v-if="$permission.has('read bank')"
        :name="$t('bank')"
        link="/finance/bank"
        icon="si si-credit-card"
      />
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
