<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item">
        <router-link
          to="/accounting/memo-journal"
          class="breadcrumb-item"
        >{{ $t('memo jurnal') | uppercase }}</router-link>
      </span>
      <router-link
        :to="{ name: 'accounting.memo.journal.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ accountingMemoJournal.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('Memo Jurnal') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('date') | uppercase }}
                    </td>
                    <td>
                      <p-date-picker
                        id="date"
                        v-model="form.date"
                        name="date"
                        :label="$t('date')"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"
                      />
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-sm-6 text-right">
                <div class="mb-30">
                  <h6 class="mb-0">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  <template v-if="authUser.branch">
                    {{ authUser.branch.address | uppercase }} <br v-if="authUser.branch.address">
                    {{ authUser.branch.phone | uppercase }} <br v-if="authUser.branch.phone">
                  </template>
                </div>
              </div>
            </div>
            <hr>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Account
                </th>
                <th>Master</th>
                <th>Reference</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Notes</th>
              </tr>
              <template slot="p-body">
                <tr
                  v-for="(row, index) in form.items"
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.chartOfAccountRef.open(index, false)"
                    >
                      {{ row.chart_of_account_label || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="showModal(index, row)"
                    >
                      {{ row.masterable_name || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.SelectReference.open(index, row)"
                    >
                      {{ row.form_number || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <p-form-number
                      :id="'debit-' + index"
                      v-model="row.debit"
                      :name="'debit-' + index"
                      :change="onChangeAmount(row)"
                      :readonly="row.chart_of_account_id == null"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'credit-' + index"
                      v-model="row.credit"
                      :name="'credit-' + index"
                      :change="onChangeAmount(row)"
                      :readonly="row.chart_of_account_id == null"
                    />
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                      :readonly="row.chart_of_account_id == null"
                    />
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="4"
                    align="center"
                  >
                    <b>Total</b>
                  </td>
                  <td align="right">
                    {{ (form.items.reduce((total, item) => total + parseFloat(item.debit), 0)) | numberFormat }}
                  </td>
                  <td align="right">
                    {{ (form.items.reduce((total, item) => total + parseFloat(item.credit), 0)) | numberFormat }}
                  </td>
                  <td />
                </tr>
              </template>
            </point-table>

            <div class="row">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('created by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  {{ Date.now() | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ requestedBy | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('approved by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  _______________
                </div>
                <span
                  class="select-link"
                  @click="$refs.approver.open()"
                >{{ form.approver_name || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
              </div>

              <div class="col-sm-12">
                <hr>
                <button
                  type="submit"
                  class="btn btn-block btn-sm btn-primary"
                  :disabled="isSaving"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-chart-of-account
      ref="chartOfAccountRef"
      :exclude="[1,3]"
      @choosen="onChoosenAccount"
    />
    <m-customer
      ref="customerRef"
      @choosen="chooseMaster"
    />
    <m-supplier
      ref="supplierRef"
      @choosen="chooseMaster"
    />
    <m-expedition
      id="id"
      ref="expeditionRef"
      @choosen="chooseMaster"
    />
    <m-employee
      id="id"
      ref="employeeRef"
      @choosen="chooseMaster"
    />
    <m-fixed-asset
      id="id"
      ref="fixedAssetRef"
      @choosen="chooseMaster"
    />
    <m-item
      ref="itemRef"
      :create-button="false"
      @choosen="chooseMaster"
    />
    <select-reference
      ref="SelectReference"
      @choosen="chooseFormReference"
    />
    <m-user
      ref="approver"
      :permission="'approve memo journal'"
      @choosen="chooseApprover"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectReference from './SelectReference'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbAccounting,
    SelectReference
  },
  data () {
    return {
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      debitAmount: [],
      creditAmount: [],
      form: new Form({
        old_id: this.$route.params.id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        notes: null,
        items: [],
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      })
    }
  },
  computed: {
    ...mapGetters('accountingMemoJournal', ['accountingMemoJournal']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.$route.params.id,
      params: {
        includes: 'items.chart_of_account;items.form;items.masterable;form.createdBy;form.requestApprovalTo;form.branch;'
      }
    }).then(response => {
      this.isLoading = false
      const items = []
      response.data.items.forEach(el => {
        items.push({
          chart_of_account_id: el.chart_of_account_id,
          chart_of_account_name: el.chart_of_account_name,
          chart_of_account_label: el.chart_of_account.label,
          chart_of_account_sub_ledger: el.chart_of_account.sub_ledger,
          masterable_id: el.masterable_id,
          masterable_type: el.masterable_type,
          masterable_name: el.masterable_id ? el.masterable.name : '',
          form_id: el.form_id,
          form_number: el.form_id ? el.form.number : '',
          debit: el.debit,
          credit: el.credit,
          notes: el.notes
        })
      })
      this.form.date = response.data.form.date
      this.form.notes = response.data.form.notes
      this.form.items = items
      this.form.request_approval_to = response.data.form.request_approval_to.id
      this.form.approver_name = response.data.form.request_approval_to.full_name
      this.form.approver_email = response.data.form.request_approval_to.email
      this.addItemRow()
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('accountingMemoJournal', ['find', 'update', 'addHistories', 'getDataFormReferences']),
    addItemRow () {
      this.form.items.push({
        chart_of_account_id: null,
        masterable_id: null,
        masterable_type: null,
        masterable_name: null,
        form_id: null,
        form_number: null,
        credit: 0,
        debit: 0,
        notes: null
      })
    },
    clearItem (index) {
      this.form.items.splice(index, 1)
      if (this.form.items.length === 0) {
        this.addItemRow()
      }
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    onChoosenAccount (account) {
      const row = this.form.items[account.index]
      row.chart_of_account_id = account.id
      row.chart_of_account_name = account.alias
      row.chart_of_account_label = account.label
      row.chart_of_account_type = account.type
      row.chart_of_account_position = account.position
      row.chart_of_account_sub_ledger = account.sub_ledger
      row.masterable_id = null
      row.masterable_name = null
      row.form_id = null
      row.form_number = null
      row.credit = 0
      row.debit = 0
      let isNeedNewRow = true
      this.form.items.forEach(element => {
        if (element.chart_of_account_id == null) {
          isNeedNewRow = false
        }
      })
      if (isNeedNewRow) {
        this.addItemRow()
      }
    },
    showModal (index, row) {
      if (!row.chart_of_account_sub_ledger) return
      if (row.form_id) return
      if (row.chart_of_account_sub_ledger.trim() === 'CUSTOMER') {
        this.$refs.customerRef.open(index)
      } else if (row.chart_of_account_sub_ledger.trim() === 'ITEM') {
        this.$refs.itemRef.open(index)
      } else if (row.chart_of_account_sub_ledger.trim() === 'SUPPLIER') {
        this.$refs.supplierRef.open(index)
      } else if (row.chart_of_account_sub_ledger.trim() === 'EXPEDITION') {
        this.$refs.expeditionRef.open(index)
      } else if (row.chart_of_account_sub_ledger.trim() === 'EMPLOYEE') {
        this.$refs.employeeRef.open(index)
      } else if (row.chart_of_account_sub_ledger.trim() === 'FIXED ASSET') {
        this.$refs.fixedAssetRef.open(index)
      }
    },
    chooseMaster (master) {
      const row = this.form.items[master.index]
      if (row.chart_of_account_sub_ledger == 'FIXED ASSET') {
        row.masterable_type = 'FixedAsset'
      } else {
        const lower = row.chart_of_account_sub_ledger.toLowerCase()
        row.masterable_type = row.chart_of_account_sub_ledger.charAt(0) + lower.slice(1)
      }
      row.masterable_id = master.id
      row.masterable_name = master.name
      if (row.form_id != null) {
        this.getDataFormReferences({
          params: {
            coa_id: row.chart_of_account_id,
            form_id: row.form_id,
            master_id: row.masterable_id
          }
        }).then(response => {
          if (response.data.credit > 0) {
            row.credit = response.data.credit
            this.creditAmount.push({
              coa_id: response.data.chart_of_account_id,
              amount: response.data.credit
            })
            row.debit = 0
          } else if (response.data.debit > 0) {
            row.debit = response.data.debit
            this.debitAmount.push({
              coa_id: response.data.chart_of_account_id,
              amount: response.data.debit
            })
            row.credit = 0
          }
        }).catch(error => {
          this.$notification.error(error.message)
        }).finally(() => {
          this.isLoading = false
        })
      } else {
        row.credit = 0
        row.debit = 0
      }
    },
    chooseFormReference (form) {
      const row = this.form.items[form.index]
      row.form_id = form.id
      row.form_number = form.number
      this.getDataFormReferences({
        params: {
          coa_id: row.chart_of_account_id,
          form_id: row.form_id,
          master_id: row.masterable_id
        }
      }).then(response => {
        if (response.data.credit > 0) {
          row.credit = response.data.credit
          this.creditAmount.push({
            coa_id: response.data.chart_of_account_id,
            amount: response.data.credit
          })
          row.debit = 0
        } else if (response.data.debit > 0) {
          row.debit = response.data.debit
          this.debitAmount.push({
            coa_id: response.data.chart_of_account_id,
            amount: response.data.debit
          })
          row.credit = 0
        }
        if (response.data.journalable != null) {
          if (row.masterable_name == null) {
            row.masterable_id = response.data.journalable_id
            row.masterable_type = response.data.journalable_type
            row.masterable_name = response.data.journalable.name
          }
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    onChangeAmount (row) {
      if (row.debit == '') {
        row.debit = parseFloat(0)
      }
      if (row.credit == '') {
        row.credit = parseFloat(0)
      }
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
      const totalDebit = this.form.items.reduce((total, item) => total + parseFloat(item.debit), 0)
      const totalCredit = this.form.items.reduce((total, item) => total + parseFloat(item.credit), 0)
      if (totalDebit != totalCredit) {
        this.$notification.error('Total debit credit tidak balance')
        this.isSaving = false
        return
      }
      let warningMinus = false
      let warningBalance = false
      const warningMaster = { value: false, account: '' }
      const subLedger = ['CUSTOMER', 'ITEM', 'SUPPLIER', 'EXPEDITION', 'EMPLOYEE', 'FIXED ASSET']
      this.form.items.forEach(item => {
        if (item.chart_of_account_sub_ledger != null && subLedger.includes(item.chart_of_account_sub_ledger.trim())) {
          if (item.masterable_id == null || item.masterable_type == null) {
            warningMaster.value = true
            warningMaster.account = item.chart_of_account_name
          }
        }
        if (item.credit < 0 || item.debit < 0) {
          warningMinus = true
        }
        if (this.debitAmount.length > 0) {
          this.debitAmount.forEach(e => {
            if (e.coa_id == item.chart_of_account_id && item.credit > e.amount) {
              warningBalance = true
            }
          })
        }
        if (this.creditAmount.length > 0) {
          this.creditAmount.forEach(e => {
            if (e.coa_id == item.chart_of_account_id && item.debit > e.amount) {
              warningBalance = true
            }
          })
        }
      })
      if (warningMaster.value) {
        this.$notification.error('Master ' + warningMaster.account + ' tidak boleh kosong')
        this.isSaving = false
        return
      }
      if (warningMinus) {
        this.$notification.error('Nominal tidak boleh minus')
        this.isSaving = false
        return
      }
      if (warningBalance) {
        this.$notification.error('Balance not enough')
        this.isSaving = false
        return
      }
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.items = this.form.items.filter(item => item.chart_of_account_id)
      this.update(this.form).then(response => {
        this.isSaving = false
        this.$notification.success('update success')
        Object.assign(this.$data, this.$options.data.call(this))
        this.$router.push('/accounting/memo-journal/' + response.data.id)
        this.addHistories({ id: this.id, activity: 'Update' })
          .catch(error => {
            this.$notification.error(error.message)
            this.form.errors.record(error.errors)
          })
      }).catch(error => {
        this.isSaving = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
