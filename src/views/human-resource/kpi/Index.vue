<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{ $t('kpi') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$plugin.has('KPI') && $permission.has('read employee kpi')"
        name="KPI Template"
        link="/human-resource/kpi-template"
        icon="si si-badge"
      />
      <p-box
        v-if="$plugin.has('KPI') && $permission.has('create employee assessment') || $permission.has('read employee assessment')"
        name="KPI Assessment"
        link="/human-resource/kpi-assessment"
        icon="si si-pencil"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource
  }
}
</script>
