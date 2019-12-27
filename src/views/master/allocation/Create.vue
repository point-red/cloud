<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/allocation" class="breadcrumb-item">{{ $t('allocation') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('create') + ' ' + $t('allocation')" :header="true">
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
      isSaving: false,
      form: new Form({
        name: null
      })
    }
  },
  computed: {
    ...mapGetters('masterAllocation', ['allocation'])
  },
  methods: {
    ...mapActions('masterAllocation', ['create']),
    onSubmit () {
      this.isSaving = true

      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/master/allocation/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
