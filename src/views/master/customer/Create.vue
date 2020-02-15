<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer" class="breadcrumb-item">{{ $t('customer') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block>
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

          <m-pricing-group :id="'pricing-group-id'" v-model="form.pricing_group_id"/>

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
            <hr :key="'group-hr-'+index"/>
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
        groups: [{
          id: null,
          label: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer'])
  },
  methods: {
    ...mapActions('masterCustomer', ['create']),
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
