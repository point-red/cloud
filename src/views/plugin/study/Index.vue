<template>
  <div>
    <breadcrumb :sheet-name="sheetName" />

    <router-view @updateSheetName="sheetName = $event" />
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue'
export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      sheetName: ''
    }
  }
}
</script>
