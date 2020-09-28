<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <span class="breadcrumb-item active">{{ 'Salary' | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <!-- <p-box
        v-if="$permission.has('read play book procedure')"
        name="Procedure"
        link="/plugin/play-book/procedure"
        icon="fa fa-list-ol"
      /> -->
      <p-box
        name="Salary non Sales"
        link="/plugin/salary/salary-non-sales"
        icon="fa fa-list-ol"
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
