<template>
  <sweet-modal
    ref="print-stock-correction"
    :title="$t('print stock correction') | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <table
      id="print-stock-correction"
      class="print-stock-correction-container m-2 mb-4 mx-auto"
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
                  Stock Correction
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
                  <td>{{ stockCorrection.form.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td>Form number</td>
                  <td>:</td>
                  <td>{{ stockCorrection.form.number }}</td>
                </tr>
              </table>
              <table
                class="header-detail"
                style="margin-left: 20px;"
              >
                <tr>
                  <td>Warehouse</td>
                  <td>:</td>
                  <td>{{ stockCorrection.warehouse.name || '-' }}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>:</td>
                  <td>{{ stockCorrection.warehouse.adress || '-' }}</td>
                </tr>
                <tr>
                  <td>Phone number</td>
                  <td>:</td>
                  <td>{{ stockCorrection.warehouse.phone || '-' }}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <table
              class="table-items"
              style="width: 100%;"
            >
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Stock Database</th>
                  <th>Stock Correction</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tr
                v-for="(row, index) in stockCorrection.items"
                :key="index"
              >
                <td>{{ row.item.name }}</td>
                <td class="text-right">
                  {{ row.initialStock | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-left">
                  {{ row.finalStock | numberFormat }} {{ row.unit }}
                </td>
              </tr>
            </table>
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
                {{ stockCorrection.form.createdByUser.fullName }}
              </div>
              <div class="text-center">
                <h3>Approved by</h3>
                <br><br><br>
                {{ stockCorrection.form.requestApprovalToUser.fullName }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot />
    </table>
    <div class="pull-right">
      <button
        v-print="'print-stock-correction'"
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
    stockCorrection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      onLoad: true,
      logoUrl: ''
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
      this.$refs['print-stock-correction'].open()
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
    }
  }
}
</script>

<style scoped>
.print-stock-correction-container {
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
  #print-stock-correction thead tr td {
    padding-top: 20px;
  }
}
</style>
