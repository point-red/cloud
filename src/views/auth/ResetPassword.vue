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
        Reset Password
      </h1>
      <h2 class="h5 font-w400 text-muted mb-0">
        Please enter your new password
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
          <p-form-input-material
            id="password"
            v-model="form.password"
            :errors="form.errors.get('password')"
            label="Password"
            type="password"
            name="password"
            @errors="form.errors.set('password', null)"
          />
          <p-form-input-material
            id="password-confirmation"
            v-model="form.password_confirmation"
            :errors="form.errors.get('password_confirmation')"
            label="Password Confirmation"
            type="password"
            name="password_confirmation"
            @errors="form.errors.set('password_confirmation', null)"
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
        token: this.$route.query.token,
        email: '',
        password: '',
        password_confirmation: ''
      })
    }
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    onSubmit () {
      this.isSaving = true
      this.resetPassword(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Update password success')
          this.form.reset()
          this.$router.push('/auth/signin')
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('Update password failed', error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
