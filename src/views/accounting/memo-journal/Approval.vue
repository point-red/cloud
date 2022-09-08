<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item">
        <router-link
          to="/accounting/memo-journal"
          class="breadcrumb-item"
        >{{ $t('memo jurnal') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('approval') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
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
          <button
            class="btn btn-primary mr-3"
            @click="sendRequest"
          >
            Sent {{ checkedRow.length }} {{ `Request${checkedRow.length > 1 ? 's' : ''}` }} <i class="fa fa-paper-plane" />
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                <p-form-check-box
                  id="subscibe"
                  name="subscibe"
                  :is-form="false"
                  :checked="isRowsChecked(accountingMemoJournals, checkedRow)"
                  class="text-center"
                  @click.native="toggleCheckRows()"
                />
              </th>
              <th class="text-center">
                Date Form
              </th>
              <th class="text-center">
                Form Number
              </th>
              <th class="text-center">
                Notes
              </th>
              <th class="text-center">
                Chart Of Account
              </th>
              <th class="text-left">
                Debit
              </th>
              <th class="text-left">
                Credit
              </th>
              <th class="text-center">
                Created By
              </th>
              <th class="text-center">
                Last Request
              </th>
            </tr>
            <template v-for="(accountingMemoJournal, index) in accountingMemoJournals">
              <tr
                v-for="(accountingMemoJournalItem, index2) in accountingMemoJournal.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <template v-if="index2 == 0">
                  <td :rowspan="accountingMemoJournal.items.length">
                    <p-form-check-box
                      id="subscibe"
                      :is-form="false"
                      name="subscibe"
                      :checked="isRowChecked(accountingMemoJournal.id)"
                      class="text-center"
                      @click.native="toggleCheckRow(accountingMemoJournal.id)"
                    />
                  </td>
                  <td
                    :rowspan="accountingMemoJournal.items.length"
                    class="text-center"
                  >
                    {{ accountingMemoJournal.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                  <th
                    :rowspan="accountingMemoJournal.items.length"
                    class="text-center"
                  >
                    <router-link :to="{ name: 'accounting.memo.journal.show', params: { id: accountingMemoJournal.id }}">
                      {{ accountingMemoJournal.number }}
                    </router-link>
                  </th>
                  <td
                    :rowspan="accountingMemoJournal.items.length"
                    class="text-center"
                  >
                    {{ accountingMemoJournal.notes }}
                  </td>
                </template>
                <td class="text-center">
                  {{ accountingMemoJournalItem.chart_of_account_name }}
                </td>
                <td class="text-center">
                  {{ accountingMemoJournalItem.debit }}
                </td>
                <td class="text-center">
                  {{ accountingMemoJournalItem.credit }}
                </td>
                <template v-if="index2 == 0">
                  <td
                    :rowspan="accountingMemoJournal.items.length"
                    class="text-center"
                  >
                    {{ accountingMemoJournal.name }}
                  </td>
                  <td
                    :rowspan="accountingMemoJournal.items.length"
                    class="text-center"
                  >
                    <span v-if="accountingMemoJournal.last_request_date">
                      {{ accountingMemoJournal.last_request_date | dateFormat('DD MMMM YYYY HH:mm') }}
                    </span>
                  </td>
                </template>
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
import momentjs from 'moment-timezone'
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
      checkedRow: [],
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('accountingMemoJournalApproval', ['accountingMemoJournals', 'pagination'])
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
        this.getAccountingMemoJournal()
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
    this.getAccountingMemoJournal()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('accountingMemoJournal', ['addHistories']),
    ...mapActions('accountingMemoJournalApproval', ['get', 'send']),
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
        this.getAccountingMemoJournal()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getAccountingMemoJournal()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getAccountingMemoJournal()
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
      this.getAccountingMemoJournal()
    }, 300),
    getAccountingMemoJournal () {
      this.isLoading = true
      this.get({
        params: {
          filter_like: this.searchText,
          limit: 10,
          page: this.currentPage
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.accountingMemoJournals.forEach(element => {
          if (element.last_request_date != null) {
            const dateUTC = momentjs.utc(element.last_request_date).toDate()
            const localTime = momentjs(dateUTC).local().format('YYYY-MM-DD HH:mm:ss')
            element.last_request_date = localTime
          }
        })
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getAccountingMemoJournal()
    },
    sendRequest () {
      if (this.checkedRow.length > 0) {
        this.isLoading = true
        this.send({
          ids: this.checkedRow
        })
          .then(response => {
            this.$notification.success('sending email approval success')
            this.checkedRow = []
            this.addHistories({ ids: response.input.ids, activity: 'Request Approval' })
              .then(response => {
                this.getAccountingMemoJournal()
              })
              .catch(error => {
                this.$notification.error(error.message)
                this.form.errors.record(error.errors)
              })
          }).catch(error => {
            this.isLoading = false
            this.$notification.error(error.message)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
