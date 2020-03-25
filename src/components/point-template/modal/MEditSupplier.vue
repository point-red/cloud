<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit supplier') | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <template v-if="isLoading">
        <h3 class="text-center">Loading ...</h3>
      </template>
      <template v-else>
      <div class="row">
        <div class="col-sm-12">
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
        </div>
      </div>
      <div class="pull-right">
        <span style="color:red;font-size:10px" class="mr-5" v-if="this.isFailed"><i class="fa fa-warning"></i> {{ $t('update failed') | uppercase }}</span>
        <button  type="submit" class="btn btn-sm btn-primary" :disabled="isSaving" @click="onSubmit">
          <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
        </button>
      </div>
      </template>
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false,
      isSaving: false,
      isFailed: false,
      form: new Form({
        id: null,
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
  methods: {
    ...mapActions('masterSupplier', ['update', 'find']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    findSupplier () {
      this.isLoading = true
      this.find({
        id: this.form.id,
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
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (id) {
      this.form.id = id
      this.findSupplier()
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
