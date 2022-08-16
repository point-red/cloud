<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/invoice"
        class="breadcrumb-item"
      >
        {{ $t('sales invoice') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('sales invoice') | uppercase }}</h4>
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
                      {{ $t('reference') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.selectReference.open()"
                      >
                        <template v-if="reference && referenceForm.number != null">
                          {{ referenceForm.number }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
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
                    {{ $t('to') | uppercase }}: <span>{{ form.customerName | uppercase }}</span>
                  </h6>
                  {{ form.customerAddress | uppercase }} <br v-if="form.customerAddress">
                  {{ form.customerPhone }} <br v-if="form.customerPhone">
                </div>
              </div>
            </div>
            <hr>
            <point-table v-if="form.referenceId">
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Allocation</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    {{ row.itemLabel || $t('select') | uppercase }}
                  </td>
                  <td>
                    <p-quantity-custom
                      :id="'quantity' + index"
                      v-model="row.quantity"
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
                    <p-form-number
                      :id="'price' + index"
                      v-model.number="row.price"
                      :name="'price' + index"
                      :readonly="false"
                    />
                  </td>
                  <td>
                    <p-discount
                      :id="'discount' + index"
                      :name="'discount' + index"
                      :readonly="row.itemId == null"
                      :base-value="row.price"
                      :discount-percent.sync="row.discountPercent"
                      :discount-value.sync="row.discountValue"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'total-' + index"
                      :name="'total-' + index"
                      :readonly="true"
                      :value="row.quantity * (row.price - row.discountValue)"
                    />
                  </td>
                  <td>
                    <span
                      :class="{'select-link': referenceType !== 'salesDeliveryNote'}"
                      @click="referenceType !== 'salesDeliveryNote' && $refs.allocation.open(index)"
                    >{{ row.allocationName || (referenceType === 'salesDeliveryNote' ? '' : 'SELECT') }}</span><br>
                  </td>
                </tr>
              </template>
            </point-table>

            <div
              v-if="form.referenceId"
              class="row"
            >
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="14"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>
              <div class="col-sm-6">
                <p-form-row
                  id="discount"
                  name="discount"
                  :label="$t('discount')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-discount
                      id="discount"
                      v-model="form.discountPercent"
                      name="discount"
                      :base-value="subtotal"
                      :discount-percent.sync="form.discountPercent"
                      :discount-value.sync="form.discountValue"
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
                  name="tax"
                  :label="$t('tax')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-form-check-box
                      class="mb-0"
                      style="float:left"
                      name="tax"
                      :checked="form.typeOfTax == 'include'"
                      :description="$t('include tax')"
                      @click.native="chooseTax('include')"
                    />
                    <p-form-check-box
                      name="tax"
                      :checked="form.typeOfTax == 'exclude'"
                      :description="$t('exclude tax')"
                      @click.native="chooseTax('exclude')"
                    />
                    <p-form-number
                      :id="'total'"
                      :name="'total'"
                      :readonly="true"
                      :value="tax"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="total"
                  name="total"
                  :label="$t('total')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'total'"
                      :name="'total'"
                      :readonly="true"
                      :value="total"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr v-if="form.referenceId">
            <div
              v-if="form.referenceId"
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
    <m-user
      ref="approver"
      permission="approve sales invoice"
      @choosen="chooseApprover"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <select-reference
      ref="selectReference"
      @choosen="chooseReference"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectReference from './SelectReference'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    PointTable,
    SelectReference
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      referenceForm: null,
      reference: null,
      referenceType: null,
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        customerId: null,
        customerName: null,
        customerLabel: null,
        customerAddress: null,
        customerPhone: null,
        customerEmail: null,
        notes: null,
        discountPercent: 0,
        discountValue: 0,
        tax_base: 0,
        tax: 0,
        typeOfTax: 'exclude',
        items: [],
        requestApprovalTo: null,
        approverName: null,
        approverEmail: null,
        referenceId: null
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    subtotal () {
      return this.form.items.reduce((carry, item) => {
        return carry + item.quantity * (item.price - item.discountValue)
      }, 0)
    },
    tax_base () {
      return this.subtotal - this.form.discountValue
    },
    tax () {
      let value = 0
      if (this.form.typeOfTax == 'include') {
        value = this.tax_base - (this.tax_base * 10 / 11)
      } else if (this.form.typeOfTax == 'exclude') {
        value = this.tax_base / 10
      }
      return value
    },
    total () {
      if (this.form.typeOfTax == 'include') {
        return this.subtotal - this.form.discountValue
      } else {
        return this.subtotal - this.form.discountValue + this.tax
      }
    }
  },
  methods: {
    ...mapActions('salesInvoice', ['create']),
    chooseApprover (value) {
      this.form.requestApprovalTo = value.id
      this.form.approverName = value.fullName
      this.form.approverEmail = value.email
    },
    chooseTax (taxType) {
      if (taxType == this.form.typeOfTax) {
        this.form.typeOfTax = null
      } else {
        this.form.typeOfTax = taxType
      }
    },
    chooseReference (referenceForm) {
      if (referenceForm.number.startsWith('DN')) { this.referenceType = 'salesDeliveryNote' }
      if (referenceForm.number.startsWith('SV')) { this.referenceType = 'salesVisitation' }

      const reference = referenceForm[this.referenceType]

      if (this.referenceType === 'salesDeliveryNote') {
        this.form.typeOfTax = reference.deliveryOrder.salesOrder.typeOfTax
      }

      this.referenceForm = referenceForm
      this.reference = reference
      this.form.referenceId = reference.id
      this.form.customerId = reference.customer.id
      this.form.customerName = reference.customer.name
      this.form.customerLabel = reference.customer.label
      this.form.discountPercent = reference.deliveryOrder.salesOrder.discountPercent
      this.form.discountValue = reference.deliveryOrder.salesOrder.discountValue

      this.form.items = reference.items.map(referenceItem => {
        return {
          referenceItemId: referenceItem.id,
          itemId: referenceItem.itemId,
          itemName: referenceItem.item.name,
          itemLabel: referenceItem.item.name,
          more: false,
          unit: referenceItem.unit,
          converter: referenceItem.converter,
          quantity: referenceItem.quantity,
          price: referenceItem.price,
          discountPercent: referenceItem.deliveryOrderItem.salesOrderItem.discountPercent,
          discountValue: referenceItem.deliveryOrderItem.salesOrderItem.discountValue,
          total: referenceItem.quantity * (referenceItem.price - referenceItem.deliveryOrderItem.salesOrderItem.discountValue),
          notes: referenceItem.notes,
          allocationId: referenceItem.allocation && referenceItem.allocation.id,
          allocationName: referenceItem.allocation && referenceItem.allocation.name,
          expiryDate: referenceItem.expiryDate,
          productionNumber: referenceItem.productionNumber
        }
      })
    },
    chooseAllocation (allocation) {
      const row = this.form.items[allocation.index]
      row.allocationId = allocation.id
      row.allocationName = allocation.name
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
          itemId: item.itemId,
          referenceItemId: item.referenceItemId,
          quantity: item.quantity,
          itemUnit: item.unit,
          converter: item.converter,
          allocationId: item.allocationId,
          price: item.price,
          discountPercent: item.discountPercent,
          discountValue: item.discountValue,
          expiryDate: item.expiryDate,
          productionNumber: item.productionNumber
        }
      })
      const requestPayload = {
        formId: this.referenceForm.id,
        items,
        requestApprovalTo: this.form.requestApprovalTo,
        dueDate: this.form.date,
        discountPercent: this.form.discountPercent,
        discountValue: this.form.discountValue,
        customerId: this.form.customerId,
        typeOfTax: this.form.typeOfTax || 'non',
        notes: this.form.notes
      }

      this.create(requestPayload)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/sales/invoice/' + response.data.salesInvoice.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>

<style>

</style>
