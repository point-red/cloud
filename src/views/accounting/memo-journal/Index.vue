<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('memo jurnal') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <download-excel
            class="input-group-prepend"
            @click="exportData(accountingMemoJournals)"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create memo journal')"
            to="/accounting/memo-journal/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
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
        <div class="input-group block">
          <div class="col-sm-2">
            <router-link
              v-if="$permission.has('create memo journal')"
              to="/accounting/memo-journal/approval"
              class="input-group-prepend"
            >
              <span class="input-group-text font-size-sm">
                {{ $t('request approval all') | uppercase }}
              </span>
            </router-link>
          </div>
          <div class="col-sm-10 text-center font-size-sm">
            <a
              href="javascript:void(0)"
              @click="isAdvanceFilter = !isAdvanceFilter"
            >
              {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
            </a>
          </div>
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card m-5 pt-10"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
          <div class="row">
            <div class="col-sm-3 text-center">
              <p-form-row
                id="date-start"
                name="date-start"
                :label="$t('date start')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <p-date-picker
                    id="date"
                    v-model="date.start"
                    name="date"
                    label="date"
                  />
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-3 text-center">
              <p-form-row
                id="date-end"
                name="date-end"
                :label="$t('date end')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <p-date-picker
                    id="date"
                    v-model="date.end"
                    name="date"
                    label="date"
                  />
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row
                id="form-approval-status"
                name="form-approval-status"
                :label="$t('approval status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.formApprovalStatus.open()"
                  >
                    {{ formApprovalStatus.label || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <!-- <div class="col-sm-3 text-center">
              <p-form-row
                id="form-status"
                name="form-status"
                :label="$t('form status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.formStatus.open()"
                  >
                    {{ formStatus.label || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div> -->
          </div>
          <hr>
        </div>
        <div class="mt-10">
          <span
            v-show="checkedRow.length > 0"
            class="mr-15 animated fadeIn"
          >
            <!-- <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkCancel()">
              {{ $t('request approval') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkApprove()">
              {{ $t('approve') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkReject()">
              {{ $t('reject') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="bulkCancel()">
              {{ $t('archive') | uppercase }}
            </button> -->
          </span>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Date Form</th>
              <th>Form Number</th>
              <th>Chart Of Account</th>
              <th>Notes</th>
              <th>Master</th>
              <th>Reference</th>
              <th>Debit</th>
              <th>Credit</th>
              <th class="text-center">
                Approval Status
              </th>
              <th>History</th>
            </tr>
            <template v-for="(accountingMemoJournal, index) in accountingMemoJournals">
              <tr
                v-for="(accountingMemoJournalItem, index2) in accountingMemoJournal.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <td>{{ accountingMemoJournal.form.create_date | dateFormat('DD MMMM YYYY') }}</td>
                <th>
                  <router-link :to="{ name: 'accounting.memo.journal.show', params: { id: accountingMemoJournal.id }}">
                    {{ accountingMemoJournal.form.number }}
                  </router-link>
                </th>
                <td>{{ accountingMemoJournalItem.chart_of_account_name }}</td>
                <td>{{ accountingMemoJournal.form.notes }}</td>
                <td>
                  <template v-if="accountingMemoJournalItem.masterable">
                    {{ accountingMemoJournalItem.masterable.name }}
                  </template>
                </td>
                <td>
                  <template v-if="accountingMemoJournalItem.form">
                    {{ accountingMemoJournalItem.form.number }}
                  </template>
                </td>
                <td class="text-center">
                  {{ accountingMemoJournalItem.debit | numberFormat }}
                </td>
                <td class="text-center">
                  {{ accountingMemoJournalItem.credit | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="accountingMemoJournal.form.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="accountingMemoJournal.form.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="accountingMemoJournal.form.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <!-- <td class="text-center">
                  <div
                    v-if="accountingMemoJournal.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="accountingMemoJournal.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="accountingMemoJournal.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td> -->
                <td class="text-center">
                  <router-link
                    class="btn btn-sm btn-light"
                    :to="{ name: 'accounting.memo.journal.histories', params: { id: accountingMemoJournal.id }}"
                  >
                    <i class="fa fa-history" />
                  </router-link>
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-form-approval-status
      ref="formApprovalStatus"
      @choosen="chooseFormApprovalStatus($event)"
    />
    <m-form-status
      ref="formStatus"
      @choosen="chooseFormStatus($event)"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      isAdvanceFilter: false,
      checkedRow: [],
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
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('accountingMemoJournal', ['accountingMemoJournals', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getAccountingMemoJournals()
      },
      deep: true
    }
  },
  created () {
    this.$router.push({
      query: {
        ...this.$route.query,
        date_from: this.date.start,
        date_to: this.date.end
      }
    })
    this.getAccountingMemoJournals()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('accountingMemoJournal', ['get', 'export']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.accountingMemoJournals, this.checkedRow)) {
        this.accountingMemoJournals.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.accountingMemoJournals.forEach(element => {
          this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    isRowChecked (id) {
      return this.checkedRow.some(element => {
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
    bulkApprove () {
      this.bulkApprove({
        accountingMemoJournals: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getAccountingMemoJournals()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.currentPage = ''
      this.getAccountingMemoJournals()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.currentPage = ''
      this.getAccountingMemoJournals()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getAccountingMemoJournals()
    }, 300),
    getAccountingMemoJournals () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,items',
          fields: 'memo_journal.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'memo_journal_item.chart_of_account_name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          },
          limit: 10,
          includes: 'form;items.chart_of_account;items.form;items.masterable',
          page: this.currentPage
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getAccountingMemoJournals()
    },
    exportData (value) {
      const ids = value.map((o) => o.id)
      this.export({
        data: {
          ids: ids,
          date_start: this.date.start,
          date_end: this.date.end,
          tenant_name: localStorage.getItem('tenantName')
        }
      }).then((response) => {
        // this.isExporting.splice(this.isExporting.indexOf(value), 1)
        // this.downloadLink = response.data.url
        window.open(response.data.url, '_blank')
      }, (error) => {
        // this.isExporting.splice(this.isExporting.indexOf(value), 1)
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
