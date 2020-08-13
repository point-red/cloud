<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit user') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <template v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              ref="name"
              v-model="form.name"
              :disabled="true"
              :label="$t('name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />

            <p-form-row
              id="email"
              v-model="form.email"
              :disabled="true"
              :label="$t('email')"
              name="email"
              :errors="form.errors.get('email')"
              @errors="form.errors.set('email', null)"
            />

            <p-form-row
              id="first_name"
              ref="first_name"
              v-model="form.first_name"
              :disabled="isSaving"
              :label="$t('first name')"
              name="first_name"
              :errors="form.errors.get('first_name')"
              @errors="form.errors.set('first_name', null)"
            />

            <p-form-row
              id="last_name"
              ref="last_name"
              v-model="form.last_name"
              :disabled="isSaving"
              :label="$t('last name')"
              name="last_name"
              :errors="form.errors.get('last_name')"
              @errors="form.errors.set('last_name', null)"
            />

            <p-form-row
              id="address"
              v-model="form.address"
              :disabled="isSaving"
              :label="$t('address')"
              name="address"
              :errors="form.errors.get('address')"
              @errors="form.errors.set('address', null)"
            />

            <p-form-row
              id="phone"
              v-model="form.phone"
              :disabled="isSaving"
              :label="$t('phone')"
              name="phone"
              :errors="form.errors.get('phone')"
              @errors="form.errors.set('phone', null)"
            />
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('update') | uppercase }}
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
        first_name: null,
        last_name: null,
        email: null,
        address: null,
        phone: null
      })
    }
  },
  computed: {
    ...mapGetters('masterUser', ['user'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterUser', ['update', 'find']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    findUser () {
      this.isLoading = true
      this.find({
        id: this.form.id,
        params: {
          includes: 'roles'
        }
      }).then(response => {
        this.isLoading = false
        this.form.name = this.user.name
        this.form.first_name = this.user.first_name
        this.form.last_name = this.user.last_name
        this.form.email = this.user.email
        this.form.address = this.user.address
        this.form.phone = this.user.phone

        this.$nextTick(() => {
          this.$refs.name.setFocus()
        })
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
      this.findUser()
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
