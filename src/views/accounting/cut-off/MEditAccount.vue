<template>
  <div>
    <p-modal
      :id="'select-' + id"
      :ref="'select-' + id"
      title="edit account"
    >
      <template slot="content">
        <form
          class="row"
          @submit.prevent="onSubmit"
        >
          <p-block>
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <m-chart-of-account-type
                  :id="'edit-account-type'"
                  v-model="form.type_id"
                  :label="form.type.alias"
                  @choosen="onChooseAccountType($event)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              v-model="form.number"
              :disabled="isSaving"
              :label="$t('number')"
              name="number"
              :errors="form.errors.get('number')"
              @errors="form.errors.set('number', null)"
            />

            <p-form-row
              id="name"
              v-model="form.alias"
              :disabled="isSaving"
              :label="$t('name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />

            <p-form-row
              id="position"
              v-model="form.position"
              :disabled="isLoading"
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
                  @click.native="toggleSubLedger()"
                />
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.is_sub_ledger"
              id="sub_ledger"
              :disabled="isLoading"
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
                  class="btn btn-sm mr-5"
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
                  class="btn btn-sm mr-5"
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
                  class="btn btn-sm mr-5"
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
                  class="btn btn-sm mr-5"
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
                  class="btn btn-sm mr-5"
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
                  class="btn btn-sm mr-5"
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

            <p-separator />

            <p-form-row
              id="is_cash_flow"
              name="is_cash_flow"
              :label="$t('set cash flow')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-check-box
                  id="is_cash_flow"
                  name="is_cash_flow"
                  :checked="form.is_cash_flow"
                  @click.native="toggleCashFlow()"
                />
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.is_cash_flow == true"
              id="cash_flow"
              :disabled="isLoading"
              :label="$t('cash flow')"
              name="cash_flow"
              :errors="form.errors.get('cash_flow')"
              @errors="form.errors.set('cash_flow', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm mr-5"
                  :class="{
                    'btn-success' : form.cash_flow == 'OPERATION',
                    'btn-outline-success' : form.cash_flow != 'OPERATION'
                  }"
                  @click="form.cash_flow = 'OPERATION'"
                >
                  {{ $t('operation') | uppercase }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm mr-5"
                  :class="{
                    'btn-success' : form.cash_flow == 'INVESTMENT',
                    'btn-outline-success' : form.cash_flow != 'INVESTMENT'
                  }"
                  @click="form.cash_flow = 'INVESTMENT'"
                >
                  {{ $t('investation') | uppercase }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="{
                    'btn-success' : form.cash_flow == 'FUNDING',
                    'btn-outline-success' : form.cash_flow != 'FUNDING'
                  }"
                  @click="form.cash_flow = 'FUNDING'"
                >
                  {{ $t('funding') | uppercase }}
                </button>
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.is_cash_flow == true"
              id="cash_flow_position"
              :disabled="isLoading"
              :label="$t('cash flow position')"
              name="cash_flow_position"
              :errors="form.errors.get('cash_flow_position')"
              @errors="form.errors.set('cash_flow_position', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm mr-5"
                  :class="{
                    'btn-success' : form.cash_flow_position == 'DEBIT',
                    'btn-outline-success' : form.cash_flow_position != 'DEBIT'
                  }"
                  @click="form.cash_flow_position = 'DEBIT'"
                >
                  DEBIT
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  :class="{
                    'btn-success' : form.cash_flow_position == 'CREDIT',
                    'btn-outline-success' : form.cash_flow_position != 'CREDIT'
                  }"
                  @click="form.cash_flow_position = 'CREDIT'"
                >
                  CREDIT
                </button>
              </div>
            </p-form-row>

            <p-form-row
              v-if="!isRestricted"
              id="balance"
              :disabled="isSaving"
              :label="$t('balance')"
              name="balance"
              :errors="form.errors.get('balance')"
              @errors="form.errors.set('balance', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  id="balance"
                  v-model="form.balance"
                  name="balance"
                  :disabled="isSaving"
                  :is-text-right="false"
                />
              </div>
            </p-form-row>

            <div class="form-group row">
              <div class="col-md-3" />
              <div class="col-md-9">
                <button
                  type="submit"
                  class="btn btn-sm btn-primary mr-5"
                  :disabled="isSaving"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger"
                  :disabled="isSaving"
                  @click="deleteAccount()"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('delete') | uppercase }}
                </button>
              </div>
            </div>
          </p-block>
        </form>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isSaving: false,
      isRestricted: true,
      form: new Form({
        id: null,
        type_id: null,
        type: {
          alias: null
        },
        type_alias: null,
        is_sub_ledger: false,
        is_cash_flow: false,
        sub_ledger: null,
        position: '',
        cash_flow: null,
        cash_flow_position: null,
        name: null,
        alias: null,
        number: null,
        balance: 0
      })
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
  },
  methods: {
    ...mapActions('accountingCutOffAccount', ['update', 'delete']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          this.$emit('updated', true)
          this.form.type.alias = 'select'
          this.form.reset()
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    deleteAccount () {
      this.delete(this.form)
        .then(response => {
          this.$notification.success('delete success')
          this.$emit('updated', true)
          this.close()
        })
    },
    onChooseAccountType (accountType) {
      this.form.type_id = accountType.id
      this.form.type_alias = accountType.alias
      this.form.type.name = accountType.name
      this.isRestrictedToEditBalance()
    },
    isRestrictedToEditBalance () {
      const restrictedType = ['SALES INCOME', 'OTHER INCOME', 'COST OF SALES', 'DIRECT EXPENSE', 'OTHER EXPENSE', 'FACTORY OVERHEAD COST']
      this.isRestricted = restrictedType.some(el => {
        return el == this.form.type.name
      })

      if (this.isRestricted) {
        this.form.balance = 0
      }
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
    show (account) {
      this.form.id = account.id
      this.form.type_id = account.chart_of_account.type_id
      this.form.type = account.chart_of_account.type
      this.form.sub_ledger = account.chart_of_account.sub_ledger
      if (this.form.sub_ledger) {
        this.form.is_sub_ledger = true
      }
      this.form.number = account.chart_of_account.number
      this.form.name = account.chart_of_account.name
      this.form.alias = account.chart_of_account.alias
      this.form.position = account.chart_of_account.position
      this.form.cash_flow = account.chart_of_account.cash_flow
      if (this.form.cash_flow) {
        this.form.is_cash_flow = true
      }
      this.form.cash_flow_position = account.chart_of_account.cash_flow_position
      this.form.balance = account.debit || account.credit
      this.isRestrictedToEditBalance()
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
