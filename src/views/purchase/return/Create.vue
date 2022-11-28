<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/return"
        class="breadcrumb-item"
      >
        {{ $t('purchase return ') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('purchase return') | uppercase }}</h4>
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
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('Purchase Invoice') | uppercase }}
                    </td>
                    <td>
                      <span
                        id="select-purchase-invoice"
                        class="select-link"
                        @click="$refs.selectPurchaseInvoice.open()"
                      >
                        <template v-if="purchaseInvoice && purchaseInvoice.form.number != null">
                          {{ purchaseInvoice.form.number }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('warehouse') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.warehouse.open()"
                      >{{ form.warehouseName || $t('select') | uppercase }}</span>
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
                    {{ $t('to') | uppercase }}:
                  </h6>
                  {{ form.supplierName | uppercase }}
                  <div
                    v-if="form.supplierPhone"
                    style="font-size:12px"
                  >
                    <br v-if="form.supplierAddress">{{ form.supplierAddress | uppercase }}
                    <br v-if="form.supplierPhone">{{ form.supplierPhone }}
                    <br v-if="form.supplierEmail">{{ form.supplierEmail | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <point-table v-if="form.items.length > 0">
              <tr slot="p-head">
                <th>No</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th>Quantity Invoice</th>
                <th>Quantity Return</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Alocation</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    {{ row.itemName || $t('select') | uppercase }}
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'quantity' + index"
                      v-model="row.quantityRemaining"
                      :name="'quantity' + index"
                      :item-id="row.itemId"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      disabled
                      readonly
                    />
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'quantity-return' + index"
                      v-model="row.quantity"
                      :name="'quantity-return' + index"
                      :max="Number(row.quantityRemaining)"
                      :item-id="row.itemId"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'price' + index"
                      v-model.number="row.price"
                      :name="'price' + index"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'price' + index"
                      v-model.number="row.discountValue"
                      :name="'price' + index"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'total-' + index"
                      :name="'total-' + index"
                      :readonly="true"
                      :value="(row.price - row.discountValue) * row.quantity"
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
                </tr>
              </template>
            </point-table>

            <div
              v-if="purchaseInvoice.form.number"
              class="row"
            >
              <div class="col-sm-6">
                <textarea
                  rows="14"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>
              <div class="col-sm-6">
                <p-form-row
                  id="sub_total"
                  name="sub_total"
                  :label="$t('sub total')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'sub_total'"
                      :name="'sub_total'"
                      :readonly="true"
                      :value="sub_total"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="tax_base"
                  name="tax_base"
                  :label="$t('tax base')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'tax_base'"
                      :name="'tax_base'"
                      :readonly="true"
                      :value="tax_base"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="tax_amount"
                  name="tax_amount"
                  :label="$t('tax amount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'tax_amount'"
                      :name="'tax_amount'"
                      :readonly="true"
                      :value="tax_amount"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="amount"
                  name="amount"
                  :label="$t('amount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'amount'"
                      :name="'amount'"
                      :readonly="true"
                      :value="amount"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr v-if="purchaseInvoice.form.number">
            <div
              v-if="purchaseInvoice.form.number"
              class="row"
            >
              <div class="col-sm-6" />
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
                >{{ form.approverName || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approverEmail | uppercase }}</span>
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
    <m-supplier
      ref="supplier"
      @choosen="chooseSupplier"
    />
    <m-user
      ref="approver"
      permission="approve purchase return"
      @choosen="chooseApprover"
    />
    <m-warehouse
      id="warehouse"
      ref="warehouse"
      name="warehouse"
      @choosen="chooseWarehouse"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <select-purchase-invoice
      ref="selectPurchaseInvoice"
      @choosen="choosePurchaseInvoice"
    />
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import PointTable from 'point-table-vue'
import Form from '@/utils/Form'
import SelectPurchaseInvoice from './SelectPurchaseInvoice'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable,
    SelectPurchaseInvoice
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      purchaseInvoice: {
        form: {
          number: null
        }
      },
      warehouseName: '-',
      form: new Form({
        incrementGroup: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplierId: null,
        supplierName: null,
        supplierLabel: null,
        supplierAddress: null,
        supplierPhone: null,
        supplierEmail: null,
        notes: null,
        taxBase: 0,
        tax: 0,
        typeOfTax: 'exclude',
        items: [],
        requestApprovalTo: null,
        approverName: null,
        approverEmail: null,
        purchaseInvoiceId: null,
        warehouseName: null,
        warehouseId: 0
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    sub_total () {
      return this.form.items.reduce((carry, item) => {
        return carry + item.quantity * (item.price - item.discountValue)
      }, 0)
    },
    tax_base () {
      return this.sub_total
    },
    tax_amount () {
      let value = 0
      if (this.form.typeOfTax == 'include') {
        value = this.tax_base - (this.tax_base * 10 / 11)
      } else if (this.form.typeOfTax == 'exclude') {
        value = this.tax_base / 10
      }
      return value
    },
    amount () {
      if (this.form.typeOfTax == 'include') {
        return this.sub_total
      } else {
        return this.sub_total + this.tax_amount
      }
    }
  },
  methods: {
    ...mapActions('purchaseReturn', ['create']),
    chooseWarehouse (warehouse) {
      this.form.warehouseId = warehouse.id
      this.form.warehouseName = warehouse.name
    },
    chooseApprover (value) {
      this.form.requestApprovalTo = value.id
      this.form.approverName = value.fullName
      this.form.approverEmail = value.email
    },
    choosePurchaseInvoice (purchaseInvoice) {
      this.form.items = []
      this.purchaseInvoice = purchaseInvoice
      this.form.purchaseInvoiceId = purchaseInvoice.id
      this.form.supplierId = purchaseInvoice.supplierId
      this.form.supplierName = purchaseInvoice.supplierName
      this.form.supplierLabel = purchaseInvoice.supplierLabel
      this.form.supplierAddress = purchaseInvoice.supplierAddress
      this.form.supplierPhone = purchaseInvoice.supplierPhone
      this.form.supplierEmail = purchaseInvoice.supplierEmail
      this.form.typeOfTax = purchaseInvoice.typeOfTax
      purchaseInvoice.items.forEach(purchaseInvoiceItem => {
        if (purchaseInvoice.form.done == false) {
          this.form.warehouseId = purchaseInvoiceItem.purchaseReceive.warehouseId
          this.form.warehouseName = purchaseInvoiceItem.purchaseReceive.warehouseName
          this.form.items.push({
            purchaseInvoiceItemId: purchaseInvoiceItem.id,
            itemId: purchaseInvoiceItem.itemId,
            itemName: purchaseInvoiceItem.itemName,
            more: false,
            unit: purchaseInvoiceItem.unit,
            converter: purchaseInvoiceItem.converter,
            quantity: 0,
            quantityRemaining: purchaseInvoiceItem.quantity,
            price: purchaseInvoiceItem.price,
            discountPercent: purchaseInvoiceItem.discountPercent,
            discountValue: purchaseInvoiceItem.discountValue,
            total: purchaseInvoiceItem.quantity * (purchaseInvoiceItem.price - purchaseInvoiceItem.discountValue),
            allocationId: purchaseInvoiceItem.allocationId,
            allocation_name: purchaseInvoiceItem.allocationName,
            notes: purchaseInvoiceItem.notes
          })
        }
      })
      // this.addItemRow()
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.requestApprovalTo == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          requestApprovalTo: ['Approver should not empty']
        })
        return
      }

      const items = this.form.items.map((item) => {
        return {
          purchaseInvoiceItemId: item.purchaseInvoiceItemId,
          itemId: item.itemId,
          itemName: item.itemName,
          qtyReturn: item.quantity,
          qtyInvoice: item.quantityRemaining,
          unitConverterInvoice: item.unit,
          unitConverterReturn: item.unit,
          converter: item.converter,
          allocationId: item.allocationId,
          price: item.price,
          discountPercent: item.discountPercent,
          disc: item.discountValue,
          expiryDate: item.expiryDate,
          productionNumber: item.productionNumber,
          total: item.quantity * (item.price - item.discountValue)
        }
      })
      const requestPayload = {
        purchaseInvoiceId: this.form.purchaseInvoiceId,
        warehouseId: this.form.warehouseId,
        items,
        approver: this.form.requestApprovalTo,
        approverName: this.form.approverName,
        approverEmail: this.form.approverEmail,
        subTotal: this.sub_total,
        taxbase: this.tax_base,
        total: this.amount,
        supplierId: this.form.supplierId,
        supplierName: this.form.supplierName,
        tax: this.tax_amount,
        notes: this.form.notes
      }

      this.create(requestPayload)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/purchase/return/' + response.data.purchaseReturn.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
