<template>
  <div>
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item">Project
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>
    <tab-menu>
      <li class="nav-item" slot="right">
        <router-link
          :to="'/account/project/join'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="fa fa-building"></i> Join</span>
        </router-link>
      </li>
    </tab-menu>
    <div class="row">
      <div class="block-content tab-content">
        <div class="row">
          <p-block
            :header="true"
            title="Project">
            <form
              class="px-30"
              @submit.prevent="onSubmit">

              <p-form-row
                id="code"
                name="code"
                v-model="form.code"
                :label="$t('company identifier')"
                :errors="form.errors.get('code')"
                @errors="form.errors.set('code', null)">
              </p-form-row>

              <p-form-row
                id="name"
                name="name"
                v-model="form.name"
                :label="$t('company name')"
                :errors="form.errors.get('name')"
                @errors="form.errors.set('name', null)">
              </p-form-row>

              <p-form-row
                id="address"
                name="address"
                v-model="form.address"
                :label="$t('company address')">
              </p-form-row>

              <p-form-row
                id="phone"
                name="phone"
                v-model="form.phone"
                :label="$t('company phone')">
              </p-form-row>

              <p-form-row
                id="vat-id-number"
                name="vat_id_number"
                v-model="form.vat_id_number"
                :label="$t('vat identification number')">
              </p-form-row>

              <div class="form-group row">
                <div class="col-md-9 offset-3">
                  <button
                    :disabled="loadingSaveButton"
                    type="submit"
                    class="btn btn-sm btn-primary">
                    <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
                  </button>
                </div>
              </div>
            </form>
          </p-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: new Form({
        name: null,
        address: null,
        phone: null,
        code: null,
        vat_id_number: null
      }),
      loadingSaveButton: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  methods: {
    ...mapActions('AccountProject', ['create']),
    onSubmit () {
      this.loadingSaveButton = true
      this.create(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.form.reset()
            this.$notification.success('Create success')
            this.$router.push('/account/project/' + response.data.id)
          },
          (error) => {
            this.loadingSaveButton = false
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
