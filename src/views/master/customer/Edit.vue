<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer" class="breadcrumb-item">{{ $t('customer') | uppercase }}</router-link>
      <router-link :to="'/master/customer/'+form.id" class="breadcrumb-item">{{ customer.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
        <p-block-inner>
          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="isSaving"
            name="name"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
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

          <p-separator></p-separator>

          <h5>{{ $t('pricing group') | uppercase }}</h5>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus reiciendis ipsam praesentium aliquam quo, aperiam, autem consectetur animi veritatis fugiat velit magni earum ad ullam, hic beatae cum. Dicta, molestiae!</p>

          <m-pricing-group
            :id="'pricing-group-id'"
            :label="form.pricing_group.label"
            v-model="form.pricing_group_id"/>

          <p-separator></p-separator>

          <h5>{{ $t('group') | uppercase }}</h5>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus reiciendis ipsam praesentium aliquam quo, aperiam, autem consectetur animi veritatis fugiat velit magni earum ad ullam, hic beatae cum. Dicta, molestiae!</p>

          <template v-for="(group, index) in form.groups">
            <m-customer-group
              :key="index"
              :id="'group'+index"
              v-model="group.id"
              :label="group.label"
              @choosen="chooseGroupRow($event, group)"
              @clear="removeGroupRow(index)"/>
            <br :key="'group-br-'+index"/>
          </template>

          <hr/>

          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>{{ $t('save') | uppercase }}
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
        }],
        pricing_group: {
          label: ''
        },
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
        includes: 'addresses;phones;emails;groups;pricingGroup'
      }
    }).then(response => {
      this.isLoading = false
      this.form.name = this.customer.name
      this.form.groups = this.customer.groups
      this.addGroupRow()
      if (this.customer.pricing_group) {
        this.form.pricing_group.id = this.customer.pricing_group.id
        this.form.pricing_group.label = this.customer.pricing_group.label
      }
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
        label: null
      })
    },
    removeGroupRow (group) {
      this.$delete(this.form.groups, group)
    },
    chooseGroupRow (option, group) {
      group.label = option.label
      this.addGroupRow()
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
