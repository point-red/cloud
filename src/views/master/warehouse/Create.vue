<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/warehouse" class="breadcrumb-item">{{ $t('warehouse') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-block-inner>
          <p-form-row
            id="branch"
            name="branch"
            :label="$t('branch')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-branch :id="'branch'" v-model="form.branch_id"/>
            </div>
          </p-form-row>

          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <p-form-row
            id="address"
            v-model="form.address"
            :disabled="isSaving"
            :label="$t('address')"
            name="address"
            :errors="form.errors.get('address')"
            @errors="form.errors.set('address', null)"/>

          <p-form-row
            id="phone"
            v-model="form.phone"
            :disabled="isSaving"
            :label="$t('phone')"
            name="phone"
            :errors="form.errors.get('phone')"
            @errors="form.errors.set('phone', null)"/>

          <hr/>

          <div class="form-group row">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
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
      isSaving: false,
      form: new Form({
        branch_id: 1,
        code: null,
        name: null,
        address: null,
        phone: null
      })
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouse'])
  },
  watch: {
    'form.name' () {
      this.form.code = this.form.name
    }
  },
  methods: {
    ...mapActions('masterWarehouse', ['create']),
    onSubmit () {
      this.isSaving = true

      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/master/warehouse/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
