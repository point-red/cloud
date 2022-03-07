<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('inventory') | uppercase }}</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read inventory report')"
        :name="$t('inventory report')"
        link="/inventory/report"
        icon="si si-docs"
      />
      <p-box
        v-if="$permission.has('read inventory usage')"
        :name="$t('inventory usage')"
        link="/inventory/usage"
        icon="si si-note"
      />
      <p-box
        v-if="$permission.has('read inventory audit')"
        :name="$t('inventory audit')"
        link="/inventory/audit"
        icon="si si-note"
      />
      <p-box
        v-if="$permission.has('read stock correction')"
        :name="$t('stock correction')"
        link="/inventory/correction"
        icon="si si-note"
      />
      <!-- <p-box
        :name="$t('transfer item')"
        v-if="$permission.has('read transfer item')"
        link="/inventory/transfer"
        icon="si si-directions"/> -->
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
