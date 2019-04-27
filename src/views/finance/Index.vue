<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        :name="$t('cash')"
        v-if="$permission.has('read cash')"
        link="/finance/cash"
        icon="si si-wallet"/>
      <p-box
        :name="$t('bank')"
        v-if="$permission.has('read bank')"
        link="/finance/bank"
        icon="si si-credit-card"/>
    </div>
  </div>
</template>

<script>
import BreadcrumbFinance from './Breadcrumb'
import Breadcrumb from '@/views/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    BreadcrumbFinance
  }
}
</script>
