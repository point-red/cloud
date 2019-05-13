<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer" class="breadcrumb-item">Customer</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('create') + ' ' + $t('customer')" :header="true">
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

          <p-form-row
            id="phone"
            v-model="form.phones[0].number"
            :disabled="isSaving"
            :label="''"
            name="phone"
            :errors="form.errors.get('phone')"
            @errors="form.errors.set('phone', null)">
            <div slot="body" class="col-lg-9">
              <p-form-check-box
                id="subscibe"
                name="subscibe"
                @click.native="togglePriority"
                :checked="form.group.name == 'priority'"
                :description="'Priority Customer'"/>
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
      isSaving: false,
      form: new Form({
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
        group: {
          name: ''
        }
      })
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer'])
  },
  methods: {
    ...mapActions('masterCustomer', ['create']),
    togglePriority () {
      if (this.form.group.name == 'priority') {
        this.form.group.name = ''
      } else {
        this.form.group.name = 'priority'
      }
    },
    onSubmit () {
      this.isSaving = true

      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/master/customer/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
