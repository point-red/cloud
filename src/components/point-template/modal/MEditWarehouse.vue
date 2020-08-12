<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit warehouse') | uppercase"
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
              id="branch"
              name="branch"
              :label="$t('branch')"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <span
                  class="select-link"
                  @click="$refs.branch.open()"
                >
                  {{ form.branch_name || $t('select') | uppercase }}
                </span>
                <div
                  v-for="(error, index) in form.errors.get('branch_id')"
                  :key="index"
                  class="invalid-input"
                >
                  <i class="fa fa-warning" /> {{ error }}
                </div>
              </div>
            </p-form-row>

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
      </template>
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
    </sweet-modal>
    <m-branch
      ref="branch"
      @choosen="onChoosenBranch"
    />
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
        name: null,
        branch_id: null,
        branch_name: null,
        address: null,
        phone: null
      })
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouse'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterWarehouse', ['update', 'find']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onChoosenBranch (branch) {
      this.form.branch_id = branch.id
      this.form.branch_name = branch.name
    },
    findWarehouse () {
      this.isLoading = true
      this.find({
        id: this.form.id,
        params: {
          includes: 'branch'
        }
      }).then(response => {
        this.isLoading = false
        this.form.branch_id = this.warehouse.branch.id
        this.form.branch_name = this.warehouse.branch.name
        this.form.name = this.warehouse.name
        this.form.address = this.warehouse.address
        this.form.phone = this.warehouse.phone
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
      this.findWarehouse()
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
