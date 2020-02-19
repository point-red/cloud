<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="master/role" class="breadcrumb-item">{{ $t('role') | uppercase }}</router-link>
      <router-link :to="'master/role/' + id" class="breadcrumb-item">{{ role.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :is-loading="isLoading">
        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="isSaving"
          :label="$t('name')"
          :placeholder="$t('required') | uppercase"
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
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
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
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false,
      form: new Form({
        name: ''
      })
    }
  },
  computed: {
    ...mapGetters('masterRole', ['role'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.form.id = response.data.id
        this.form.name = response.data.name
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('masterRole', ['find', 'update']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          this.form.reset()
          this.$router.push('/master/role/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('update failed')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
