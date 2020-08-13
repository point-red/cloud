<template>
  <div>
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item"
      >
        {{ $t('project') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('join') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block column="col-sm-12 offset-md-2 col-md-8">
        <div class="font-size-h5 font-w300 text-center">
          {{ $t('join to company') | titlecase }}
        </div>
        <hr>
        <div class="font-w300 mt-30">
          <p>
            {{ $t('join to company intro') | capitalize }}
          </p>
          <form @submit.prevent="onSubmit">
            <p-form-row
              id="invitation-code"
              v-model="form.invitation_code"
              name="invitation_code"
              mask="XXXXXXXXXXXX"
              :label="$t('invitation code')"
              :errors="form.errors.get('invitation_code')"
              @errors="form.errors.set('invitation_code', null)"
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
                  /> {{ $t('request to join') | titlecase }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu
  },
  data () {
    return {
      form: new Form({
        invitation_code: null
      }),
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('accountProject', ['project'])
  },
  created () {
    this.form.id = this.project.id
    this.form.code = this.project.code
    this.form.name = this.project.name
    this.form.address = this.project.address
    this.form.phone = this.project.phone
    this.form.vat_id_number = this.project.vat_id_number
    this.form.owner_id = this.project.owner_id
    this.form.invitation_code = this.project.invitation_code
    this.form.invitation_code_enabled = this.project.invitation_code_enabled
  },
  methods: {
    ...mapActions('accountRequestJoinProject', ['create']),
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.form.reset()
            this.$notification.success('Create success')
            this.$router.push('/account/project')
          },
          (error) => {
            this.isSaving = false
            if (error.message) {
              this.$notification.error(error.message)
            } else {
              this.$notification.error('Create failed')
              this.form.errors.record(error.errors)
            }
          }
        )
    }
  }
}
</script>
