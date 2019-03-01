<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/customer" class="breadcrumb-item">Customer</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Create Customer'" :header="true">
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
      loadingSaveButton: false,
      form: new Form({
        name: null,
        emails: [
          {
            email: null
          }
        ],
        phones: [
          {
            number: null
          }
        ]
      })
    }
  },
  computed: {
    ...mapGetters('Customer', ['customer'])
  },
  methods: {
    ...mapActions('Customer', ['create']),
    onSubmit () {
      this.loadingSaveButton = true
      
      this.create(this.form)
        .then(response => {
          this.loadingSaveButton = false
          this.$notification.success('create success')          
          Object.assign(this.$data, this.$options.data.call(this));
        }).catch(error => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
