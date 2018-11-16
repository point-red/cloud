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
      :name="$t('plugin')"
      v-if="$permission.has('menu plugin')"
      link="/plugin"
      icon="si si-puzzle"/>
  </div>
</template>
