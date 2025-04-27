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
      <p-box
        v-if="($permission.has('read employee master job value') ||
          $permission.has('create employee master job value') ||
          $permission.has('update employee master job value') ||
          $permission.has('read employee job value assessment') ||
          $permission.has('create employee job value assessment') ||
          $permission.has('update employee job value assessment'))"
        name="Job Value"
        link="/human-resource/job-value/assessment"
        icon="si si-people"
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
