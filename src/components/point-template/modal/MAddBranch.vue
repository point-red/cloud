<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('add branch') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <p-form-row
            id="name"
            ref="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('name')"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"
          />

          <p-form-row
            id="address"
            ref="address"
            v-model="form.address"
            :disabled="isSaving"
            :label="$t('address')"
            name="address"
            :errors="form.errors.get('address')"
            @errors="form.errors.set('address', null)"
          />

          <p-form-row
            id="phone"
            ref="phone"
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
          /> {{ $t('save') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: new Form({
        name: null,
        address: null,
        phone: null
      })
    }
  },
  computed: {
    ...mapGetters('masterBranch', ['branch'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterBranch', ['create']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('added', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
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
