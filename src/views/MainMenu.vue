<template>
  <div class="row gutters-tiny">
    <p-box
      v-if="$permission.has('menu master')"
      :name="$t('master')"
      link="/master"
      icon="si si-layers"
    />
    <p-box
      v-if="$permission.has('menu human resource')"
      :name="$t('human resource')"
      link="/human-resource"
      icon="si si-emoticon-smile"
    />
    <p-box
      v-if="$permission.has('menu purchase') && authUser.tenant_package_id > 1"
      :name="$t('purchase')"
      link="/purchase"
      icon="si si-basket"
    />
    <p-box
      v-if="$permission.has('menu sales') && authUser.tenant_package_id > 1"
      :name="$t('sales')"
      link="/sales"
      icon="si si-basket-loaded"
    />
    <!-- <p-box
      :name="$t('inventory')"
      v-if="$permission.has('menu inventory') && authUser.tenant_package_id > 1"
      link="/inventory"
      icon="si si-tag"/> -->
    <p-box
      v-if="$permission.has('menu finance') && authUser.tenant_package_id > 1"
      :name="$t('finance')"
      link="/finance"
      icon="si si-wallet"
    />
    <p-box
      v-if="$permission.has('menu accounting') && authUser.tenant_package_id > 1"
      :name="$t('accounting')"
      link="/accounting"
      icon="si si-folder-alt"
    />
    <p-box
      v-if="$permission.has('menu plugin')"
      :name="$t('plugin')"
      link="/plugin"
      icon="si si-puzzle"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['authUser'])
  }
}
</script>
