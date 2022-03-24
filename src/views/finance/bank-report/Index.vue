<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item active">{{ $t('bank report') | uppercase }}</span>
    </breadcrumb>
    <div class="row">
      <p-block :title="$t('bank report')">
        <div class="row">
          <div class="col-6">
            <p-form-row
              id="date-from"
              name="date-from"
              :label="$t('date from')"
              :is-horizontal="true"
            >
              <div slot="body">
                <p-date-picker
                  id="date"
                  v-model="date.from"
                  name="date"
                  label="date"
                  @input="search()"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="date-to"
              name="date-to"
              :label="$t('date to')"
              :is-horizontal="true"
            >
              <div slot="body">
                <p-date-picker
                  id="date"
                  v-model="date.to"
                  name="date"
                  label="date"
                  @input="search()"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="bank-account"
              name="bank-account"
              :label="$t('bank account')"
              :is-horizontal="true"
            >
              <div
                slot="body"
                class="pt-2"
              >
                <span
                  class="select-link"
                  @click="$refs.chartOfAccountRef.open()"
                >
                  {{ account_name || $t('select') | uppercase }}
                </span>
              </div>
            </p-form-row>
            <p-form-row
              id="journal-account"
              name="journal-account"
              :label="$t('journal account')"
              :is-horizontal="true"
            >
              <div
                slot="body"
                class="pt-2"
              >
                <span
                  class="select-link"
                  @click="$refs.chartOfJournalRef.open()"
                >
                  {{ journal_account_name || $t('select') | uppercase }}
                </span>
              </div>
            </p-form-row>
            <p-form-row
              id="subledger"
              name="subledger"
              :label="$t('subledger')"
              :is-horizontal="true"
            >
              <div
                slot="body"
                class="pt-2"
              >
                <span
                  class="select-link"
                  @click="$refs.paymentable.open()"
                >
                  {{ subledger_name || $t('select') | uppercase }}
                </span>
              </div>
            </p-form-row>
          </div>
          <div class="col-6 text-right">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-outline-secondary mr-5"
                title="Print cash advance"
                @click="$refs.printForm.open()"
              >
                <i class="si si-printer logo-print" />
              </button>
              <div class="d-flex flex-column">
                <download-excel
                  :name="`Bank Reports_${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`"
                  :fetch="generateReport"
                  :header="[
                    `Period: ${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`,
                    `Date Export: ${$options.filters.dateFormat(new Date(), 'DD MMM YYYY HH:mm')} `,
                    ' ',
                    'Bank Report',
                    `Periode : ${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`
                  ]"
                  class="btn btn-outline-secondary mr-5"
                >
                  {{ $t('export excel') | uppercase }}
                </download-excel>
                <button
                  type="button"
                  class="btn btn-outline-secondary mr-5 mt-2"
                  title="Export pdf"
                  @click="$refs.printForm.open()"
                >
                  {{ $t('export pdf') | uppercase }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="input-group block">
          <p-form-input
            id="search-text"
            ref="searchText"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
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
              <th class="text-center" />
            </tr>
            <template v-for="(report, index) in reports">
              <tr
                :key="'bank-reports-' + index"
                slot="p-body"
              >
                <td class="text-center">
                  {{ ++index }}
                </td>
                <td class="text-center">
                  {{ report.date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td class="text-center">
                  <router-link
                    v-if="report.type=='in'"
                    :to="{ name: 'finance.bank.in.show', params: { id: report.id }}"
                  >
                    {{ report.form_number }}
                  </router-link>
                  <router-link
                    v-if="report.type=='out'"
                    :to="{ name: 'finance.bank.out.show', params: { id: report.id }}"
                  >
                    {{ report.form_number }}
                  </router-link>
                  <router-link
                    v-if="report.type=='cut-off'"
                    :to="{ name: 'accounting.cut.off.show', params: { id: report.id } }"
                  >
                    {{ report.form_number }}
                  </router-link>
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
                {{ $t('bank') | uppercase }}
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
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <Coa
      ref="chartOfAccountRef"
      type="bank"
      @choosen="onChoosenAccount"
    />
    <Coa
      ref="chartOfJournalRef"
      nottype="bank"
      @choosen="onChoosenJournal"
    />
    <m-paymentable
      id="paymentable"
      ref="paymentable"
      @choosen="onChoosenSubledger"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import JsonExcel from 'vue-json-excel'
import Coa from './Coa'
import axios from '@/axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbFinance,
    PointTable,
    Coa,
    DownloadExcel: JsonExcel
  },
  data () {
    return {
      isLoading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      date: {
        from: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        to: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: null
      },
      account_id: null,
      account_name: null,
      journal_account_id: null,
      journal_account_name: null,
      subledger_id: null,
      subledger_name: null,
      subledger_type: null
    }
  },
  computed: {
    ...mapGetters('financeReport', ['reports', 'total', 'opening_balance', 'ending_balance', 'cash_advance', 'pagination']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('financeReport', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.search()
    }, 300),
    onChoosenAccount (account) {
      this.account_id = account.id
      this.account_name = account.label
      this.search()
    },
    onChoosenJournal (account) {
      this.journal_account_id = account.id
      this.journal_account_name = account.label
      this.search()
    },
    onChoosenSubledger (value) {
      this.subledger_id = value.id
      this.subledger_name = value.label
      this.subledger_type = value.type
      this.search()
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    },
    search () {
      if (this.date.from !== null && this.date.to !== null) {
        this.isLoading = true
        this.get({
          params: {
            search: this.searchText,
            filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
            filter_date_min: {
              'form.date': this.serverDateTime(this.$moment(this.date.from).format('YYYY-MM-DD 00:00:00'))
            },
            filter_date_max: {
              'form.date': this.serverDateTime(this.$moment(this.date.to).format('YYYY-MM-DD 23:59:59'))
            },
            report_type: 'bank',
            account_id: this.account_id,
            journal_account_id: this.journal_account_id,
            subledger_id: this.subledger_id,
            subledger_type: this.subledger_type,
            limit: this.limit,
            page: this.currentPage
          }
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      } else {
        this.$notification.error('Please set date to proceed filter')
      }
    },
    async generateReport () {
      this.isLoading = true
      try {
        const reports = await axios.get('/finance/reports', {
          params: {
            search: this.searchText,
            filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
            filter_date_min: {
              'form.date': this.serverDateTime(this.$moment(this.date.from).format('YYYY-MM-DD 00:00:00'))
            },
            filter_date_max: {
              'form.date': this.serverDateTime(this.$moment(this.date.to).format('YYYY-MM-DD 23:59:59'))
            },
            report_type: 'bank',
            account_id: this.account_id,
            journal_account_id: this.journal_account_id,
            subledger_id: this.subledger_id,
            subledger_type: this.subledger_type,
            limit: this.limit
          }
        })

        let indexItem = 0
        const dataResult = reports.data.data.data.map((data) => {
          indexItem++

          const res = {
            No: indexItem,
            Date: this.$options.filters.dateFormat(data.date, 'DD MMMM YYYY'),
            'Form Number': data.form_number,
            Subledger: data.subledger,
            'Account Number': data.account_number,
            Account: data.account_alias,
            Notes: data.notes,
            Debit: data.debit,
            Credit: data.credit
          }
          if (data.balance > 0) {
            res['Balance Debit'] = data.balance
            res['Balance Credit'] = 0
          } else if (data.balance < 0) {
            res['Balance Debit'] = 0
            res['Balance Credit'] = Math.abs(data.balance)
          } else {
            res['Balance Debit'] = 0
            res['Balance Credit'] = 0
          }
          return res
        })

        const total = {
          No: 'Total',
          Date: '',
          'Form Number': '',
          Subledger: '',
          'Account Number': '',
          Account: '',
          Notes: '',
          Debit: reports.data.total.debit,
          Credit: reports.data.total.credit
        }
        if (reports.data.total.debit - reports.data.total.credit > 0) {
          total['Balance Debit'] = reports.data.total.debit - reports.data.total.credit
          total['Balance Credit'] = 0
        } else if (reports.data.total.debit - reports.data.total.credit < 0) {
          total['Balance Debit'] = 0
          total['Balance Credit'] = Math.abs(reports.data.total.debit - reports.data.total.credit)
        } else {
          total['Balance Debit'] = 0
          total['Balance Credit'] = 0
        }
        dataResult.push(total)

        const openingBalance = {
          No: 'Opening Balance',
          Date: '',
          'Form Number': '',
          Subledger: '',
          'Account Number': '',
          Account: '',
          Notes: '',
          Debit: reports.data.opening_balance.debit,
          Credit: reports.data.opening_balance.credit
        }
        if (reports.data.ending_balance > 0) {
          openingBalance['Balance Debit'] = reports.data.ending_balance
          openingBalance['Balance Credit'] = 0
        } else if (reports.data.ending_balance < 0) {
          openingBalance['Balance Debit'] = 0
          openingBalance['Balance Credit'] = Math.abs(reports.data.ending_balance)
        } else {
          openingBalance['Balance Debit'] = 0
          openingBalance['Balance Credit'] = 0
        }
        dataResult.push(openingBalance)

        const endingBalance = {
          No: 'Ending Balance',
          Date: '',
          'Form Number': '',
          Subledger: '',
          'Account Number': '',
          Account: '',
          Notes: ''
        }
        if (reports.data.ending_balance > 0) {
          endingBalance.Debit = reports.data.ending_balance
          endingBalance.Credit = 0
        } else if (reports.data.ending_balance < 0) {
          endingBalance.Debit = 0
          endingBalance.Credit = reports.data.ending_balance
        }
        if (reports.data.ending_balance > 0) {
          endingBalance['Balance Debit'] = reports.data.ending_balance
          endingBalance['Balance Credit'] = 0
        } else if (reports.data.ending_balance < 0) {
          endingBalance['Balance Debit'] = 0
          endingBalance['Balance Credit'] = Math.abs(reports.data.ending_balance)
        } else {
          endingBalance['Balance Debit'] = 0
          endingBalance['Balance Credit'] = 0
        }
        dataResult.push(endingBalance)

        const cashAdvance = {
          No: 'Cash Advance',
          Date: '',
          'Form Number': '',
          Subledger: '',
          'Account Number': '',
          Account: '',
          Notes: '',
          Debit: '',
          Credit: '',
          'Balance Debit': reports.data.cash_advance,
          'Balance Credit': 0
        }
        dataResult.push(cashAdvance)

        const bankInHand = {
          No: 'Bank',
          Date: '',
          'Form Number': '',
          Subledger: '',
          'Account Number': '',
          Account: '',
          Notes: '',
          Debit: '',
          Credit: ''
        }
        if (reports.data.ending_balance - reports.data.cash_advance > 0) {
          bankInHand['Balance Debit'] = reports.data.ending_balance - reports.data.cash_advance
          bankInHand['Balance Credit'] = 0
        } else if (reports.data.ending_balance - reports.data.cash_advance < 0) {
          bankInHand['Balance Debit'] = 0
          bankInHand['Balance Credit'] = Math.abs(reports.data.ending_balance - reports.data.cash_advance)
        } else {
          bankInHand['Balance Debit'] = 0
          bankInHand['Balance Credit'] = 0
        }
        dataResult.push(bankInHand)

        this.isLoading = false
        return dataResult.flat()
      } catch (error) {
        this.isLoading = false
        return this.$notification.error(error.message)
      }
    }
  }
}
</script>
<style scoped>
  .logo-print{
    font-size: xx-large;
  }
  .btn{
    height: auto;
  }
</style>
