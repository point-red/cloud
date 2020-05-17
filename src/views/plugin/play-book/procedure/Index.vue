<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin></breadcrumb-plugin>
      <breadcrumb-play-book></breadcrumb-play-book>
      <span class="breadcrumb-item active">{{ 'Procedure' | uppercase }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        name="Listing Code"
        v-if="$permission.has('read play book procedures code')"
        link="/plugin/play-book/procedure/code"
        icon="fa fa-list-ol"/>
      <p-box
        name="Content"
        v-if="$permission.has('read play book procedures content')"
        link="/plugin/play-book/procedure/content"
        icon="fa fa-sticky-note"/>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook
  }
}
</script>
