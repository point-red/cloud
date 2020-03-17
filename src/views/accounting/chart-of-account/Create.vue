<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <router-link to="/accounting/chart-of-account" class="breadcrumb-item">{{ $t('chart of account') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('chart of account')" :header="true">
        <p-form-row
          id="account-type"
          name="account-type"
          :label="$t('account type')">
          <div slot="body" class="col-lg-9 mt-5">
            <m-chart-of-account-type :id="'account-type'" v-model="form.type_id" @choosen="updateAccountType($event)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="number"
          v-model="form.number"
          :disabled="isLoading"
          :label="$t('number')"
          name="number"
          :errors="form.errors.get('number')"
          @errors="form.errors.set('number', null)"/>

        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="isLoading"
          :label="$t('name')"
          name="name"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <p-form-row
          id="position"
          v-model="form.position"
          :disabled="isLoading"
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
              @click.native="form.is_sub_ledger = !form.is_sub_ledger"
              :checked="form.is_sub_ledger">
            </p-form-check-box>
          </div>
        </p-form-row>

        <p-form-row
          id="sub_ledger"
          :disabled="isLoading"
          :label="$t('sub ledger')"
          name="sub_ledger"
          v-if="form.is_sub_ledger"
          :errors="form.errors.get('sub_ledger')"
          @errors="form.errors.set('sub_ledger', null)">
          <div slot="body" class="col-lg-9">
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.sub_ledger == 'CUSTOMER',
                'btn-outline-success' : form.sub_ledger != 'CUSTOMER'
              }"
              @click="form.sub_ledger = 'CUSTOMER'">
              CUSTOMER
            </button>
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.sub_ledger == 'SUPPLIER',
                'btn-outline-success' : form.sub_ledger != 'SUPPLIER'
              }"
              @click="form.sub_ledger = 'SUPPLIER'">
              SUPPLIER
            </button>
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.sub_ledger == 'EMPLOYEE',
                'btn-outline-success' : form.sub_ledger != 'EMPLOYEE'
              }"
              @click="form.sub_ledger = 'EMPLOYEE'">
              EMPLOYEE
            </button>
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.sub_ledger == 'EXPEDITION',
                'btn-outline-success' : form.sub_ledger != 'EXPEDITION'
              }"
              @click="form.sub_ledger = 'EXPEDITION'">
              EXPEDITION
            </button>
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.sub_ledger == 'ITEM',
                'btn-outline-success' : form.sub_ledger != 'ITEM'
              }"
              @click="form.sub_ledger = 'ITEM'">
              ITEM
            </button>
            <button
              type="button"
              class="btn btn-sm mr-5"
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
          :disabled="isLoading"
          :label="$t('cash flow')"
          name="cash_flow"
          v-if="form.is_cash_flow == true"
          :errors="form.errors.get('cash_flow')"
          @errors="form.errors.set('cash_flow', null)">
          <div slot="body" class="col-lg-9">
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.cash_flow == 'OPERATION',
                'btn-outline-success' : form.cash_flow != 'OPERATION'
              }"
              @click="form.cash_flow = 'OPERATION'">
              {{ $t('operation') | uppercase }}
            </button>
            <button
              type="button"
              class="btn btn-sm mr-5"
              :class="{
                'btn-success' : form.cash_flow == 'INVESTMENT',
                'btn-outline-success' : form.cash_flow != 'INVESTMENT'
              }"
              @click="form.cash_flow = 'INVESTMENT'">
              {{ $t('investation') | uppercase }}
            </button>
            <button
              type="button"
              class="btn btn-sm"
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
          :disabled="isLoading"
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

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="isLoading">
              <i v-show="isLoading" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  data () {
    return {
      isLoading: false,
      form: new Form({
        type_id: null,
        is_sub_ledger: false,
        is_cash_flow: false,
        sub_ledger: false,
        position: 'DEBIT',
        cash_flow: null,
        cash_flow_position: 'DEBIT',
        name: null,
        number: null
      })
    }
  },
  watch: {
    'form.name' () {
      this.form.code = this.form.name
    }
  },
  methods: {
    ...mapActions('accountingChartOfAccount', ['create']),
    updateAccountType (option) {
      this.form.number = option.next_number
    },
    toggleCashFlow () {
      this.form.is_cash_flow = !this.form.is_cash_flow
      if (this.form.is_cash_flow == false) {
        this.form.cash_flow = null
        this.form.cash_flow_position = null
      }
    },
    onSubmit () {
      if (this.form.cash_flow != null && this.form.cash_flow_position == null) {
        this.$notification.error('please choose cash flow position')
        return
      }
      this.isLoading = true
      this.create(this.form)
        .then(response => {
          this.isLoading = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/accounting/chart-of-account/' + response.data.id)
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
