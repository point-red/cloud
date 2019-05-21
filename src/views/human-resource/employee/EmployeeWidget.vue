<template>
  <div class="row">
    <div class="col-sm-6 col-xl-3">
      <div class="block block-themed text-center">
        <div class="block-content block-content-full block-content-sm bg-gray-lighter">
          <div class="font-w600">KPI</div>
          <div class="font-size-sm">KEY PERFORMANCE INDEX</div>
        </div>
        <div class="block-content">
          <div class="row items-push">
            <div class="col-6">
              <router-link
                :to="'/human-resource/employee/' + id + '/assessment/create'"
                exact
                active-class="active">
                <div class="mb-5"><i class="si si-note fa-2x"></i></div>
                <div class="font-size-sm text-muted">Assessment</div>
              </router-link>
            </div>
            <div class="col-6">
              <router-link
                :to="'/human-resource/employee/' + id + '/assessment'"
                exact
                active-class="active">
                <div class="mb-5"><i class="si si-bar-chart fa-2x"></i></div>
                <div class="font-size-sm text-muted">History</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xl-3">
      <div class="block block-themed text-center">
        <div class="block-content block-content-full block-content-sm bg-gray-lighter">
          <div class="font-w600">SALARY</div>
          <div class="font-size-sm">SALARY CALCULATION</div>
        </div>
        <div class="block-content">
          <div class="row items-push">
            <div class="col-6">
              <router-link
                :to="'/human-resource/employee/' + id + '/salary/create'"
                exact
                active-class="active">
                <div class="mb-5"><i class="si si-note fa-2x"></i></div>
                <div class="font-size-sm text-muted">New</div>
              </router-link>
            </div>
            <div class="col-6">
              <router-link
                :to="'/human-resource/employee/' + id + '/salary'"
                exact
                active-class="active">
                <div class="mb-5"><i class="si si-bar-chart fa-2x"></i></div>
                <div class="font-size-sm text-muted">History</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  }
}
</script>
