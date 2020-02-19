<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/user" class="breadcrumb-item">{{ $t('user') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-form-row
          id="name"
          v-model="form.user_name"
          :disabled="isSaving"
          :label="$t('name')"
          name="user_name"
          :errors="form.errors.get('user_name')"
          @errors="form.errors.set('user_name', null)"/>

        <p-form-row
          id="email"
          v-model="form.user_email"
          :disabled="isSaving"
          :label="$t('email')"
          name="user_email"
          :errors="form.errors.get('user_email')"
          @errors="form.errors.set('user_email', null)"/>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('invite') | uppercase }}
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      isSaving: false,
      form: new Form({
        user_name: '',
        user_email: ''
      })
    }
  },
  computed: {
    ...mapGetters('masterUserInvitation', ['user'])
  },
  methods: {
    ...mapActions('masterUserInvitation', ['create']),
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then((response) => {
          this.isSaving = false
          this.form.reset()
          this.$swal.fire('Invitation Success', 'Anda telah berhasil mengirimkan undangan melalui email kepada ' + response.data.user_name + ' (' + response.data.user_email + ')' + ' untuk bergabung ke dalam project.', 'success')
        }, (error) => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
