<template>
  <div class="mb-20">
    <ul
      class="nav nav-tabs nav-tabs-alt"
      data-toggle="tabs"
      role="tablist"
    >
      <slot />
      <li
        v-if="$permission.has('create employee assessment')"
        class="nav-item ml-auto"
      >
        <router-link
          :to="'/human-resource/employee/' + id + '/assessment/create'"
          exact
          class="nav-link"
          active-class="active"
        >
          <span><i class="si si-plus" /> {{ $t('add') | uppercase }}</span>
        </router-link>
      </li>
      <li
        v-if="$permission.has('read employee assessment')"
        class="nav-item"
      >
        <router-link
          :to="'/human-resource/employee/' + id + '/assessment'"
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
