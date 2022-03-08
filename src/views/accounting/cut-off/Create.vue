<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item">
        <router-link
          to="/accounting/cut-off"
          class="breadcrumb-item"
        >{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <p-block>
            <h4>{{ $t('cut off') | uppercase }}</h4>
            <hr>
            <p-block-inner :is-loading="isLoading">
              <div class="col-sm-12 text-left">
                <form @submit.prevent="onSubmit">
                  <p-form-row
                    v-if="!isLoading"
                    id="date"
                    name="date"
                    :label="$t('date')"
                  >
                    <div
                      slot="body"
                      class="col-lg-9"
                    >
                      <p-date-picker
                        id="date"
                        v-model="form.date"
                        name="date"
                        :label="$t('date')"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"
                      />
                    </div>
                  </p-form-row>
                </form>
              </div>
              <point-table>
                <tr slot="p-head">
                  <th>{{ $t('account number') | uppercase }}</th>
                  <th>{{ $t('account name') | uppercase }}</th>
                  <th>Debit</th>
                  <th>Credit</th>
                </tr>
                <template slot="p-body">
                  <tr
                    v-for="(row, index) in form.details"
                    slot="p-body"
                    :key="index"
                  >
                    <td
                      width="150"
                      class="align-top"
                    >
                      {{ row.chart_of_account_number }}
                    </td>
                    <td class="align-top">
                      <span
                        class="select-link"
                        @click="$refs.chartOfAccountRef.open(index, false)"
                      >
                        {{ row.chart_of_account_name || $t('select') | uppercase }}
                      </span>
                    </td>
                    <td class="align-top">
                      <span
                        @click="showModal(index, row, isDisabledDebit(row))"
                      >
                        <p-form-number
                          :id="'debit-' + index"
                          v-model="row.debit"
                          :disabled="isDisabledDebit(row)"
                          :name="'debit-' + index"
                        />
                      </span>
                      <span
                        v-if="!isDisabledDebit(row) && errors && Object.keys(errors).reduce((prev, key) => prev || key.indexOf('details.'+index) > -1, false)"
                        class="text-danger"
                      >
                        {{ errors['details.'+index] }}
                      </span>
                    </td>
                    <td class="align-top">
                      <span
                        @click="showModal(index, row, isDisabledCredit(row))"
                      >
                        <p-form-number
                          :id="'credit-' + index"
                          v-model="row.credit"
                          :disabled="isDisabledCredit(row)"
                          :name="'credit-' + index"
                        />
                      </span>
                      <span
                        v-if="!isDisabledCredit(row) && errors && Object.keys(errors).reduce((prev, key) => prev || key.indexOf('details.'+index) > -1, false)"
                        class="text-danger"
                      >
                        {{ errors['details.'+index] }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      align="center"
                    >
                      <b>Total</b>
                    </td>
                    <td align="right">
                      {{ (form.details.reduce((total, detail) => total + parseFloat(detail.debit), 0)) | numberFormat }}
                    </td>
                    <td align="right">
                      {{ (form.details.reduce((total, detail) => total + parseFloat(detail.credit), 0)) | numberFormat }}
                    </td>
                  </tr>
                </template>
              </point-table>
              <div class="row mt-50">
                <div class="col-sm-12">
                  *) {{ $t('cutoff form warning') | capitalize }}
                  <br>
                  <br>
                </div>
                <div class="col-sm-8">
                  <textarea
                    v-model="form.notes"
                    rows="5"
                    class="form-control"
                    placeholder="Notes"
                  />
                  <div class="mt-10 d-sm-block d-md-none" />
                </div>
                <div class="text-center col-sm-4">
                  <h6 class="mb-0">
                    {{ $t('created by') | uppercase }}
                  </h6>
                  <div
                    class="mb-50"
                    style="font-size:11px"
                  />
                  {{ requestedBy | uppercase }}
                  <div class="mt-10 d-sm-block d-md-none" />
                </div>
                <div class="col-sm-12">
                  <hr>
                  <button
                    type="submit"
                    class="btn btn-block btn-sm btn-primary"
                    :disabled="isSaving"
                    @click="onSubmit"
                  >
                    <em
                      v-show="isSaving"
                      class="fa fa-asterisk fa-spin"
                    /> {{ $t('save') | uppercase }}
                  </button>
                </div>
              </div>
            </p-block-inner>
          </p-block>
        </div>
      </div>
    </div>

    <m-chart-of-account
      ref="chartOfAccountRef"
      v-model="form.fixed_asset_group_id"
      @choosen="onChoosenAccount"
      @close="recalculate"
    />
    <MPaymentAdd
      ref="paymentRef"
      @choosen="onPaymentSubmit"
      @close="recalculate"
    />
    <MInventoriesAdd
      ref="inventorieRef"
      @choosen="onInventoriesSubmit"
      @close="recalculate"
    />
    <MFixedAssetAdd
      ref="fixedAssetRef"
      @choosen="onFixedAssetSubmit"
      @close="recalculate"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import MPaymentAdd from './MPaymentAdd.vue'
import MInventoriesAdd from './MInventoriesAdd.vue'
import MFixedAssetAdd from './MFixedAssetAdd.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable,
    MPaymentAdd,
    MInventoriesAdd,
    MFixedAssetAdd
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      isCutOffStarted: false,
      requestedBy: localStorage.getItem('fullName'),
      errors: [],
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD'),
        increment_group: this.$moment().format('YYYYMM'),
        notes: null,
        details: []
      })
    }
  },
  created () {
    this.addItemRow()
  },
  methods: {
    ...mapActions('accountingCutOff', ['create']),
    onChoosenAccount (account) {
      this.errors = []
      if (typeof this.form.details[account.index] !== 'undefined' && this.form.details[account.index].chart_of_account_id !== account.id) {
        this.form.details[account.index].items = []
        this.form.details[account.index].debit = 0
        this.form.details[account.index].credit = 0
      }
      this.form.details[account.index].chart_of_account_position = account.position
      this.form.details[account.index].chart_of_account_sub_ledger = account.sub_ledger || null
      this.form.details[account.index].chart_of_account_type = account.type
      this.form.details[account.index].chart_of_account_id = account.id
      this.form.details[account.index].chart_of_account_number = account.number
      this.form.details[account.index].chart_of_account_name = account.alias
      this.addItemRow()
    },
    onPaymentSubmit (items) {
      this.form.details[items.index].items = items.items
      this.form.details[items.index].debit = this.sumPayment(this.form.details[items.index], 'DEBIT')
      this.form.details[items.index].credit = this.sumPayment(this.form.details[items.index], 'CREDIT')
    },
    onInventoriesSubmit (items) {
      this.form.details[items.index].items = items.items
      this.form.details[items.index].debit = this.sumInventories(this.form.details[items.index], 'DEBIT')
      this.form.details[items.index].credit = this.sumInventories(this.form.details[items.index], 'CREDIT')
    },
    onFixedAssetSubmit (items) {
      this.form.details[items.index].items = items.items
      this.form.details[items.index].debit = this.sumFixedAsset(this.form.details[items.index], 'DEBIT')
      this.form.details[items.index].credit = this.sumFixedAsset(this.form.details[items.index], 'CREDIT')
    },
    sumPayment (row, position) {
      if (!row) return null
      if (row.chart_of_account_position !== position) return 0
      return row.items.reduce((total, curr) => total + parseFloat(curr.amount), 0)
    },
    sumInventories (row, position) {
      if (!row) return null
      if (row.chart_of_account_position !== position) return 0
      return row.items.reduce((total, curr) => total + parseFloat(curr.total), 0)
    },
    sumFixedAsset (row, position) {
      if (!row) return null
      if (row.chart_of_account_position !== position) return 0
      return row.items.reduce((total, curr) => total + parseFloat(curr.total), 0)
    },
    recalculate () {
      this.form.details.map(detail => {
        if (!detail.chart_of_account_id || !detail.chart_of_account_sub_ledger) return detail

        if (['CUSTOMER', 'SUPPLIER', 'EXPEDITION', 'EMPLOYEE'].indexOf(detail.chart_of_account_sub_ledger.trim()) > -1) {
          detail.debit = this.sumPayment(detail, 'DEBIT')
          detail.credit = this.sumPayment(detail, 'CREDIT')
        } else if (detail.chart_of_account_sub_ledger.trim() === 'ITEM') {
          detail.debit = this.sumInventories(detail, 'DEBIT')
          detail.credit = this.sumInventories(detail, 'CREDIT')
        } else if (detail.chart_of_account_sub_ledger.trim() === 'FIXED ASSET') {
          detail.debit = this.sumFixedAsset(detail, 'DEBIT')
          detail.credit = this.sumFixedAsset(detail, 'CREDIT')
        }

        return detail
      })
    },
    getError (row, key, exact = true) {
      if (exact && this.errors[key]) {
        return this.errors[key]
      }
      console.log(this.errors, Object.keys(this.errors), key)
      Object.keys(this.errors).forEach(element => {
        if (element.indexOf(key) > -1) return 'Invalid given data'
      })
    },
    addItemRow () {
      let isNeedNewRow = true
      this.form.details.forEach(element => {
        if (element.chart_of_account_id == null) {
          isNeedNewRow = false
        }
      })
      if (!isNeedNewRow) return true
      this.form.details.push({
        chart_of_account_name: null,
        chart_of_account_sub_ledger: null,
        chart_of_account_type: null,
        chart_of_account_number: null,
        chart_of_account_id: null,
        debit: 0,
        credit: 0,
        items: []
      })
    },
    showModal (index, row, isDisabled) {
      if (isDisabled || !row.chart_of_account_sub_ledger) return
      if (['CUSTOMER', 'SUPPLIER', 'EXPEDITION', 'EMPLOYEE'].indexOf(row.chart_of_account_sub_ledger.trim()) > -1) {
        this.$refs.paymentRef.id = index
        this.$refs.paymentRef.errors = this.errors
        this.$refs.paymentRef.open(index, row)
      } else if (row.chart_of_account_sub_ledger.trim() === 'ITEM') {
        this.$refs.inventorieRef.id = index
        this.$refs.inventorieRef.errors = this.errors
        this.$refs.inventorieRef.open(index, row)
      } else if (row.chart_of_account_sub_ledger.trim() === 'FIXED ASSET') {
        this.$refs.fixedAssetRef.id = index
        this.$refs.fixedAssetRef.errors = this.errors
        this.$refs.fixedAssetRef.open(index, row)
      }
    },
    isDisabledDebit (row) {
      return !row.chart_of_account_id || row.chart_of_account_position !== 'DEBIT'
    },
    isDisabledCredit (row) {
      return !row.chart_of_account_id || row.chart_of_account_position !== 'CREDIT'
    },
    onSubmit () {
      this.errors = []
      this.isSaving = true
      this.form.details = this.form.details.filter(item => item.chart_of_account_id !== null)
      this.form.details = this.form.details.map(item => {
        item.items = item.items.filter(i => i.object_id !== null)
        return item
      })
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$router.push('/accounting/cut-off')
        }).catch(error => {
          this.isSaving = false
          this.errors = error.errors
          this.$notification.error(error.message)
          this.addItemRow()
        })
    }
  }
}
</script>
