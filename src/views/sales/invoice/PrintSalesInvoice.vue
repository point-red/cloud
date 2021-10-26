<template>
  <sweet-modal
    ref="print-sales-invoice"
    :title="$t('print sales invoice') | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <div
      id="print-sales-invoice"
      class="print-sales-invoice-container border m-2 mb-4"
    >
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
            Invoice
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
      <div style="width: 100%; height: 20px; margin-top: 10px; margin-bottom: 10px; background-color: gray;" />
      <div
        class="d-flex justify-content-between"
        style="margin-top: 10px;"
      >
        <table style="margin-right: 5px;">
          <tr>
            <td>Date</td>
            <td>:</td>
            <td>{{ invoice.date | dateFormat('DD MMMM YYYY') }}</td>
          </tr>
          <tr>
            <td>Invoice number</td>
            <td>:</td>
            <td>{{ invoice.form.number }}</td>
          </tr>
        </table>
        <table style="margin-left: 5px;">
          <tr>
            <td>Customer</td>
            <td>:</td>
            <td>{{ invoice.customer.name || '-' }}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>:</td>
            <td>{{ invoice.customer.address || '-' }}</td>
          </tr>
          <tr>
            <td>Phone number</td>
            <td>:</td>
            <td>{{ invoice.customer.phone || '-' }}</td>
          </tr>
        </table>
      </div>
      <table
        class="table-items"
        style="width: 100%;"
      >
        <tr>
          <th>No</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Total</th>
        </tr>
        <tr
          v-for="(row, index) in invoice.items"
          :key="index"
        >
          <td>{{ index+1 }}</td>
          <td>{{ row.itemName }}</td>
          <td class="text-right">
            {{ row.quantity | numberFormat }} {{ row.unit }}
          </td>
          <td class="text-right">
            {{ row.price | numberFormat }}
          </td>
          <td class="text-right">
            {{ row.discountValue | numberFormat }}
          </td>
          <td class="text-right">
            {{ row.quantity * (row.price - row.discountValue) | numberFormat }}
          </td>
        </tr>
        <tr>
          <td
            colspan="5"
            class="text-right"
          >
            Sub total
          </td>
          <td>{{ invoice.subtotal | numberFormat }}</td>
        </tr>
        <tr>
          <td
            colspan="5"
            class="text-right"
          >
            Discount
          </td>
          <td>{{ invoice.discountValue | numberFormat }}</td>
        </tr>
        <tr>
          <td
            colspan="5"
            class="text-right"
          >
            Tax base
          </td>
          <td>{{ invoice.amount - invoice.tax | numberFormat }}</td>
        </tr>
        <tr>
          <td
            colspan="5"
            class="text-right"
          >
            Tax
          </td>
          <td>{{ invoice.tax | numberFormat }}</td>
        </tr>
        <tr>
          <td
            colspan="5"
            class="text-right"
          >
            Total
          </td>
          <td>{{ invoice.amount | numberFormat }}</td>
        </tr>
      </table>
      <span>Notes: {{ notes }}</span>
    </div>
    <div class="pull-right">
      <button
        v-print="'print-sales-invoice'"
        type="button"
        class="btn btn-sm btn-outline-secondary"
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
    invoice: {
      type: Object,
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
      this.$refs['print-sales-invoice'].open()
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
  width: 700px;
  padding: 30px;
  margin: auto;
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
</style>