<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/service" class="breadcrumb-item">{{ $t('service') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('edit') + ' ' + $t('service')" :header="true">
        <router-link
          to="/master/service/create"
          v-if="$permission.has('create service')"
          slot="header"
          exact
          class="btn-block-option">
          <span><i class="si si-plus"></i> {{ $t('new service') | titlecase }}</span>
        </router-link>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('name')"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <hr/>

          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
          </button>
        </p-block-inner>
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
      title: 'Edit Service',
      id: this.$route.params.id,
      loading: true,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        code: null,
        name: null
      })
    }
  },
  computed: {
    ...mapGetters('masterService', ['service'])
  },
  watch: {
    'form.name' () {
      this.form.code = this.form.name
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        this.form.code = this.service.code
        this.form.name = this.service.name
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('masterService', ['find', 'update']),
    onSubmit () {
      this.update(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/master/service/' + this.id)
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Update failed')
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
