<template>
  <breadcrumb>
    <breadcrumb-plugin />

    <template v-if="$route.name === 'PluginStudy'">
      <span class="breadcrumb-item active">
        {{ $t('study report') | uppercase }}
      </span>
    </template>
    <template v-else>
      <router-link
        :to="{name: 'PluginStudy'}"
        class="breadcrumb-item"
      >
        {{ $t('study report') | uppercase }}
      </router-link>
    </template>

    <template v-if="$route.name === 'PluginStudySubject'">
      <span class="breadcrumb-item active">
        {{ $t('study subjects') | uppercase }}
      </span>
    </template>

    <template v-if="$route.name === 'PluginStudySheetIndex'">
      <span class="breadcrumb-item active">
        {{ $t('study sheets') | uppercase }}
      </span>
    </template>
    <template v-else-if="$route.name.includes('PluginStudySheet')">
      <router-link
        :to="{name: 'PluginStudySheetIndex'}"
        class="breadcrumb-item"
      >
        {{ $t('study sheets') | uppercase }}
      </router-link>
    </template>

    <template v-if="$route.name === 'PluginStudySheetShow'">
      <span class="breadcrumb-item active">
        {{ sheetName | uppercase }}
      </span>
    </template>

    <template v-if="$route.name === 'PluginStudySheetCreate'">
      <span class="breadcrumb-item active">
        {{ $t('add') | uppercase }}
      </span>
    </template>

    <template v-if="$route.name === 'PluginStudySheetEdit'">
      <router-link
        :to="{name: 'PluginStudySheetShow'}"
        class="breadcrumb-item"
      >
        {{ sheetName | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">
        {{ $t('edit') | uppercase }}
      </span>
    </template>

    <template v-if="$route.name === 'PluginStudySheetDraft'">
      <span class="breadcrumb-item active">
        {{ $t('drafts') | uppercase }}
      </span>
    </template>
  </breadcrumb>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
export default {
  name: 'PluginStudyBreadcrumb',
  components: {
    Breadcrumb,
    BreadcrumbPlugin
  },
  props: {
    sheetName: {
      type: String,
      default: ''
    }
  }
}
</script>
