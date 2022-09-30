<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block :title="$t('payment order')">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('payment order') | uppercase }}</h4>
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
                      label="payment date"
                      :errors="form.errors.get('date')"
                      @errors="form.errors.set('date', null)"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('payment methode') | uppercase }}
                  </td>
                  <td>
                    <p-form-check-box
                      id="payment-methode"
                      class="mb-0"
                      style="float:left"
                      name="payment-methode"
                      :checked="form.payment_type == 'cash'"
                      :description="$t('cash') | uppercase"
                      @click.native="choosePaymentType('cash')"
                    />
                    <p-form-check-box
                      id="payment-type"
                      name="payment-type"
                      class="mb-0"
                      :checked="form.payment_type == 'bank'"
                      :description="$t('bank') | uppercase"
                      @click.native="choosePaymentType('bank')"
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
              <div>
                <h6 class="mb-0 ">
                  {{ $t('supplier') | uppercase }}: <span
                    class="select-link"
                    @click="$refs.supplier.open()"
                  >{{ form.supplier_label || $t('select') | uppercase }}</span>
                </h6>
                {{ form.supplier_address | uppercase }} <br v-if="form.supplier_address">
                {{ form.supplier_phone }} <br v-if="form.supplier_phone">
              </div>
            </div>
          </div>

          <div v-if="form.references">
            <ul
              class="nav nav-tabs nav-tabs-alt mb-10"
              data-toggle="tabs"
              role="tablist"
            >
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link"
                  :class="{'active': choosen == 'invoice'}"
                  @click="choose('invoice')"
                >{{ $t('invoice') | uppercase }}</a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link"
                  :class="{'active': choosen == 'down-payment'}"
                  @click="choose('down-payment')"
                >{{ $t('down payment') | uppercase }}</a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link"
                  :class="{'active': choosen == 'purchase-return'}"
                  @click="choose('purchase-return')"
                >{{ $t('purchase return') | uppercase }}</a>
              </li>
              <li class="nav-item">
                <a
                  href="javascript:void(0)"
                  class="nav-link"
                  :class="{'active': choosen == 'other'}"
                  @click="choose('other')"
                >{{ $t('other') | uppercase }}</a>
              </li>
            </ul>

            <!-- Invoice Table -->
            <point-table
              v-show="choosen === 'invoice'"
            >
              <tr slot="p-head">
                <th width="50px">
                  <p-form-check-box
                    id="subscibe"
                    name="subscibe"
                    :checked="isRowsChecked(form.references.purchase_invoices, checkedRow[0])"
                    :is-form="false"
                    class="text-center"
                    @click.native="toggleCheckRows(0)"
                  />
                </th>
                <th>Date</th>
                <th>Form Number</th>
                <th>Notes</th>
                <th>Available Invoice</th>
                <th>Amount Order</th>
              </tr>
              <template v-for="(row, index) in form.references.purchase_invoices">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>
                    <p-form-check-box
                      id="subscibe"
                      :is-form="false"
                      name="subscibe"
                      :checked="isRowChecked(0, row.id)"
                      class="text-center"
                      @click.native="toggleCheckRow(0, row.id)"
                    />
                  </th>
                  <td>
                    {{ row.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                  <td>
                    {{ row.form_number | uppercase }}
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'available-' + index"
                      :name="'available-' + index"
                      :readonly="true"
                      :value="row.available_amount"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'amount-' + index"
                      v-model.number="row.amount"
                      :name="'amount-' + index"
                      :max="row.amount"
                    />
                  </td>
                </tr>
              </template>
            </point-table>

            <!-- Down Payment Table -->
            <point-table
              v-show="choosen === 'down-payment'"
            >
              <tr slot="p-head">
                <th width="50px">
                  <p-form-check-box
                    id="subscibe"
                    name="subscibe"
                    :checked="isRowsChecked(form.references.purchase_down_payments, checkedRow[1])"
                    :is-form="false"
                    class="text-center"
                    @click.native="toggleCheckRows(1)"
                  />
                </th>
                <th>Date</th>
                <th>Form Number</th>
                <th>Notes</th>
                <th>Available Down Payment</th>
                <th>Amount Order</th>
              </tr>
              <template v-for="(row, index) in form.references.purchase_down_payments">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>
                    <p-form-check-box
                      id="subscibe"
                      :is-form="false"
                      name="subscibe"
                      :checked="isRowChecked(1, row.id)"
                      class="text-center"
                      @click.native="toggleCheckRow(1, row.id)"
                    />
                  </th>
                  <td>
                    {{ row.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                  <td>
                    {{ row.form_number | uppercase }}
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'available-' + index"
                      :name="'available-' + index"
                      :readonly="true"
                      :value="row.available_amount"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'amount-' + index"
                      v-model.number="row.amount"
                      :name="'amount-' + index"
                      :max="row.amount"
                    />
                  </td>
                </tr>
              </template>
            </point-table>

            <!-- Return Table -->
            <point-table
              v-show="choosen === 'purchase-return'"
            >
              <tr slot="p-head">
                <th width="50px">
                  <p-form-check-box
                    id="subscibe"
                    name="subscibe"
                    :checked="isRowsChecked(form.references.purchase_returns, checkedRow[2])"
                    :is-form="false"
                    class="text-center"
                    @click.native="toggleCheckRows(2)"
                  />
                </th>
                <th>Date</th>
                <th>Form Number</th>
                <th>Notes</th>
                <th>Available Purchase Return</th>
                <th>Amount Order</th>
              </tr>
              <template v-for="(row, index) in form.references.purchase_returns">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>
                    <p-form-check-box
                      id="subscibe"
                      :is-form="false"
                      name="subscibe"
                      :checked="isRowChecked(2, row.id)"
                      class="text-center"
                      @click.native="toggleCheckRow(2, row.id)"
                    />
                  </th>
                  <td>
                    {{ row.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                  <td>
                    {{ row.form_number | uppercase }}
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'available-' + index"
                      :name="'available-' + index"
                      :readonly="true"
                      :value="row.available_amount"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'amount-' + index"
                      v-model.number="row.amount"
                      :name="'amount-' + index"
                      :max="row.amount"
                    />
                  </td>
                </tr>
              </template>
            </point-table>

            <!-- Other Table -->
            <point-table
              v-show="choosen === 'other'"
            >
              <tr slot="p-head">
                <th>#</th>
                <th>Account</th>
                <th>Notes</th>
                <th>Amount</th>
                <th>Allocation</th>
              </tr>
              <tr
                v-for="(row, index) in form.others"
                slot="p-body"
                :key="index"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <span
                    class="select-link"
                    @click="$refs.chartOfAccountRef.open(index)"
                  >
                    {{ row.coaName || $t('select') | uppercase }}
                  </span>
                </td>
                <td>
                  <p-form-input
                    :id="'notes-' + index"
                    v-model="row.notes"
                    :name="'notes-' + index"
                  />
                </td>
                <td>
                  <p-form-number
                    :id="'amount-' + index"
                    v-model="row.amount"
                    :name="'amount-' + index"
                    @keyup.native="calculateOther()"
                  />
                </td>
                <td>
                  <span
                    class="select-link"
                    @click="$refs.allocation.open(index)"
                  >
                    {{ row.allocationName || $t('select') | uppercase }}
                  </span>
                </td>
                <td>
                  <i
                    class="btn btn-sm fa fa-times"
                    @click="deleteRowOther(index)"
                  />
                </td>
              </tr>
            </point-table>
            <button
              v-show="choosen === 'other'"
              type="button"
              class="btn btn-sm btn-secondary"
              @click="addRowOther"
            >
              <i class="fa fa-plus" /> {{ $t('add') | uppercase }}
            </button>

            <div class="row">
              <div class="col-sm-7" />
              <div class="col-sm-5">
                <point-table>
                  <tr slot="p-body">
                    <td>Total Amount Invoice</td>
                    <td>
                      <p-form-number
                        :id="'total_invoice'"
                        :name="'total_invoice'"
                        :readonly="true"
                        :value="total_invoice"
                      />
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <td>Total Amount Down Payment</td>
                    <td>
                      <p-form-number
                        :id="'total_down_payment'"
                        :name="'total_down_payment'"
                        :readonly="true"
                        :value="total_down_payment"
                      />
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <td>Total Amount Return</td>
                    <td>
                      <p-form-number
                        :id="'total_return'"
                        :name="'total_return'"
                        :readonly="true"
                        :value="total_return"
                      />
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <td>Total Amount Other</td>
                    <td>
                      <p-form-number
                        :id="'total_other'"
                        v-model.number="form.total_other"
                        :name="'total_other'"
                        :readonly="true"
                        :min="Number.MIN_SAFE_INTEGER"
                      />
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <td>Total Amount</td>
                    <td>
                      <p-form-number
                        :id="'total_amount'"
                        :name="'total_amount'"
                        :readonly="true"
                        :value="total_amount"
                      />
                    </td>
                  </tr>
                </point-table>
              </div>
            </div>

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
                  {{ $t('requested by') | uppercase }}
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
                  type="button"
                  class="btn btn-block btn-sm btn-outline-secondary"
                  @click="openPreview()"
                >
                  {{ $t('preview') | uppercase }}
                </button>
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
          </div>
        </p-block-inner>
      </p-block>
    </form>
    <Coa
      ref="chartOfAccountRef"
      @choosen="onChoosenAccount"
    />
    <m-user
      ref="approver"
      permission="approve purchase payment order"
      @choosen="chooseApprover($event)"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <m-supplier
      ref="supplier"
      @choosen="chooseSupplier"
    />
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import PointTable from 'point-table-vue'
import Form from '@/utils/Form'
import Coa from './Coa'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable,
    Coa
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      isFromPreview: false,
      choosen: 'invoice',
      requestedBy: localStorage.getItem('fullName'),
      userId: localStorage.getItem('userId'),
      checkedRow: [
        [], // purchase_invoices
        [], // purchase_down_payments
        [] // purchase_returns
      ],
      form: new Form({
        supplier_id: null,
        supplier_name: null,
        supplier_label: null,
        supplier_address: null,
        supplier_phone: null,
        supplier_email: null,
        references: null,
        // increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        due_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_type: 'cash',
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        notes: '',
        amount: 0,
        total_invoice: 0,
        total_down_payment: 0,
        total_return: 0,
        total_other: 0,
        total_amount: 0,
        invoices: [{
          id: null,
          amount: 0
        }],
        downPayments: [{
          id: null,
          amount: 0
        }],
        returns: [{
          id: null,
          amount: 0
        }],
        others_filtered: [{
          coaId: null,
          notes: null,
          amount: 0,
          allocationId: null
        }],
        others: [{
          coaId: null,
          coaName: null,
          notes: null,
          amount: 0,
          allocationId: null,
          allocationName: null
        }],
        details: [{
          date: null,
          chart_of_account_id: null,
          chart_of_account_name: null,
          available: null,
          amount: null,
          allocation_id: null,
          allocation_name: null,
          referenceable_form_date: null,
          referenceable_form_number: null,
          referenceable_form_notes: null,
          referenceable_id: null,
          referenceable_type: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    total_invoice () {
      var totalInvoice = 0
      this.form.references.purchase_invoices.forEach(element => {
        if (this.isRowChecked(0, element.id)) {
          totalInvoice += parseFloat(element.amount)
        }
      })
      return totalInvoice
    },
    total_down_payment () {
      var totalDownPayment = 0
      this.form.references.purchase_down_payments.forEach(element => {
        if (this.isRowChecked(1, element.id)) {
          totalDownPayment += parseFloat(element.amount)
        }
      })
      return totalDownPayment
    },
    total_return () {
      var totalReturn = 0
      this.form.references.purchase_returns.forEach(element => {
        if (this.isRowChecked(2, element.id)) {
          totalReturn += parseFloat(element.amount)
        }
      })
      return totalReturn
    },
    total_amount () {
      var totalAmount = this.total_invoice - (this.total_return + this.total_down_payment)
      return totalAmount
    }
  },
  created () {
    this.getDataFromStorage()
  },
  methods: {
    ...mapActions('purchasePaymentOrder', ['getReferences', 'create']),
    ...mapActions('salesPaymentCollectionApproval', ['sendSingle']),
    getDataFromStorage () {
      var data = JSON.parse(localStorage.getItem('paymentCollectionData'))
      if (data) {
        this.isFromPreview = true
        this.form = new Form(data.form)
        this.checkedRow = data.checkedRow
        localStorage.removeItem('paymentCollectionData')
      }
    },
    toggleCheckRow (refIndex, id) {
      if (!this.isRowChecked(refIndex, id)) {
        this.checkedRow[refIndex].push({ id })
      } else {
        this.checkedRow[refIndex].splice(this.checkedRow[refIndex].map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows (refIndex) {
      let haystack = []
      if (refIndex === 0) {
        haystack = this.form.references.purchase_invoices
      } else if (refIndex === 1) {
        haystack = this.form.references.purchase_down_payments
      } else if (refIndex === 2) {
        haystack = this.form.references.purchase_returns
      }
      if (!this.isRowsChecked(haystack, this.checkedRow[refIndex])) {
        haystack.forEach(element => {
          if (!this.isRowChecked(refIndex, element.id)) {
            const id = element.id
            this.checkedRow[refIndex].push({ id })
          }
        })
      } else {
        haystack.forEach(element => {
          this.checkedRow[refIndex].splice(this.checkedRow[refIndex].map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    isRowChecked (refIndex, id) {
      return this.checkedRow[refIndex].some(element => {
        return element.id == id
      })
    },
    isRowsChecked (haystack, needles) {
      if (needles.length == 0) {
        return false
      }
      for (let i = 0; i < haystack.length; i++) {
        const found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    },
    getAvailableReference () {
      this.isLoading = true
      this.getReferences({
        id: this.form.supplier_id
      }).then(response => {
        if (response.data.purchase_invoices.length === 0 &&
        response.data.purchase_down_payments.length === 0 &&
        response.data.purchase_returns.length === 0) {
          this.$notification.error('supplier doesn\'t have purchase form to collect')
        } else {
          console.log(response)
          this.form.references = response.data
        }
        this.isLoading = false
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    choose (type) {
      this.choosen = type
    },
    choosePaymentType (type) {
      this.form.payment_type = type
    },
    openPreview () {
      if (!this.isFromPreview) {
        this.checkedRowToForm()
      }
      this.form.amount = this.total_amount
      this.form.total_invoice = this.total_invoice
      this.form.total_down_payment = this.total_down_payment
      this.form.total_return = this.total_return
      var object = {
        checkedRow: this.checkedRow,
        form: this.form
      }
      console.log(JSON.stringify(this.form))
      localStorage.setItem('paymentCollectionData', JSON.stringify(object))
      this.$router.push({ name: 'purchase.payment-order.show', params: { source: 'create' } })
    },
    onChoosenAccount (account) {
      const row = this.form.others[account.index]
      row.coaId = account.id
      row.coaName = account.label
    },
    checkedRowToForm () {
      this.checkedRow[0].forEach(element => {
        const purchaseInvoice = this.form.references.purchase_invoices.find((purchaseInvoice) => purchaseInvoice.id === element.id)
        if (purchaseInvoice) {
          this.form.invoices.push({
            id: purchaseInvoice.id,
            amount: purchaseInvoice.amount
          })
        }
      })

      this.checkedRow[1].forEach(element => {
        const purchaseDownPayment = this.form.references.purchase_down_payments.find((purchaseDownPayment) => purchaseDownPayment.id === element.id)
        if (purchaseDownPayment) {
          this.form.downPayments.push({
            id: purchaseDownPayment.id,
            amount: purchaseDownPayment.amount
          })
        }
      })

      this.checkedRow[2].forEach(element => {
        const purchaseReturn = this.form.references.purchase_returns.find((purchaseReturn) => purchaseReturn.id === element.id)
        if (purchaseReturn) {
          this.form.returns.push({
            id: purchaseReturn.id,
            amount: purchaseReturn.amount
          })
        }
      })
    },
    addRowOther () {
      this.form.others.push({
        coaId: null,
        coaName: null,
        amount: null,
        allocationId: null,
        allocationName: null,
        notes: null
      })
    },
    deleteRowOther (index) {
      this.$delete(this.form.others, index)
      this.calculateOther()
    },
    calculateOther: debounce(function () {
      var totalAmount = 0
      this.form.others.forEach(function (element) {
        console.log(JSON.stringify(element))
        if (element.is_debit === 1) {
          totalAmount -= parseFloat(element.amount)
        } else {
          totalAmount += parseFloat(element.amount)
        }
      })
      this.form.total_other = totalAmount
    }, 300),
    chooseAllocation (allocation) {
      const row = this.form.others[allocation.index]
      row.allocationId = allocation.id
      row.allocationName = allocation.name
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    chooseSupplier (value) {
      this.form.supplier_id = value.id
      this.form.supplier_name = value.name
      this.form.supplier_label = value.label
      this.form.supplier_address = value.address
      this.form.supplier_phone = value.phone
      this.form.supplier_email = value.email
      this.getAvailableReference()
    },
    onSubmit () {
      // var totalInvoice = this.total_invoice
      // var totalDownPayment = this.total_down_payment
      // var totalReturn = this.total_return
      // var totalOther = this.form.total_other

      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }

      if (this.form.notes) {
        if (this.form.notes.length > 255) {
          this.$notification.error('notes cannot be more than 255 character')
          this.isSaving = false
          this.form.errors.record({
            notes: ['notes cannot be more than 255 character']
          })
          return
        }

        if (this.form.notes.charAt(0) === ' ' || this.form.notes.charAt(this.form.notes.length - 1) === ' ') {
          this.$notification.error('notes cannot start or end with space')
          this.isSaving = false
          this.form.errors.record({
            notes: ['notes cannot start or end with space']
          })
          return
        }
      }

      this.form.invoices = []
      this.form.downPayments = []
      this.form.returns = []
      this.form.others_filtered = []
      this.checkedRowToForm()
      this.filteringOthersForm()
      const payload = {
        paymentType: this.form.payment_type,
        supplierId: this.form.supplier_id,
        date: this.$options.filters.dateFormat(this.form.date, 'YYYY-MM-DD'),
        paymentAccountId: this.userId,
        invoices: this.form.invoices,
        downPayments: this.form.downPayments,
        returns: this.form.returns,
        others: this.form.others_filtered,
        totalInvoiceAmount: this.total_invoice,
        totalDownPaymentAmount: this.total_down_payment,
        totalReturnAmount: this.total_return,
        totalOtherAmount: this.form.total_other,
        totalAmount: this.total_amount,
        approvedBy: this.form.request_approval_to,
        notes: this.form.notes
      }

      this.isSaving = true
      this.create(payload)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/purchase/payment-order/' + response.data.paymentOrder.id)
          // this.sendSingle({
          //   id: response.data.id,
          //   total_invoice: totalInvoice,
          //   total_down_payment: totalDownPayment,
          //   total_return: totalReturn,
          //   total_other: totalOther
          // })
            .catch(error => {
              this.$notification.error(error.message)
              this.form.errors.record(error.errors)
            })
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    filteringOthersForm () {
      this.form.others.forEach(element => {
        this.form.others_filtered.push({
          coaId: element.coaId,
          notes: element.notes,
          amount: element.amount,
          allocationId: element.allocationId
        })
      })
    }
  }
}
</script>
