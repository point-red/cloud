<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('edit customer') | uppercase"
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

              <h5>{{ $t('credit limit') | uppercase }}</h5>
              <p>{{ $t('create customer helper - credit limit') }}</p>

              <p-form-number
                v-model="form.credit_limit"
                :disabled="isSaving"
                :is-text-right="false"
                :errors="form.errors.get('credit_limit')"
                @errors="form.errors.set('credit_limit', null)"
              />

              <p-separator />

              <h5>{{ $t('pricing group') | uppercase }}</h5>
              <p>{{ $t('create customer helper - pricing group') }}</p>

              <span
                class="select-link"
                @click="$refs.pricingGroup.open()"
              >
                {{ form.pricing_group_label || $t('select') | uppercase }}
              </span>

              <p-separator />

              <h5>{{ $t('group') | uppercase }}</h5>
              <p>{{ $t('create customer helper - group') }}</p>

              <span
                class="select-link"
                @click="$refs.customerGroup.open(form.groups)"
              >
                <template v-if="form.groups.length == 0">{{ $t('select') | uppercase }}</template>
                <template v-for="(group, index) in form.groups">
                  {{ group.name | uppercase }}<template v-if="index + 1 != form.groups.length">,</template>
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
              /> {{ $t('update') | uppercase }}
            </button>
          </div>
        </template>
      </sweet-modal>
    </form>
    <m-pricing-group
      id="pricing-group"
      ref="pricingGroup"
      @choosen="onChoosenPricingGroup($event)"
    />
    <m-m-customer-group
      id="customer-group"
      ref="customerGroup"
      @choosen="onChoosenCustomerGroup($event)"
    />
  </div>
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
        code: null,
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
        pricing_group_id: null,
        pricing_group_label: null,
        groups: []
      })
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterCustomer', ['update', 'find']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    findCustomer () {
      this.isLoading = true
      this.find({
        id: this.form.id,
        params: {
          includes: 'addresses;phones;emails;groups;pricingGroup'
        }
      }).then(response => {
        this.isLoading = false
        this.form.code = this.customer.code
        this.form.name = this.customer.name
        this.form.address = this.customer.address
        this.form.phone = this.customer.phone
        this.form.email = this.customer.email
        this.form.credit_limit = this.customer.credit_limit
        if (this.customer.pricing_group) {
          this.form.pricing_group_id = this.customer.pricing_group.id
          this.form.pricing_group_label = this.customer.pricing_group.label
        }
        this.form.groups = this.customer.groups
        if (this.customer.emails.length > 0) {
          this.form.emails[0].email = this.customer.emails[0].email
        }
        this.$nextTick(() => {
          this.$refs.name.setFocus()
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onChoosenPricingGroup (pricingGroup) {
      this.form.pricing_group_id = pricingGroup.id
      this.form.pricing_group_label = pricingGroup.label
    },
    onChoosenCustomerGroup (groups) {
      this.form.groups = groups
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
      this.findCustomer()
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
