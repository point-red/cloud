<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('accounting') | uppercase }}</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        :name="$t('chart of account')"
        link="/accounting/chart-of-account"
        icon="si si-docs"
      />
      <p-box
        :name="$t('cut off')"
        link="/accounting/cut-off"
        icon="si si-docs"
      />
      <p-box
        :name="$t('balance sheet')"
        link="/accounting/balance-sheet"
        icon="si si-notebook"
      />
      <p-box
        :name="$t('profit & loss')"
        link="/accounting/profit-and-loss"
        icon="si si-notebook"
      />
      <p-box
        :name="$t('ratio report')"
        link="/accounting/ratio-report"
        icon="si si-notebook"
      />
      <p-box
        :name="$t('journal')"
        link="/accounting/journal"
        icon="si si-notebook"
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
