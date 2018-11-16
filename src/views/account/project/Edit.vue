<template>
  <div>
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item">Project
      </router-link>
      <router-link
        :to="{ path: '/account/project/' + project.id, params: { id: project.id }}"
        class="breadcrumb-item">
        {{ project.code | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :header="true"
        :is-loading="loading"
        title="Project">
        <form
          class="px-30"
          @submit.prevent="onSubmit">

          <p-form-row
            id="code"
            name="code"
            v-model="form.code"
            :disabled="true"
            :label="$t('company identifier')"
            :errors="form.errors.get('code')"
            @errors="form.errors.set('code', null)">
          </p-form-row>

          <p-form-row
            id="name"
            name="name"
            v-model="form.name"
            :disabled="loadingSaveButton"
            :label="$t('company name')"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>

          <p-form-row
            id="address"
            name="address"
            v-model="form.address"
            :disabled="loadingSaveButton"
            :label="$t('company address')">
          </p-form-row>

          <p-form-row
            id="phone"
            name="phone"
            v-model="form.phone"
            :disabled="loadingSaveButton"
            :label="$t('company phone')">
          </p-form-row>

          <p-form-row
            id="vat-id-number"
            name="vat_id_number"
            v-model="form.vat_id_number"
            :disabled="loadingSaveButton"
            :label="$t('vat identification number')">
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-9 offset-3">
              <button
                :disabled="loadingSaveButton"
                type="submit"
                class="btn btn-sm btn-primary">
                <i
                  v-show="loadingSaveButton"
                  class="fa fa-asterisk fa-spin"/> Update
              </button>
              <router-link
                :to="{path: '/account/project/' + this.id}"
                class="btn btn-sm btn-danger">
                Cancel
              </router-link>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      form: new Form({
        id: this.$route.params.id,
        name: null,
        address: null,
        phone: null,
        code: null,
        vat_id_number: null,
        invitation_code: null,
        invitation_code_enabled: null
      }),
      loading: false,
      loadingSaveButton: false
    }
  },
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters('AccountProject', ['project'])
  },
  created () {
    this.loading = true
    this.findProject({ id: this.id })
      .then((response) => {
        this.form.id = this.project.id
        this.form.code = this.project.code
        this.form.name = this.project.name
        this.form.address = this.project.address
        this.form.phone = this.project.phone
        this.form.vat_id_number = this.project.vat_id_number
        this.form.invitation_code = this.project.invitation_code
        this.form.invitation_code_enabled = this.project.invitation_code_enabled
        this.loading = false
      }, (error) => {
        this.$notification.error(error.message)
        this.loading = false
      })
  },
  methods: {
    ...mapActions('AccountProject', {
      update: 'update',
      findProject: 'find'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.update(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/account/project/' + this.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Update failed')
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
