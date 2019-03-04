<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Master</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        name="User"
        v-if="$permission.has('read user')"
        link="/master/user"
        icon="si si-people"/>
      <p-box
        name="Role & Permission"
        v-if="$permission.has('read role')"
        link="/master/role"
        icon="si si-equalizer"/>
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
    </div>
    <hr>
    <div class="row gutters-tiny">
      <p-box
        name="Warehouse"
        v-if="$permission.has('read warehouse')"
        link="/master/warehouse"
        icon="si si-home"/>
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
