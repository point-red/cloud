<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Accounting</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        :name="$t('chart of account')"
        link="/accounting/chart-of-account"
        icon="si si-docs"/>
      <p-box
        :name="$t('cut off')"
        link="/accounting/cut-off"
        icon="si si-docs"/>
      <p-box
        :name="$t('balance sheet')"
        link="/accounting/balance-sheet"
        icon="si si-notebook"/>
      <p-box
        :name="$t('profit & loss')"
        link="/accounting/profit-and-loss"
        icon="si si-notebook"/>
      <p-box
        :name="$t('financial ratio report')"
        link="/accounting/ratio-report"
        icon="si si-notebook"/>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'

export default {
  components: {
    Breadcrumb
  }
}
</script>
