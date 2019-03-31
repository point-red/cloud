<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/user" class="breadcrumb-item">User</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Invite User'" :header="true">
        <p-form-row
          id="name"
          v-model="form.user_name"
          :disabled="loadingSaveButton"
          :label="$t('name')"
          name="user_name"
          :errors="form.errors.get('user_name')"
          @errors="form.errors.set('user_name', null)"/>

        <p-form-row
          id="email"
          v-model="form.user_email"
          :disabled="loadingSaveButton"
          :label="$t('email')"
          name="user_email"
          :errors="form.errors.get('user_email')"
          @errors="form.errors.set('user_email', null)"/>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Invite
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
      loadingSaveButton: false,
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
      this.loadingSaveButton = true
      this.create(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.success('Invitation success')
          this.form.reset()
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
