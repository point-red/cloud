<template>
  <div>
    <!-- Header -->
    <div class="px-30 py-10 text-center">
      <div class="link-effect font-w700">
        <img
          src="/assets/img/guest/logo.svg"
          alt=""
        >
      </div>
      <h1 class="h3 font-w700 mt-30 mb-10">
        Welcome to Point.RED
      </h1>
      <h2 class="h5 font-w400 text-muted mb-0">
        Create New Account
      </h2>
    </div>
    <!-- END Header -->

    <!-- Sign In Form -->
    <form
      class="px-30"
      action="#"
      method="post"
    >
      <div class="form-group row">
        <div class="col-12">
          <div class="form-material floating">
            <input
              id="signup-username"
              type="text"
              class="form-control"
              name="signup-username"
            >
            <label for="signup-username">Username</label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-12">
          <div class="form-material floating">
            <input
              id="signup-email"
              type="email"
              class="form-control"
              name="signup-email"
            >
            <label for="signup-email">Email</label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-12">
          <div class="form-material floating">
            <input
              id="signup-password"
              type="password"
              class="form-control"
              name="signup-password"
            >
            <label for="signup-password">Password</label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-12">
          <div class="form-material floating">
            <input
              id="signup-password-confirm"
              type="password"
              class="form-control"
              name="signup-password-confirm"
            >
            <label for="signup-password-confirm">Password Confirmation</label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-12">
          <label class="custom-control custom-checkbox">
            <input
              id="signup-terms"
              type="checkbox"
              class="custom-control-input"
              name="signup-terms"
            >
            <span class="custom-control-indicator" />
            <span class="custom-control-description">I agree to Terms &amp; Conditions</span>
          </label>
        </div>
      </div>
      <div class="form-group text-center">
        <button
          type="submit"
          class="btn btn-sm btn-hero btn-primary"
        >
          <i class="fa fa-plus mr-10" /> Create Account
        </button>
        <div class="mt-30">
          Already have an account ?
          <router-link
            class="link-effect text-muted mr-10 mb-5 d-inline-block"
            to="/auth/signin"
          >
            <i class="fa fa-user text-muted" /> Sign In
          </router-link>
        </div>
      </div>
    </form>
    <!-- END Sign In Form -->
  </div>
</template>

<script>
</script>
