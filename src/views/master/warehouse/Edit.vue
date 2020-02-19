<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/warehouse" class="breadcrumb-item">{{ $t('warehouse') | uppercase }}</router-link>
      <router-link :to="'/master/warehouse/'+form.id" class="breadcrumb-item">{{ warehouse.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <hr/>

          <div class="form-group row">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
              </button>
            </div>
          </div>
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
      id: this.$route.params.id,
      isLoading: true,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        name: null
      })
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouse'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then(response => {
        this.isLoading = false
        this.form.name = this.warehouse.name
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('masterWarehouse', ['find', 'update']),
    onSubmit () {
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/master/warehouse/' + this.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('Update failed')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
