<template>
  <div class="btn-group" role="group" v-click-outside="close">
    <button type="button" class="btn btn-rounded btn-dual-secondary" @click="toggle">
      <i class="fa fa-flag mr-5"></i>
      <span class="badge badge-danger badge-pill">1</span>
    </button>
    <div class="dropdown-menu dropdown-menu-right min-width-300"
      :class="{'show': show}">
      <h5 class="h6 text-center py-10 mb-0 border-b text-uppercase">Notifications</h5>
      <ul class="list-unstyled my-20">
        <li>
          <a class="text-body-color-dark media mb-15" href="javascript:void(0)">
            <div class="ml-5 mr-15">
              <i class="fa fa-fw fa-warning text-success"></i>
            </div>
            <div class="media-body pr-10">
              <p class="mb-0">Demo notification, currently under construction!</p>
              <div class="text-muted font-size-sm font-italic">15 min ago</div>
            </div>
          </a>
        </li>
      </ul>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item text-center mb-0" href="javascript:void(0)">
        <i class="fa fa-flag mr-5"></i> View All
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggle () {
      this.show = !this.show
    },
    close () {
      this.show = false
    }
  }
}
</script>
