<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('add supplier') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="code"
              ref="code"
              v-model="form.code"
              :disabled="isSaving"
              :label="$t('code')"
              name="code"
              :errors="form.errors.get('code')"
              @errors="form.errors.set('code', null)"
            />

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
              id="email"
              v-model="form.email"
              :disabled="isSaving"
              :label="$t('email')"
              name="email"
              :errors="form.errors.get('email')"
              @errors="form.errors.set('email', null)"
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

            <p-separator />

            <h5>{{ $t('group') | uppercase }}</h5>
            <p>{{ $t('create supplier helper - group') }}</p>

            <span
              class="select-link"
              @click="$refs.supplierGroup.open(form.groups)"
            >
              <template v-if="form.groups.length == 0">{{ $t('select') | uppercase }}</template>
              <template v-for="(group, index) in form.groups">
                {{ group.label | uppercase }}<template v-if="index + 1 != form.groups.length">,</template>
              </template>
            </span>
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
    <m-m-supplier-group
      id="supplier-group"
      ref="supplierGroup"
      @choosen="onChoosenSupplierGroup($event)"
    />
  </div>
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
        code: null,
        name: null,
        email: null,
        address: null,
        phone: null,
        groups: []
      })
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['supplier'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterSupplier', ['create']),
    onChoosenSupplierGroup (groups) {
      this.form.groups = groups
    },
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
