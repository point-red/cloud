<template>
  <div>
    <form class="row" @submit.prevent="onSubmit">
      <p-modal
        ref="downPaymentModal"
        :id="id"
        :title="title">
        <template slot="content">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="date"
                name="date"
                label="Date"
                v-model="form.date"
                :errors="form.errors.get('date')"
                @errors="form.errors.set('date', null)"/>
            </div>
          </p-form-row>

          <p-form-row
            id="supplier"
            name="supplier"
            :label="$t('supplier')"
            :isFocus="true">
            <div slot="body" class="col-lg-9 mt-5">
              {{ purchaseOrder.supplier_name }}
            </div>
          </p-form-row>

          <p-form-row
            id="purchase-order"
            name="purchase-order"
            :label="$t('purchase order')"
            :isFocus="true">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-if="purchaseOrder.form">
                {{ purchaseOrder.form.number }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="amount"
            name="amount"
            :label="$t('amount')"
            :isFocus="true">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-if="purchaseOrder.form">
                {{ purchaseOrder.amount | numberFormat }}
              </template>
            </div>
          </p-form-row>

          <p-form-row
            id="down-payment"
            name="down-payment"
            :label="$t('down payment')"
            :isFocus="true">
            <div slot="body" class="col-lg-9 mt-5">
              <p-form-number
                id="down-payment"
                name="down-payment"
                v-model="form.amount"
                :disabled="isSaving"
                :label="$t('down payment')"
                :is-text-right="false"
                :errors="form.errors.get('amount')"
                @errors="form.errors.set('amount', null)"/>
            </div>
          </p-form-row>
          <p-form-row
            id="approver"
            name="approver"
            :label="$t('approver')">
            <div slot="body" class="col-lg-9 mt-5">
              <m-user
                :id="'user'"
                v-model="form.approver_id"
                @close="additionalModalClosed"
                :errors="form.errors.get('approver_id')"
                @errors="form.errors.set('approver_id', null)"/>
            </div>
          </p-form-row>
        </template>
        <template slot="footer">
          <button class="btn btn-primary">Add</button>
          <button type="button" @click="close" class="btn btn-outline-danger">Close</button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isSaving: false,
      purchaseOrder: {},
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        amount: 0,
        purchase_order_id: null
      })
    }
  },
  methods: {
    ...mapActions('purchaseDownPayment', ['create']),
    show (purchaseOrder) {
      this.purchaseOrder = purchaseOrder
      this.form.purchase_order_id = purchaseOrder.id
      this.form.supplier_id = purchaseOrder.supplier_id
      this.form.supplier_name = purchaseOrder.supplier_name
      this.form.amount = purchaseOrder.amount
      this.$refs.downPaymentModal.show()
    },
    close () {
      this.$refs.downPaymentModal.close()
    },
    additionalModalClosed () {
      document.body.classList.add('modal-open')
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.$notification.success('add down payment success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.isSaving = false
          this.$emit('close')
          this.close()
        }).catch(error => {
          this.$notification.error(error.message)
          this.isSaving = false
          this.close()
        })
    }
  }
}
</script>
