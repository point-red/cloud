<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('master') | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        name="User"
        v-if="$permission.has('read user')"
        link="/master/user"
        icon="si si-people"/>
    </div>
    <hr>
    <div class="row gutters-tiny">
      <p-box
        name="Customer"
        v-if="$permission.has('read customer')"
        link="/master/customer"
        icon="si si-user"/>
      <p-box
        name="Supplier"
        v-if="$permission.has('read supplier')"
        link="/master/supplier"
        icon="si si-user"/>
      <p-box
        name="Warehouse"
        v-if="$permission.has('read warehouse')"
        link="/master/warehouse"
        icon="si si-home"/>
      <p-box
        name="Allocation"
        v-if="$permission.has('read allocation')"
        link="/master/allocation"
        icon="si si-list"/>
      <p-box
        name="Service"
        v-if="$permission.has('read service')"
        link="/master/service"
        icon="si si-briefcase"/>
      <p-box
        name="Item"
        v-if="$permission.has('read item')"
        link="/master/item"
        icon="si si-grid"/>
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
