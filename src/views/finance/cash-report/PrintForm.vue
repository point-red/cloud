<template>
  <sweet-modal
    ref="print-form"
    :width="'80vw'"
    :title="$t('print cash report') | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <table
      id="print-form"
      class="print-form-container m-2 mb-4 mx-auto"
    >
      <thead v-if="isPrintPDF">
        <tr>
          <td>
            <div
              class="d-flex justify-content-center"
              style="margin-bottom: 10px;"
            >
              <div class="text-center">
                <h1 style="margin-top: 0; margin-bottom: 15px; line-height: 28px">
                  Cash Report
                </h1>
                <h3
                  class="my-5px font-weight-bold"
                  style="line-height: 20px;"
                >
                  {{ $parent.date.from | dateFormat('DD MMMM YYYY') }} - {{ $parent.date.to | dateFormat('DD MMMM YYYY') }}
                </h3>
                <h3
                  class="my-5px font-weight-bold"
                  style="line-height: 20px;"
                >
                  Date Export : {{ $options.filters.dateFormat(new Date(), 'DD MMM YYYY HH:mm') }}
                </h3>
              </div>
            </div>
          </td>
        </tr>
      </thead>
      <thead v-if="!isPrintPDF">
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
                  Cash Report
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
                  <td>Period</td>
                  <td>:</td>
                  <td>{{ $parent.date.from | dateFormat('DD MMMM YYYY') }} - {{ $parent.date.to | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td>Cash Account</td>
                  <td>:</td>
                  <td>{{ $parent.account_name!=null ? $parent.account_name : 'All' }}</td>
                </tr>
                <tr>
                  <td>Account Lawan</td>
                  <td>:</td>
                  <td>{{ $parent.journal_account_name!=null ? $parent.journal_account_name : 'All' }}</td>
                </tr>
                <tr>
                  <td>Subledger</td>
                  <td>:</td>
                  <td>{{ $parent.subledger_name!=null ? $parent.subledger_name : 'All' }}</td>
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
                  <th class="text-center">
                    No
                  </th>
                  <th class="text-center">
                    Date
                  </th>
                  <th class="text-center">
                    Form Number
                  </th>
                  <th class="text-center">
                    Subledger
                  </th>
                  <th class="text-center">
                    Account
                  </th>
                  <th class="text-center">
                    Notes
                  </th>
                  <th class="text-center">
                    Debit
                  </th>
                  <th class="text-center">
                    Credit
                  </th>
                  <th class="text-center">
                    Balance Debit
                  </th>
                  <th class="text-center">
                    Balance Credit
                  </th>
                </tr>
              </thead>
              <tbody v-if="!isLoading">
                <template v-for="(report, index) in reports">
                  <tr
                    :key="'cash-reports-' + index"
                    slot="p-body"
                  >
                    <td class="text-center">
                      {{ ++index }}
                    </td>
                    <td class="text-center">
                      {{ report.date | dateFormat('DD MMMM YYYY') }}
                    </td>
                    <td class="text-center">
                      {{ report.form_number }}
                    </td>
                    <td class="text-center">
                      {{ report.subledger }}
                    </td>
                    <td class="text-center">
                      {{ report.account_number }} - {{ report.account_alias }}
                    </td>
                    <td class="text-center">
                      {{ report.notes }}
                    </td>
                    <td class="text-center">
                      {{ report.debit | numberFormat }}
                    </td>
                    <td class="text-center">
                      {{ report.credit | numberFormat }}
                    </td>
                    <td
                      v-if="report.balance > 0"
                      class="text-center"
                    >
                      {{ Math.abs(report.balance) | numberFormat }}
                    </td>
                    <td
                      v-else
                      class="text-center"
                    >
                      {{ 0 | numberFormat }}
                    </td>
                    <td
                      v-if="report.balance < 0"
                      class="text-center"
                    >
                      {{ Math.abs(report.balance) | numberFormat }}
                    </td>
                    <td
                      v-else
                      class="text-center"
                    >
                      {{ 0 | numberFormat }}
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <td class="text-left">
                    {{ $t('total') | uppercase }}
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-center">
                    {{ total.debit | numberFormat }}
                  </td>
                  <td class="text-center">
                    {{ total.credit | numberFormat }}
                  </td>
                  <td
                    v-if="(total.debit - total.credit) > 0"
                    class="text-center"
                  >
                    {{ Math.abs(total.debit - total.credit) | numberFormat }}
                  </td>
                  <td
                    v-else
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                  <td
                    v-if="(total.debit - total.credit) < 0"
                    class="text-center"
                  >
                    {{ Math.abs(total.debit - total.credit) | numberFormat }}
                  </td>
                  <td
                    v-else
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="text-left">
                    {{ $t('opening balance') | uppercase }}
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-center">
                    {{ opening_balance.debit | numberFormat }}
                  </td>
                  <td class="text-center">
                    {{ opening_balance.credit | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance > 0"
                    class="text-center"
                  >
                    {{ ending_balance | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance > 0 || ending_balance == 0"
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance < 0"
                    class="text-center"
                  >
                    {{ Math.abs(ending_balance) | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance < 0 || ending_balance == 0"
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="text-left">
                    {{ $t('ending balance') | uppercase }}
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td
                    v-if="ending_balance > 0"
                    class="text-center"
                  >
                    {{ ending_balance | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance > 0 || ending_balance == 0"
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance < 0"
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance < 0 || ending_balance == 0"
                    class="text-center"
                  >
                    {{ Math.abs(ending_balance) | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance > 0"
                    class="text-center"
                  >
                    {{ ending_balance | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance > 0 || ending_balance == 0"
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance < 0 || ending_balance == 0"
                    class="text-center"
                  >
                    {{ Math.abs(ending_balance) | numberFormat }}
                  </td>
                  <td
                    v-if="ending_balance < 0"
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="text-left">
                    {{ $t('cash advance') | uppercase }}
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-center">
                    {{ cash_advance | numberFormat }}
                  </td>
                  <td class="text-center">
                    {{ 0 | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td class="text-left">
                    {{ $t('cash in hand') | uppercase }}
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td
                    v-if="(ending_balance - cash_advance) > 0"
                    class="text-center"
                  >
                    {{ ending_balance - cash_advance | numberFormat }}
                  </td>
                  <td
                    v-else
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                  <td
                    v-if="(ending_balance - cash_advance) < 0"
                    class="text-center"
                  >
                    {{ Math.abs(ending_balance - cash_advance) | numberFormat }}
                  </td>
                  <td
                    v-else
                    class="text-center"
                  >
                    {{ 0 | numberFormat }}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <tfoot />
    </table>
    <div class="pull-right">
      <button
        ref="print"
        v-print="'print-form'"
        type="button"
        class="btn btn-sm btn-outline-secondary mt-3"
        @click="emitHistory()"
      >
        {{ $t('print') | uppercase }}
      </button>
    </div>
  </sweet-modal>
</template>

<script>
import axiosNode from '@/axiosNode'
import axios from '@/axios'
import print from 'vue-print-nb'
export default {
  directives: {
    print
  },
  props: {},
  data () {
    return {
      isLoading: true,
      isPrintPDF: false,
      logoUrl: '',
      notes: '',
      reports: [],
      total: [],
      opening_balance: [],
      ending_balance: null,
      cash_advance: null
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
    this.isLoading = true
    await Promise.all([
      this.getSettingLogo(),
      this.getSettingEndNote()
    ])
    this.getData()
  },
  methods: {
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', '')
      this.close()
    },
    open () {
      this.isPrintPDF = false
      this.$refs['print-form'].open()
    },
    close () {
      this.$refs['select-' + this.id].close()
    },
    onClose () {
      this.$emit('close', true)
    },
    emitHistory () {
      this.$emit('history', 'Printed')
    },
    printPDF () {
      this.isPrintPDF = true
      this.$refs.print.click()
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
    },
    async getData () {
      this.isLoading = true
      try {
        const reports = await axios.get('/finance/reports', {
          params: {
            search: this.$parent.searchText,
            filter_form: this.$parent.formStatus.value + ';' + this.$parent.formApprovalStatus.value,
            filter_date_min: {
              'form.date': this.serverDateTime(this.$moment(this.$parent.date.from).format('YYYY-MM-DD 00:00:00'))
            },
            filter_date_max: {
              'form.date': this.serverDateTime(this.$moment(this.$parent.date.to).format('YYYY-MM-DD 23:59:59'))
            },
            report_type: 'cash',
            account_id: this.$parent.account_id,
            journal_account_id: this.$parent.journal_account_id,
            subledger_id: this.$parent.subledger_id,
            subledger_type: this.$parent.subledger_type,
            limit: 1000
          }
        })
        this.reports = reports.data.data.data
        this.total = reports.data.total
        this.opening_balance = reports.data.opening_balance
        this.ending_balance = reports.data.ending_balance
        this.cash_advance = reports.data.cash_advance
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$notification.error(error.message)
      }
    }
  }
}
</script>

<style scoped>
.sweet-modal.is-visible {
    max-width: 800px;
}
.print-form-container {
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
  #print-form thead tr td {
    padding-top: 20px;
  }
}
</style>
