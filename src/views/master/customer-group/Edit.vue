<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer-group" class="breadcrumb-item">{{ $t('customer group') | uppercase }}</router-link>
      <router-link :to="'/master/customer-group/'+form.id" class="breadcrumb-item">{{ group.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <router-link
          to="/master/customer-group/create"
          v-if="$permission.has('create customer')"
          slot="header"
          exact
          class="btn btn-sm btn-outline-secondary mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>
        <p-block-inner>
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

          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-9">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>{{ $t('update') | uppercase }}
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
    ...mapGetters('masterCustomerGroup', ['group'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id
    }).then(response => {
      this.isLoading = false
      Object.assign(this.form, this.group)
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('masterCustomerGroup', ['find', 'update']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form).then(response => {
        this.isSaving = false
        this.form.reset()
        this.$notification.success('Update success')
        this.$router.push('/master/customer-group/' + this.id)
      }).catch(error => {
        this.isSaving = false
        this.$notification.error('Update failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
