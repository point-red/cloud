<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <span class="breadcrumb-item active">{{ 'Play Book' | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read play book procedure')"
        name="Procedure"
        link="/plugin/play-book/procedure"
        icon="fa fa-list-ol"
      />
      <p-box
        v-if="$permission.has('read play book instruction')"
        name="Instruction"
        link="/plugin/play-book/instruction"
        icon="fa fa-briefcase"
      />
      <p-box
        v-if="$permission.has('read play book glossary')"
        name="Glossary"
        link="/plugin/play-book/glossary"
        icon="fa fa-font"
      />
      <p-box
        v-if="$permission.has('read play book instruction') || $permission.has('read play book procedure')"
        name="Approval"
        link="/plugin/play-book/approval/procedure"
        icon="fa fa-check-square"
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
