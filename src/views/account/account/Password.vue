<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Password</span>
    </breadcrumb>
    <div class="row">
      <div class="col-xl-3">
        <side-menu/>
      </div>
      <p-block
        :header="true"
        :is-loading="loading"
        title="Change Password"
        column="col-xl-9">
        <form
          class="px-30"
          @submit.prevent="onSubmit">
          <p-form-row
            id="password"
            name="password"
            type="password"
            :label="$t('password')"
            v-model="form.password"
            :errors="form.errors.get('password')"
            @errors="form.errors.set('password', null)">
          </p-form-row>

          <p-form-row
            id="password-confirmation"
            name="password-confirmation"
            type="password"
            :label="$t('password confirmation')"
            v-model="form.password_confirmation"
            :errors="form.errors.get('password_confirmation')"
            @errors="form.errors.set('password_confirmation', null)">
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-9 offset-3">
              <button
                :disabled="loadingSaveButton"
                type="submit"
                class="btn btn-sm btn-primary"><i
                  v-show="loadingSaveButton"
                  class="fa fa-asterisk fa-spin"/> Save</button>
            </div>
          </div>
        </form>
      </p-block>
    </div>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import SideMenu from './SideMenu'
import Breadcrumb from '@/views/account/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SideMenu,
    Breadcrumb
  },
  data () {
    return {
      userName: localStorage.getItem('userName'),
      form: new Form({
        id: null,
        password: '',
        password_confirmation: ''
      }),
      loading: false,
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['updatePassword', 'tryAutoLogin']),
    onSubmit () {
      this.loadingSaveButton = true
      this.updatePassword(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.form.reset()
          this.form.id = this.authUser.id
          this.$notification.success('Update success')
        }, (error) => {
          this.loadingSaveButton = false
          this.form.errors.record(error.errors)
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    this.loading = true
    this.tryAutoLogin()
      .then((response) => {
        this.loading = false
        this.form.id = this.authUser.id
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
