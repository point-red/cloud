<template>
  <div>
    <p-loading-block
      v-show="isSaving"
      message="please wait and do not close this page"
    />
    <breadcrumb>
      <router-link
        to="/account/billing"
        class="breadcrumb-item"
      >
        {{ $t('billing') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ invoice.number }}</span>
    </breadcrumb>

    <div class="mb-15">
      <button
        v-if="invoice.total > 0 && invoice.paidable_id == null"
        type="button"
        class="btn btn-primary mr-5"
        @click="pay()"
      >
        {{ $t('pay with credit card / virtual account') | uppercase }}
      </button>
      <button
        v-if="invoice.total > 0 && invoice.paidable_id == null"
        type="button"
        class="btn btn-primary mr-5"
        @click="$refs.payWithWalletRef.open(invoice)"
      >
        {{ $t('pay with wallet') | uppercase }}
      </button>
    </div>

    <div class="block">
      <div class="block-content">
        <div>
          <div
            v-if="invoice.total > 0 && invoice.paidable_id == null"
            style="float:right"
            class="badge badge-danger"
          >
            UNPAID
          </div>
          <div
            v-else
            style="float:right"
            class="badge badge-success"
          >
            PAID
          </div>
          <h5>INVOICE #{{ invoice.number }}</h5>
        </div>
        <hr>
        <div class="row my-20">
          <div class="col-6">
            <p class="h3">
              POINT
            </p>
            <address>
              Jl Musi no 21<br>
              Jawa Timur, Surabaya<br>
              billing@point.red<br>
            </address>
          </div>
          <div class="col-6 text-right">
            <p class="h3">
              {{ invoice.project_name | uppercase }}
            </p>
            <address>
              {{ invoice.project_address }}<br>
              {{ invoice.project_phone }}<br>
            </address>
          </div>
        </div>
        <div class="table-responsive push">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th
                  class="text-center"
                  style="width: 60px;"
                />
                <th>Product</th>
                <th
                  class="text-center"
                  style="width: 90px;"
                >
                  Qnt
                </th>
                <th
                  class="text-right"
                  style="width: 120px;"
                >
                  Price
                </th>
                <th
                  class="text-right"
                  style="width: 120px;"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in invoice.items"
                :key="index"
              >
                <td class="text-center">
                  {{ index + 1 }}
                </td>
                <td>
                  {{ item.description | uppercase }}
                </td>
                <td class="text-center">
                  {{ item.quantity | numberFormat }}
                </td>
                <td class="text-right">
                  {{ item.amount | numberFormat }}
                </td>
                <td class="text-right">
                  <template v-if="item.description.substring(0, 3) == 'ERP'">
                    {{ item.amount | numberFormat }}
                  </template>
                  <template v-else>
                    {{ item.amount * item.quantity | numberFormat }}
                  </template>
                </td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  class="font-w600 text-right"
                >
                  SUBTOTAL
                </td>
                <td class="text-right">
                  {{ invoice.sub_total | numberFormat }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  class="font-w600 text-right"
                >
                  PPN (10%)
                </td>
                <td class="text-right">
                  {{ invoice.vat | numberFormat }}
                </td>
              </tr>
              <tr class="table-warning">
                <td
                  colspan="4"
                  class="font-w700 text-uppercase text-right"
                >
                  Total Due
                </td>
                <td class="font-w700 text-right">
                  {{ invoice.total | numberFormat }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-muted text-center">
          Thank you very much for doing business with us. We look forward to working with you again!
        </p>
      </div>
    </div>
    <m-pay-with-wallet ref="payWithWalletRef" />
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import MPayWithWallet from './MPayWithWallet'
import Form from '@/utils/Form'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    MPayWithWallet
  },
  data () {
    return {
      id: this.$route.params.id,
      isSaving: false,
      getInvoiceInterval: null,
      form: new Form({
        amount: 0,
        invoice_id: this.id
      })
    }
  },
  computed: {
    ...mapGetters('accountInvoice', ['invoice'])
  },
  beforeDestroy () {
    clearInterval(this.getInvoiceInterval)
  },
  created () {
    this.find({
      id: this.id,
      params: {
        includes: 'items'
      }
    })

    this.getInvoiceInterval = window.setInterval(() => {
      this.find({
        id: this.id,
        params: {
          includes: 'items'
        }
      })
    }, 5000)
  },
  methods: {
    ...mapActions('accountInvoice', ['find']),
    ...mapActions('accountWalletTopUp', ['create']),
    pay () {
      this.isSaving = true
      this.form.invoice_id = this.invoice.id
      this.form.amount = this.invoice.total
      this.create(this.form).then(response => {
        this.isSaving = false
        window.open(response.data.invoice_url, '_blank')
        this.close()
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    }
  }
}
</script>
