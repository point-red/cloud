<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('password') | uppercase }}</span>
    </breadcrumb>
    <div class="row">
      <div class="col-xl-3">
        <side-menu />
      </div>
      <p-block
        :header="true"
        :is-loading="isLoading"
        title="Change Password"
        column="col-xl-9"
      >
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            :label="$t('password')"
            :errors="form.errors.get('password')"
            @errors="form.errors.set('password', null)"
          />

          <p-form-row
            id="password-confirmation"
            v-model="form.password_confirmation"
            name="password-confirmation"
            type="password"
            :label="$t('password confirmation')"
            :errors="form.errors.get('password_confirmation')"
            @errors="form.errors.set('password_confirmation', null)"
          />

          <div class="form-group row">
            <div class="col-md-9 offset-3">
              <button
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary"
              >
                <i
                  v-show="isSaving"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('save') | uppercase }}
              </button>
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
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.isLoading = true
    this.tryAutoLogin()
      .then((response) => {
        this.isLoading = false
        this.form.id = this.authUser.id
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('auth', ['updatePassword', 'tryAutoLogin']),
    onSubmit () {
      this.isSaving = true
      this.updatePassword(this.form)
        .then((response) => {
          this.isSaving = false
          this.form.reset()
          this.form.id = this.authUser.id
          this.$notification.success('Update success')
        }, (error) => {
          this.isSaving = false
          this.form.errors.record(error.errors)
          this.$notification.error(error.message)
        })
    }
  }
}
</script>
