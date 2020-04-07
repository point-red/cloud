<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('add chart of account') | uppercase"
        overlay-theme="dark"
        @close="onClose()">
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')">
              <div slot="body" class="col-lg-9 mt-5">
                <span @click="$refs.chartOfAccountTypeRef.open()" class="select-link">{{ form.type_alias || $t('select') | uppercase }}</span>
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              v-model="form.number"
              :label="$t('number')"
              name="number"
              :errors="form.errors.get('number')"
              @errors="form.errors.set('number', null)"/>

            <p-form-row
              id="name"
              v-model="form.name"
              :label="$t('name')"
              ref="name"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"/>

            <p-form-row
              id="position"
              v-model="form.position"
              :label="$t('position')"
              name="position"
              :errors="form.errors.get('position')"
              @errors="form.errors.set('position', null)">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-sm mr-5"
                  :class="{
                    'btn-success' : form.position == 'DEBIT',
                    'btn-outline-success' : form.position != 'DEBIT'
                  }"
                  @click="form.position = 'DEBIT'">
                  DEBIT
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="{
                    'btn-success' : form.position == 'CREDIT',
                    'btn-outline-success' : form.position != 'CREDIT'
                  }"
                  @click="form.position = 'CREDIT'">
                  CREDIT
                </button>
              </div>
            </p-form-row>

            <p-separator></p-separator>

            <p-form-row
              id="sub-ledger"
              name="sub-ledger"
              :label="$t('set sub ledger')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  id="is-sub-ledger"
                  name="is-sub-ledger"
                  @click.native="toggleSubLedger"
                  :checked="form.is_sub_ledger">
                </p-form-check-box>
              </div>
            </p-form-row>

            <p-form-row
              id="sub_ledger"
              :label="$t('sub ledger')"
              name="sub_ledger"
              v-if="form.is_sub_ledger"
              :errors="form.errors.get('sub_ledger')"
              @errors="form.errors.set('sub_ledger', null)">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'CUSTOMER',
                    'btn-outline-success' : form.sub_ledger != 'CUSTOMER'
                  }"
                  @click="form.sub_ledger = 'CUSTOMER'">
                  CUSTOMER
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'SUPPLIER',
                    'btn-outline-success' : form.sub_ledger != 'SUPPLIER'
                  }"
                  @click="form.sub_ledger = 'SUPPLIER'">
                  SUPPLIER
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'EMPLOYEE',
                    'btn-outline-success' : form.sub_ledger != 'EMPLOYEE'
                  }"
                  @click="form.sub_ledger = 'EMPLOYEE'">
                  EMPLOYEE
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'EXPEDITION',
                    'btn-outline-success' : form.sub_ledger != 'EXPEDITION'
                  }"
                  @click="form.sub_ledger = 'EXPEDITION'">
                  EXPEDITION
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'ITEM',
                    'btn-outline-success' : form.sub_ledger != 'ITEM'
                  }"
                  @click="form.sub_ledger = 'ITEM'">
                  ITEM
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'FIXED ASSET',
                    'btn-outline-success' : form.sub_ledger != 'FIXED ASSET'
                  }"
                  @click="form.sub_ledger = 'FIXED ASSET'">
                  FIXED ASSET
                </button>
              </div>
            </p-form-row>

            <p-separator></p-separator>

            <p-form-row
              id="is_cash_flow"
              name="is_cash_flow"
              :label="$t('set cash flow')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  id="is_cash_flow"
                  name="is_cash_flow"
                  @click.native="toggleCashFlow()"
                  :checked="form.is_cash_flow">
                </p-form-check-box>
              </div>
            </p-form-row>

            <p-form-row
              id="cash_flow"
              :label="$t('cash flow')"
              name="cash_flow"
              v-if="form.is_cash_flow == true"
              :errors="form.errors.get('cash_flow')"
              @errors="form.errors.set('cash_flow', null)">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.cash_flow == 'OPERATION',
                    'btn-outline-success' : form.cash_flow != 'OPERATION'
                  }"
                  @click="form.cash_flow = 'OPERATION'">
                  {{ $t('operation') | uppercase }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.cash_flow == 'INVESTMENT',
                    'btn-outline-success' : form.cash_flow != 'INVESTMENT'
                  }"
                  @click="form.cash_flow = 'INVESTMENT'">
                  {{ $t('investation') | uppercase }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.cash_flow == 'FUNDING',
                    'btn-outline-success' : form.cash_flow != 'FUNDING'
                  }"
                  @click="form.cash_flow = 'FUNDING'">
                  {{ $t('funding') | uppercase }}
                </button>
              </div>
            </p-form-row>

            <p-form-row
              id="cash_flow_position"
              :label="$t('cash flow position')"
              name="cash_flow_position"
              v-if="form.is_cash_flow == true"
              :errors="form.errors.get('cash_flow_position')"
              @errors="form.errors.set('cash_flow_position', null)">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-sm mr-5"
                  :class="{
                    'btn-success' : form.cash_flow_position == 'DEBIT',
                    'btn-outline-success' : form.cash_flow_position != 'DEBIT'
                  }"
                  @click="form.cash_flow_position = 'DEBIT'">
                  DEBIT
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="{
                    'btn-success' : form.cash_flow_position == 'CREDIT',
                    'btn-outline-success' : form.cash_flow_position != 'CREDIT'
                  }"
                  @click="form.cash_flow_position = 'CREDIT'">
                  CREDIT
                </button>
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="pull-right">
          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving" @click="onSubmit">
            <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
    <m-chart-of-account-type ref="chartOfAccountTypeRef" @choosen="updateAccountType($event)"/>
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
        type_id: null,
        type_alias: null,
        is_sub_ledger: false,
        is_cash_flow: false,
        sub_ledger: null,
        position: 'DEBIT',
        cash_flow: null,
        cash_flow_position: 'DEBIT',
        name: null,
        number: null
      })
    }
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chart of account'])
  },
  methods: {
    ...mapActions('accountingChartOfAccount', ['create']),
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
    toggleSubLedger () {
      this.form.is_sub_ledger = !this.form.is_sub_ledger
      if (this.form.is_sub_ledger == false) {
        this.form.sub_ledger = null
      }
    },
    toggleCashFlow () {
      this.form.is_cash_flow = !this.form.is_cash_flow
      if (this.form.is_cash_flow == false) {
        this.form.cash_flow = null
        this.form.cash_flow_position = null
      }
    },
    updateAccountType (accountType) {
      this.form.type_id = accountType.id
      this.form.type_alias = accountType.alias
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