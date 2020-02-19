<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/supplier" class="breadcrumb-item">{{ $t('supplier') | uppercase }}</router-link>
      <router-link :to="'/master/supplier/'+form.id" class="breadcrumb-item">{{ form.name | uppercase }}</router-link>
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
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <p-form-row
            id="email"
            v-model="form.emails[0].email"
            :disabled="isSaving"
            :label="$t('email')"
            name="email"
            :errors="form.errors.get('email')"
            @errors="form.errors.set('email', null)"/>

          <p-form-row
            id="address"
            v-model="form.addresses[0].address"
            :disabled="isSaving"
            :label="$t('address')"
            name="address"
            :errors="form.errors.get('address')"
            @errors="form.errors.set('address', null)"/>

          <p-form-row
            id="phone"
            v-model="form.phones[0].number"
            :disabled="isSaving"
            :label="$t('phone')"
            name="phone"
            :errors="form.errors.get('phone')"
            @errors="form.errors.set('phone', null)"/>

          <hr/>

          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-9">
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
        name: null,
        emails: [{
          email: null
        }],
        addresses: [{
          address: null
        }],
        phones: [{
          number: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['supplier'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'addresses;phones;emails'
      }
    }).then(response => {
      this.isLoading = false
      this.form.name = this.supplier.name

      if (this.supplier.emails.length > 0) {
        this.form.emails[0].email = this.supplier.emails[0].email
      }
      if (this.supplier.addresses.length > 0) {
        this.form.addresses[0].address = this.supplier.addresses[0].address
      }
      if (this.supplier.phones.length > 0) {
        this.form.phones[0].number = this.supplier.phones[0].number
      }
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('masterSupplier', ['find', 'update']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form).then(response => {
        this.isSaving = false
        this.form.reset()
        this.$notification.success('Update success')
        this.$router.push('/master/supplier/' + this.id)
      }).catch(error => {
        this.isSaving = false
        this.$notification.error('Update failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
