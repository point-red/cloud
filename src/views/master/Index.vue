<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('master') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read user')"
        name="User"
        link="/master/user"
        icon="si si-people"
      />
      <p-box
        v-if="$permission.has('read customer')"
        name="Customer"
        link="/master/customer"
        icon="si si-user"
      />
      <p-box
        v-if="$permission.has('read supplier')"
        name="Supplier"
        link="/master/supplier"
        icon="si si-user"
      />
      <p-box
        v-if="$permission.has('read expedition')"
        name="Expedition"
        link="/master/expedition"
        icon="si si-user"
      />
      <p-box
        v-if="$permission.has('read warehouse')"
        name="Warehouse"
        link="/master/warehouse"
        icon="si si-home"
      />
      <p-box
        v-if="$permission.has('read allocation')"
        name="Allocation"
        link="/master/allocation"
        icon="si si-list"
      />
      <p-box
        v-if="$permission.has('read service')"
        name="Service"
        link="/master/service"
        icon="si si-briefcase"
      />
      <p-box
        v-if="$permission.has('read item')"
        name="Item"
        link="/master/item"
        icon="si si-grid"
      />
      <p-box
        v-if="$permission.has('read fixed asset')"
        :name="$t('fixed asset')"
        link="/master/fixed-assets"
        icon="si si-grid"
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
