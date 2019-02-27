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
    <div class="row gutters-tiny">
      <p-box
        name="Customer"
        v-if="$permission.has('read user')"
        link="/master/customer"
        icon="si si-user"/>
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
