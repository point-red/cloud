<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('profile') | uppercase }}</span>
    </breadcrumb>
    <div class="row">
      <div class="col-xl-3">
        <side-menu />
      </div>
      <p-block
        :header="true"
        title="Profile"
        :is-loading="isLoading"
        column="col-xl-9"
      >
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="name"
            v-model="form.name"
            name="name"
            :label="$t('name')"
            :disabled="isSaving"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"
          />

          <p-form-row
            id="email"
            v-model="form.email"
            name="email"
            :label="$t('email')"
            :disabled="isSaving"
            :errors="form.errors.get('email')"
            @errors="form.errors.set('email', null)"
          />

          <p-form-row
            id="address"
            v-model="form.address"
            name="address"
            :label="$t('address')"
            :disabled="isSaving"
            :errors="form.errors.get('address')"
            @errors="form.errors.set('address', null)"
          />

          <p-form-row
            id="phone"
            v-model="form.phone"
            name="phone"
            :label="$t('phone')"
            :disabled="isSaving"
            :errors="form.errors.get('phone')"
            @errors="form.errors.set('phone', null)"
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
import Breadcrumb from '@/views/account/Breadcrumb'
import Form from '@/utils/Form'
import SideMenu from './SideMenu'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SideMenu,
    Breadcrumb
  },
  data () {
    return {
      showSubmitButton: false,
      form: new Form({
        id: null,
        name: null,
        email: null,
        address: null,
        phone: null
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
        this.form.name = this.authUser.name
        this.form.email = this.authUser.email
        this.form.address = this.authUser.address
        this.form.phone = this.authUser.phone
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('auth', ['updateProfile', 'tryAutoLogin']),
    onSubmit () {
      this.isSaving = true
      this.updateProfile(this.form)
        .then((response) => {
          this.isSaving = false
          this.$notification.success('Update success')
        }, (error) => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
