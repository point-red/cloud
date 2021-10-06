<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <span class="breadcrumb-item active">{{ $t('sales visitation') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('create pin point sales visitation form') || $permission.has('read pin point sales visitation form')"
        :name="$t('sales visitation') | titlecase"
        link="/plugin/pin-point/sales-visitation-form"
        icon="fa fa-opencart"
      />
      <p-box
        v-if="$permission.has('read pin point sales visitation form report')"
        :name="$t('report') | titlecase"
        link="/plugin/pin-point/report/performance"
        icon="fa fa-book"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin
  }
}
</script>
