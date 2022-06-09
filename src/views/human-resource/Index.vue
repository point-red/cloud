<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('human resource') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read employee')"
        name="Employee"
        link="/human-resource/employee"
        icon="si si-people"
      />
      <p-box
        v-if="$plugin.has('KPI') && ($permission.has('read employee kpi') || $permission.has('create employee assessment') || $permission.has('read employee assessment'))"
        name="KPI"
        link="/human-resource/kpi"
        icon="si si-badge"
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
