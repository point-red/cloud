<template>
  <div class="row gutters-tiny">
    <p-box
      :name="$t('master')"
      v-if="$permission.has('menu master')"
      link="/master"
      icon="si si-layers"/>
    <p-box
      :name="$t('human resource')"
      v-if="$permission.has('menu human resource')"
      link="/human-resource"
      icon="si si-emoticon-smile"/>
    <p-box
      :name="$t('purchase')"
      v-if="$permission.has('menu purchase')"
      link="/purchase"
      icon="si si-basket"/>
    <p-box
      :name="$t('sales')"
      v-if="$permission.has('menu sales')"
      link="/sales"
      icon="si si-basket-loaded"/>
    <p-box
      :name="$t('accounting')"
      v-if="$permission.has('menu accounting')"
      link="/accounting"
      icon="si si-folder-alt"/>
    <p-box
      :name="$t('plugin')"
      v-if="$permission.has('menu plugin')"
      link="/plugin"
      icon="si si-puzzle"/>
  </div>
</template>
