<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read user')">
      <router-link
        to="/master/user"
        class="nav-link"
        active-class="active">
        <span>{{ $t('user') | uppercase }}</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read role')">
      <router-link
        to="/master/role"
        class="nav-link"
        active-class="active">
        <span>{{ $t('role & permission') | uppercase }}</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read role')">
      <a
        @click="$refs.setWarehouseModal.show()"
        class="nav-link"
        active-class="active">
        <span>{{ $t('set warehouse') | uppercase }}</span>
      </a>
      <set-warehouse-modal id="setWarehouse" ref="setWarehouseModal" :title="'Set Warehouse'"/>
    </li>
    <slot name="right"></slot>
  </ul>
</template>

<script>
import SetWarehouseModal from './SetWarehouseModal'

export default {
  components: {
    SetWarehouseModal
  },
  data () {
    return {
      id: this.$route.params.id
    }
  }
}
</script>
