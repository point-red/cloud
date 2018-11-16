<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin></breadcrumb-plugin>
      <span class="breadcrumb-item active">Pin Point</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        :name="$t('sales visitation form') | titlecase"
        v-if="$permission.has('create pin point sales visitation form') || $permission.has('read pin point sales visitation form')"
        link="/plugin/pin-point/sales-visitation-form"
        icon="fa fa-opencart"/>
      <p-box
        :name="$t('report') | titlecase"
        v-if="$permission.has('read pin point sales visitation form report')"
        link="/plugin/pin-point/report/performance"
        icon="fa fa-book"/>
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
