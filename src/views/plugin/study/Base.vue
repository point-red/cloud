<template>
  <div>
    <div class="row gutters-tiny">
      <p-box
        v-if="$permission.has('read study sheets')"
        :name="$t('study sheet') | titlecase"
        :link="$router.resolve({name: 'PluginStudySheetIndex'}).href"
        icon="fa fa-file-text"
      />
      <p-box
        v-if="$permission.has('read study subjects')"
        :name="$t('study subject') | titlecase"
        :link="$router.resolve({name: 'PluginStudySubject'}).href"
        icon="fa fa-book"
      />
    </div>
  </div>
</template>

<script>
export default {
}

/*
Permissions
- menu study
- read study sheets
- create study sheets
- edit study sheets
- delete study sheets
- read study subjects
- create study subjects
- edit study subjects
- delete study subjects
*/
</script>
