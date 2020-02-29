<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/user" class="breadcrumb-item">{{ $t('user') | uppercase }}</router-link>
      <router-link :to="'/master/user/' + id" class="breadcrumb-item">{{ user.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :is-loading="isLoading">
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="true"
            :label="$t('name')"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <p-form-row
            id="email"
            v-model="form.email"
            :disabled="isSaving"
            :label="$t('email')"
            name="user_email"
            :errors="form.errors.get('user_email')"
            @errors="form.errors.set('user_email', null)"/>

          <p-form-row
            id="first_name"
            v-model="form.first_name"
            :disabled="isSaving"
            :label="$t('first name')"
            name="first_name"
            :errors="form.errors.get('first_name')"
            @errors="form.errors.set('first_name', null)"/>

          <p-form-row
            id="last_name"
            v-model="form.last_name"
            :disabled="isSaving"
            :label="$t('last name')"
            name="last_name"
            :errors="form.errors.get('last_name')"
            @errors="form.errors.set('last_name', null)"/>

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

          <hr>

          <div class="row mb-10">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
              </button>
            </div>
          </div>
        </form>
      </p-block>
    </div>
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
        id: null,
        name: '',
        first_name: '',
        last_name: '',
        address: '',
        phone: '',
        email: ''
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('masterUser', ['user'])
  },
  created () {
    this.find({
      id: this.id
    }).then(response => {
      this.form.id = response.data.id
      this.form.name = response.data.name
      this.form.first_name = response.data.first_name
      this.form.last_name = response.data.last_name
      this.form.address = response.data.address
      this.form.phone = response.data.phone
      this.form.email = response.data.email
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions('masterUser', ['find', 'update']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$router.push('/master/user/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
        })
    }
  }
}
</script>
