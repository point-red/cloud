<template>
  <div class="mb-20">
    <ul
      class="nav nav-tabs nav-tabs-alt"
      data-toggle="tabs"
      role="tablist"
    >
      <slot />
      <li
        v-if="$permission.has('create employee salary')"
        class="nav-item ml-auto"
      >
        <router-link
          :to="'/human-resource/employee/' + id + '/salary/create'"
          exact
          class="nav-link"
          active-class="active"
        >
          <span><i class="si si-plus" /> {{ $t('add') | uppercase }}</span>
        </router-link>
      </li>
      <li
        v-if="$permission.has('read employee salary')"
        class="nav-item"
      >
        <router-link
          :to="'/human-resource/employee/' + id + '/salary'"
          exact
          class="nav-link"
          active-class="active"
        >
          <span><i class="si si-docs" /> List</span>
        </router-link>
      </li>
      <slot name="right" />
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: this.$route.params.id
    }
  }
}
</script>
