<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('profile') | uppercase }}</span>
    </breadcrumb>
    <div class="row">
      <div class="col-xl-3">
        <side-menu/>
      </div>
      <p-block
        :header="true"
        :is-loading="loading"
        title="Profile"
        column="col-xl-9">
        <form class="px-30" @submit.prevent="onSubmit">
          <p-form-row
            id="name"
            name="name"
            :label="$t('name')"
            :disabled="loadingSaveButton"
            v-model="form.name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>

          <p-form-row
            id="email"
            name="email"
            :label="$t('email')"
            :disabled="loadingSaveButton"
            v-model="form.email"
            :errors="form.errors.get('email')"
            @errors="form.errors.set('email', null)">
          </p-form-row>

          <p-form-row
            id="address"
            name="address"
            :label="$t('address')"
            :disabled="loadingSaveButton"
            v-model="form.address"
            :errors="form.errors.get('address')"
            @errors="form.errors.set('address', null)">
          </p-form-row>

          <p-form-row
            id="phone"
            name="phone"
            :label="$t('phone')"
            :disabled="loadingSaveButton"
            v-model="form.phone"
            :errors="form.errors.get('phone')"
            @errors="form.errors.set('phone', null)">
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-9 offset-3">
              <button
                :disabled="loadingSaveButton"
                type="submit"
                class="btn btn-sm btn-primary"><i
                  v-show="loadingSaveButton"
                  class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}</button>
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
  computed: {
    ...mapGetters('auth', ['authUser'])
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
      loading: false,
      loadingSaveButton: false
    }
  },
  methods: {
    ...mapActions('auth', ['updateProfile', 'tryAutoLogin']),
    onSubmit () {
      this.loadingSaveButton = true
      this.updateProfile(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.success('Update success')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.loading = true
    this.tryAutoLogin()
      .then((response) => {
        this.loading = false
        this.form.id = this.authUser.id
        this.form.name = this.authUser.name
        this.form.email = this.authUser.email
        this.form.address = this.authUser.address
        this.form.phone = this.authUser.phone
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
