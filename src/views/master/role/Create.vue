<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/role" class="breadcrumb-item">{{ $t('role') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-block
        :title="title"
        :header="true"
        :is-loading="isLoading">
        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="isSaving"
          :label="$t('name')"
          name="name"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button
              type="submit"
              :disabled="isSaving"
              class="btn btn-sm btn-primary">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Submit
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
import { mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      title: 'Role',
      isLoading: false,
      isSaving: false,
      form: new Form({
        name: ''
      })
    }
  },
  methods: {
    ...mapActions('masterRole', ['create']),
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Create success')
          this.form.reset()
          this.$router.push('/master/role/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('Create failed')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
