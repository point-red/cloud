<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer" class="breadcrumb-item">Customer</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('edit') + ' ' + $t('customer')" :header="true">

        <router-link
          to="/master/customer/create"
          v-if="$permission.has('create customer')"
          slot="header"
          exact
          class="btn btn-outline-secondary btn-sm mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>

        <p-block-inner>
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

          <p-form-row id="group" name="group" :label="$t('group')">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-for="(group, index) in form.groups">
                <m-customer-group
                  :key="index"
                  :id="'group'+index"
                  v-model="group.id"
                  :label="group.name"
                  @clear="removeGroupRow(index)"/>
                <hr :key="'group-hr-'+index"/>
              </template>
              <button type="button" class="btn btn-sm btn-secondary" @click="addGroupRow">
                <i class="fa fa-plus"/> Add More Group
              </button>
            </div>
          </p-form-row>

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
      title: 'Edit Customer',
      id: this.$route.params.id,
      loading: true,
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
        }],
        groups: []
      })
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'addresses;phones;emails;groups'
      }
    }).then(response => {
      this.isLoading = false
      this.form.name = this.customer.name
      this.form.groups = this.customer.groups
      if (this.customer.emails.length > 0) {
        this.form.emails[0].email = this.customer.emails[0].email
      }
      if (this.customer.addresses.length > 0) {
        this.form.addresses[0].address = this.customer.addresses[0].address
      }
      if (this.customer.phones.length > 0) {
        this.form.phones[0].number = this.customer.phones[0].number
      }
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('masterCustomer', ['find', 'update']),
    addGroupRow () {
      this.form.groups.push({
        id: null,
        label: null,
        name: null
      })
    },
    removeGroupRow (group) {
      this.$delete(this.form.groups, group)
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form).then(response => {
        this.isSaving = false
        this.form.reset()
        this.$notification.success('Update success')
        this.$router.push('/master/customer/' + this.id)
      }).catch(error => {
        this.isSaving = false
        this.$notification.error('Update failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
