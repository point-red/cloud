<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('human resource') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        name="Employee"
        v-if="$permission.has('read employee') || $permission.has('create employee assessment') || $permission.has('read employee assessment')"
        link="/human-resource/employee"
        icon="si si-people"/>
      <p-box
        name="Kpi Template"
        v-if="$plugin.has('KPI') && $permission.has('read employee kpi')"
        link="/human-resource/kpi"
        icon="si si-badge"/>
      <p-box
        name="Kpi Assessment"
        v-if="$plugin.has('KPI') && $permission.has('read employee kpi')"
        link="/human-resource/employee"
        icon="si si-badge"/>
      <p>{{ auth }}</p>
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
