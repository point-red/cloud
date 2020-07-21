<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('edit chart of account') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <span
                  class="select-link"
                  @click="$refs.chartOfAccountTypeRef.open()"
                >{{ form.type_alias || $t('select') | uppercase }}</span>
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              v-model="form.number"
              :label="$t('number')"
              name="number"
              :errors="form.errors.get('number')"
              @errors="form.errors.set('number', null)"
            />

            <p-form-row
              id="alias"
              ref="alias"
              v-model="form.alias"
              :label="$t('alias')"
              name="alias"
              :errors="form.errors.get('alias')"
              @errors="form.errors.set('alias', null)"
            />

            <p-form-row
              id="position"
              v-model="form.position"
              :label="$t('position')"
              name="position"
              :errors="form.errors.get('position')"
              @errors="form.errors.set('position', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm mr-5"
                  :class="{
                    'btn-success' : form.position == 'DEBIT',
                    'btn-outline-success' : form.position != 'DEBIT'
                  }"
                  @click="form.position = 'DEBIT'"
                >
                  DEBIT
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="{
                    'btn-success' : form.position == 'CREDIT',
                    'btn-outline-success' : form.position != 'CREDIT'
                  }"
                  @click="form.position = 'CREDIT'"
                >
                  CREDIT
                </button>
              </div>
            </p-form-row>

            <p-separator />

            <p-form-row
              id="sub-ledger"
              name="sub-ledger"
              :label="$t('set sub ledger')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-check-box
                  id="is-sub-ledger"
                  name="is-sub-ledger"
                  :checked="form.is_sub_ledger"
                  @click.native="toggleSubLedger"
                />
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.is_sub_ledger"
              id="sub_ledger"
              :label="$t('sub ledger')"
              name="sub_ledger"
              :errors="form.errors.get('sub_ledger')"
              @errors="form.errors.set('sub_ledger', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'CUSTOMER',
                    'btn-outline-success' : form.sub_ledger != 'CUSTOMER'
                  }"
                  @click="form.sub_ledger = 'CUSTOMER'"
                >
                  CUSTOMER
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'SUPPLIER',
                    'btn-outline-success' : form.sub_ledger != 'SUPPLIER'
                  }"
                  @click="form.sub_ledger = 'SUPPLIER'"
                >
                  SUPPLIER
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'EMPLOYEE',
                    'btn-outline-success' : form.sub_ledger != 'EMPLOYEE'
                  }"
                  @click="form.sub_ledger = 'EMPLOYEE'"
                >
                  EMPLOYEE
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'EXPEDITION',
                    'btn-outline-success' : form.sub_ledger != 'EXPEDITION'
                  }"
                  @click="form.sub_ledger = 'EXPEDITION'"
                >
                  EXPEDITION
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'ITEM',
                    'btn-outline-success' : form.sub_ledger != 'ITEM'
                  }"
                  @click="form.sub_ledger = 'ITEM'"
                >
                  ITEM
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5 mb-5"
                  :class="{
                    'btn-success' : form.sub_ledger == 'FIXED ASSET',
                    'btn-outline-success' : form.sub_ledger != 'FIXED ASSET'
                  }"
                  @click="form.sub_ledger = 'FIXED ASSET'"
                >
                  FIXED ASSET
                </button>
              </div>
            </p-form-row>
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
    <m-chart-of-account-type
      ref="chartOfAccountTypeRef"
      @choosen="updateAccountType($event)"
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
        id: null,
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
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('accountingChartOfAccount', ['update']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    toggleCashFlow () {
      this.form.is_cash_flow = !this.form.is_cash_flow
      if (this.form.is_cash_flow == false) {
        this.form.cash_flow = null
        this.form.cash_flow_position = null
      }
    },
    toggleSubLedger () {
      this.form.is_sub_ledger = !this.form.is_sub_ledger
      if (this.form.is_sub_ledger == false) {
        this.form.sub_ledger = null
      }
    },
    updateAccountType (accountType) {
      this.form.type_id = accountType.id
      this.form.type_alias = accountType.alias
    },
    open (chartOfAccount) {
      this.form.id = chartOfAccount.id
      this.form.type_id = chartOfAccount.type_id
      this.form.type_alias = chartOfAccount.type.alias
      this.form.number = chartOfAccount.number
      this.form.name = chartOfAccount.name
      this.form.alias = chartOfAccount.alias
      if (chartOfAccount.sub_ledger) {
        this.form.is_sub_ledger = true
        this.form.sub_ledger = chartOfAccount.sub_ledger
      }
      this.form.position = chartOfAccount.position
      if (chartOfAccount.cash_flow) {
        this.form.is_cash_flow = true
        this.form.cash_flow = chartOfAccount.cash_flow
        this.form.cash_flow_position = chartOfAccount.type_id
      }
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.alias.setFocus()
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
