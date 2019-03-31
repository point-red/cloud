<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/supplier"
        class="breadcrumb-item">Supplier</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Create Supplier'" :header="true">
        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="loadingSaveButton"
          :label="$t('name')"
          name="name"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <p-form-row
          id="email"
          v-model="form.emails[0].email"
          :disabled="loadingSaveButton"
          :label="$t('email')"
          name="email"
          :errors="form.errors.get('email')"
          @errors="form.errors.set('email', null)"/>

        <p-form-row
          id="address"
          v-model="form.addresses[0].address"
          :disabled="loadingSaveButton"
          :label="$t('address')"
          name="address"
          :errors="form.errors.get('address')"
          @errors="form.errors.set('address', null)"/>
        
        <p-form-row
          id="phone"
          v-model="form.phones[0].number"
          :disabled="loadingSaveButton"
          :label="$t('phone')"
          name="phone"
          :errors="form.errors.get('phone')"
          @errors="form.errors.set('phone', null)"/>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      title: 'Edit Supplier',
      id: this.$route.params.id,
      loading: true,
      loadingSaveButton: false,
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
      this.loadingSaveButton = true
      this.update(this.form).then(response => {
        this.loadingSaveButton = false
        this.form.reset()
        this.$notification.success('Update success')
        this.$router.push('/master/supplier/' + this.id)
      }).catch(error => {
        this.loadingSaveButton = false
        this.$notification.error('Update failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
