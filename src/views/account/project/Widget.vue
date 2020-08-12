<template>
  <div class="row gutters-tiny">
    <div class="col-md-6 col-xl-3">
      <router-link
        :to="'/account/project/' + project.id + '/database'"
        class="block block-link-shadow text-right"
      >
        <div class="block-content block-content-full clearfix">
          <div class="float-left mt-10 d-none d-sm-block">
            <i class="fa fa-database fa-3x text-body-bg-dark" />
          </div>
          <div class="font-size-h3 font-w600">
            {{ project.db_size }}
          </div>
          <div class="font-size-sm font-w600 text-uppercase text-muted">
            DB Storage
          </div>
        </div>
      </router-link>
    </div>
    <div class="col-md-6 col-xl-3">
      <router-link
        :to="'/account/project/' + project.id + '/invitation-code'"
        class="block block-link-shadow text-right"
      >
        <div class="block-content block-content-full clearfix">
          <div class="float-left mt-10 d-none d-sm-block">
            <i class="fa fa-users fa-3x text-body-bg-dark" />
          </div>
          <div
            v-if="project.users"
            class="font-size-h3 font-w600"
          >
            {{ project.users.length }}
          </div>
          <div class="font-size-sm font-w600 text-uppercase text-muted">
            Users
          </div>
        </div>
      </router-link>
    </div>
    <div class="col-md-6 col-xl-3">
      <router-link
        :to="'/account/project/' + project.id + '/preferences'"
        class="block block-link-shadow text-right"
      >
        <div class="block-content block-content-full clearfix">
          <div class="float-left mt-10 d-none d-sm-block">
            <i class="fa fa-list-alt fa-3x text-body-bg-dark" />
          </div>
          <div class="font-size-h3 font-w600">
            _
          </div>
          <div class="font-size-sm font-w600 text-uppercase text-muted">
            Preferences
          </div>
        </div>
      </router-link>
    </div>
    <div class="col-md-6 col-xl-3">
      <router-link
        :to="'/account/project/' + project.id + '/plugins'"
        class="block block-link-shadow text-right"
      >
        <div class="block-content block-content-full clearfix">
          <div class="float-left mt-10 d-none d-sm-block">
            <i class="fa fa-list-alt fa-3x text-body-bg-dark" />
          </div>
          <div class="font-size-h3 font-w600">
            FEATURES
          </div>
          <div class="font-size-sm font-w600 text-uppercase text-muted">
            Package & Plugins
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>
