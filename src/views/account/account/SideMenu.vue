<template>
  <div class="block block-rounded text-center">
    <div class="block-content block-content-full">
      <img
        class="img-avatar"
        src="/assets/img/avatars/avatar3.jpg"
        alt="">
    </div>
    <div class="block-content block-content-full block-content-sm bg-body-light">
      <div class="font-w600 mb-5">{{ userName }}</div>
      <div class="font-size-sm text-muted"/>
    </div>
    <hr>
    <div class="block-content block-content-full block-content-sm">
      <ul class="nav nav-pills flex-column push">
        <li class="nav-item">
          <router-link
            to="/account/profile"
            exact
            class="nav-link d-flex align-items-center justify-content-between"
            active-class="active">
            <span><i class="fa fa-fw fa-user mr-5"/> Profile</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/account/profile/password"
            class="nav-link d-flex align-items-center justify-content-between"
            active-class="active">
            <span><i class="fa fa-fw fa-lock mr-5"/> Password</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userName: localStorage.getItem('userName')
    }
  }
}
</script>
