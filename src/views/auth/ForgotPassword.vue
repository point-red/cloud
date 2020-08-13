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
        Forgot Password ?
      </h1>
      <h2 class="h5 font-w400 text-muted mb-0">
        Please enter your email
      </h2>
    </div>
    <!-- END Header -->

    <!-- Sign In Form -->
    <form
      class="px-30"
      @submit.prevent="onSubmit"
    >
      <div class="form-group row">
        <div class="col-12">
          <p-form-input-material
            id="email"
            v-model="form.email"
            :errors="form.errors.get('email')"
            label="Email"
            name="email"
            @errors="form.errors.set('email', null)"
          />
        </div>
      </div>
      <div class="form-group text-center">
        <button
          type="submit"
          :disabled="isSaving"
          class="btn btn-sm btn-hero btn-primary"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> Reset Password
        </button>
        <div class="mt-30">
          Remember your password ?
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
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      form: new Form({
        email: ''
      })
    }
  },
  methods: {
    ...mapActions('auth', ['resetPasswordRequest']),
    onSubmit () {
      this.isSaving = true
      this.resetPasswordRequest(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Please check your email to reset your password')
            this.form.reset()
          },
          (error) => {
            this.isSaving = false
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
