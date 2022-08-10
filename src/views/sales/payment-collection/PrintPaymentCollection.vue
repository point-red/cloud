<template>
  <sweet-modal
    ref="print-sales-collection"
    :title="$t('print sales collection') | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <table
      id="print-sales-collection"
      class="print-sales-collection-container m-2 mb-4 mx-auto"
    >
      <thead>
        <tr>
          <td>
            <div
              class="d-flex justify-content-between"
              style="margin-bottom: 10px;"
            >
              <div style="width: 110px; height: 110px; align-self: center;">
                <img
                  :src="logoUrl"
                  alt="Logo"
                  style="width: 100px; height: 100px;"
                >
              </div>
              <div class="company-detail">
                <h1 style="margin-top: 0; margin-bottom: 5px;">
                  Payment Collection
                </h1>
                <h3
                  class="my-5px"
                  style="line-height: 22px"
                >
                  {{ tenantName }}
                </h3>
                <p
                  class="my-5px"
                  style="line-height: 15px;"
                >
                  {{ tenantAddress }}
                </p>
                <p class="my-5px">
                  {{ tenantPhone }}
                </p>
              </div>
            </div>
            <hr class="header-divider">
            <div
              class="d-flex justify-content-between"
              style="margin-top: 10px; margin-bottom: 10px"
            >
              <table
                class="header-detail"
                style="margin-right: 20px;"
              >
                <tr>
                  <td>Date</td>
                  <td>:</td>
                  <td>{{ paymentcollection.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td>Invoice number</td>
                  <td>:</td>
                  <td>{{ paymentcollection.form.number }}</td>
                </tr>
              </table>
              <table
                class="header-detail"
                style="margin-left: 20px;"
              >
                <tr>
                  <td>Customer</td>
                  <td>:</td>
                  <td>{{ paymentcollection.customer.name || '-' }}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>:</td>
                  <td>{{ paymentcollection.customer.address || '-' }}</td>
                </tr>
                <tr>
                  <td>Phone number</td>
                  <td>:</td>
                  <td>{{ paymentcollection.customer.phone || '-' }}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-if="details.salesInvoice.length > 0">
          <td>
            <h3>Invoice Collection</h3>
            <table
              class="table-items"
              style="width: 100%;"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Form Number</th>
                  <th>Notes</th>
                  <th>Available Invoice</th>
                  <th>Amount Collection</th>
                </tr>
              </thead>
              <tr
                v-for="(row, index) in details.salesInvoice"
                :key="index"
              >
                <td>
                  {{ row.referenceable_form_date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td>
                  {{ row.referenceable_form_number }}
                </td>
                <td>
                  {{ row.referenceable_form_notes }}
                </td>
                <td class="text-right">
                  {{ row.available | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.amount | numberFormat }}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr v-if="details.salesDownPayment.length > 0">
          <td>
            <h3>Down Payment Collection</h3>
            <table
              class="table-items"
              style="width: 100%;"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Form Number</th>
                  <th>Notes</th>
                  <th>Available Invoice</th>
                  <th>Amount Collection</th>
                </tr>
              </thead>
              <tr
                v-for="(row, index) in details.salesDownPayment"
                :key="index"
              >
                <td>
                  {{ row.referenceable_form_date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td>
                  {{ row.referenceable_form_number }}
                </td>
                <td>
                  {{ row.referenceable_form_notes }}
                </td>
                <td class="text-right">
                  {{ row.available | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.amount | numberFormat }}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr v-if="details.salesReturn.length > 0">
          <td>
            <h3>Sales Return Collection</h3>
            <table
              class="table-items"
              style="width: 100%;"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Form Number</th>
                  <th>Notes</th>
                  <th>Available Invoice</th>
                  <th>Amount Collection</th>
                </tr>
              </thead>
              <tr
                v-for="(row, index) in details.salesReturn"
                :key="index"
              >
                <td>
                  {{ row.referenceable_form_date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td>
                  {{ row.referenceable_form_number }}
                </td>
                <td>
                  {{ row.referenceable_form_notes }}
                </td>
                <td class="text-right">
                  {{ row.available | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.amount | numberFormat }}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr v-if="details.other.length > 0">
          <td>
            <h3>Other Collection</h3>
            <table
              class="table-items"
              style="width: 100%;"
            >
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Notes</th>
                  <th>Amount Collection</th>
                  <th>Allocation</th>
                </tr>
              </thead>
              <tr
                v-for="(row, index) in details.other"
                :key="index"
              >
                <td>
                  {{ row.chart_of_account.label }}
                </td>
                <td>
                  {{ row.notes }}
                </td>
                <td class="text-right">
                  {{ row.amount | numberFormat }}
                </td>
                <td>
                  {{ row.allocation ? row.allocation.label : '' }}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <div
              class="d-flex justify-content-end"
            >
              <table
                class="table-items"
                style="width: 70%;"
              >
                <tr>
                  <td>Total Invoice</td>
                  <td class="text-right">
                    {{ totalinvoice | numberFormat }}
                  </td>
                </tr>
                <tr>
                  <td>Total Down Payment</td>
                  <td class="text-right">
                    {{ totaldownpayment | numberFormat }}
                  </td>
                </tr>
                <tr>
                  <td>Total Return</td>
                  <td class="text-right">
                    {{ totalreturn | numberFormat }}
                  </td>
                </tr>
                <tr>
                  <td>Total Other</td>
                  <td class="text-right">
                    {{ totalother | numberFormat }}
                  </td>
                </tr>
                <tr>
                  <td>Total Amount</td>
                  <td class="text-right">
                    {{ paymentcollection.amount | numberFormat }}
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>Notes: {{ notes }}</span>
            <div
              class="d-flex justify-content-end"
              style="margin-top: 75px;"
            >
              <div
                class="text-center"
                style="margin-right: 75px;"
              >
                <h3>Created by</h3>
                <br><br><br>
                {{ paymentcollection.form.created_by.full_name }}
              </div>
              <div class="text-center">
                <h3>Approved by</h3>
                <br><br><br>
                {{ paymentcollection.form.request_approval_to.full_name }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot />
    </table>
    <div class="pull-right">
      <button
        v-print="'print-sales-collection'"
        type="button"
        class="btn btn-sm btn-outline-secondary mt-3"
      >
        {{ $t('print') | uppercase }}
      </button>
    </div>
  </sweet-modal>
</template>

<script>
import axiosNode from '@/axiosNode'
import print from 'vue-print-nb'
export default {
  directives: {
    print
  },
  props: {
    paymentcollection: {
      type: Object,
      required: true
    },
    details: {
      type: Object,
      required: true
    },
    totalinvoice: {
      type: Number,
      required: true
    },
    totaldownpayment: {
      type: Number,
      required: true
    },
    totalreturn: {
      type: Number,
      required: true
    },
    totalother: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      onLoad: true,
      logoUrl: '',
      notes: ''
    }
  },
  computed: {
    tenantName () {
      return localStorage.getItem('tenantName')
    },
    tenantAddress () {
      let tenantAddress = localStorage.getItem('tenantAddress')
      if (!tenantAddress || tenantAddress === 'null') {
        tenantAddress = '-'
      }

      return tenantAddress
    },
    tenantPhone () {
      let tenantPhone = localStorage.getItem('tenantPhone')
      if (!tenantPhone || tenantPhone === 'null') {
        tenantPhone = '-'
      }

      return tenantPhone
    }
  },
  async created () {
    this.onLoad = true
    await Promise.all([
      this.getSettingLogo(),
      this.getSettingEndNote()
    ])
    this.onLoad = false
  },
  methods: {
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', '')
      this.close()
    },
    open () {
      this.$refs['print-sales-collection'].open()
    },
    close () {
      this.$refs['select-' + this.id].close()
    },
    onClose () {
      this.$emit('close', true)
    },
    async getSettingLogo () {
      try {
        const { data: { data: currentLogo } } = await axiosNode.get('/setting/logo')
        this.logoUrl = currentLogo.publicUrl
      } catch (e) {
        console.log(e)
      }
    },
    async getSettingEndNote () {
      try {
        const { data: { data: endNote } } = await axiosNode.get('/setting/end-note')
        this.notes = endNote.salesInvoice
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.print-sales-invoice-container {
  width: 90%;
  padding: 30px;
}
.d-flex {
  display: flex;
}
.d-flex-row {
  display: flex;
  flex-direction: column;
}
.btn-action {
  padding: 10px;
  text-decoration: none;
  border-radius: 5px;
  margin: 5px 10px;
  width: 75px;
  text-align: center;
  color: white;
  background-color: rgb(100, 100, 100);
}
.btn-action:hover {
  filter: brightness(75%);
}
.btn-secondary {
  background-color: rgb(100, 100, 100);
}
.text-right {
  text-align: right;
}
.table-items {
  border: solid 1px black;
  margin-top: 10px;
  margin-bottom: 10px;
}
table.table-items, .table-items th, .table-items td {
  border: 1px solid black;
  border-collapse: collapse;
}
.table-items th, .table-items td {
  padding: 5px;
}
.btn-success {
  background-color: rgb(39, 168, 39);
}
.btn-danger {
  background-color: rgb(250, 68, 68);
}
.action-container {
  margin-top: 10px;
  padding: 5px;
}
.justify-content-between {
  justify-content: space-between;
}
.my-5px {
  margin: 5px 0 5px 0;
}
.company-detail {
  min-width: 200px;
  max-width: 250px;
}
.header-divider {
  height:10px;
  border:none;
  color:gray;
  background-color:gray;
}
@media print {
  table.header-detail tr td {
    line-height: 0.5px;
  }
  #print-sales-invoice thead tr td {
    padding-top: 20px;
  }
}
</style>
