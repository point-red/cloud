<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/cash-advance"
        class="breadcrumb-item"
      >
        {{ $t('cash advance') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('request approve all') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('cash advance')">
        <div class="input-group block">
          <download-excel
            :name="`Cash Advance_approve`"
            :fetch="generateReport"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create cash advance')"
            to="/finance/cash-advance/create"
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
        <div class="font-size-sm mb-10">
          <button
            class="btn btn-sm btn-primary mr-3"
            @click="sendApproval()"
          >
            {{ $t('send ' + checkedLength + ' request') | uppercase }}
            <i class="fa fa-paper-plane" />
          </button>
        </div>
        <hr>
        <p-block-inner
          v-if="!isLoading"
          :is-loading="isLoading"
        >
          <point-table>
            <tr slot="p-head">
              <th class="text-center">
                <input
                  v-model="isCheckAll"
                  type="checkbox"
                  style="min-width: auto"
                  @change="checkAll()"
                >
              </th>
              <th class="text-center">
                Date Form
              </th>
              <th class="text-center">
                Form Number
              </th>
              <th class="text-center">
                Employee
              </th>
              <th class="text-center">
                Notes
              </th>
              <th class="text-center">
                Account
              </th>
              <th class="text-center">
                Amount
              </th>
              <th class="text-center">
                Approval Status
              </th>
              <th class="text-center">
                Last Request
              </th>
            </tr>
            <template v-for="(cashAdvance, index) in cashAdvances">
              <template v-for="(cashAdvanceDetail, index2) in cashAdvance.details">
                <tr
                  :key="'cash-advance-' + index + '-' + index2"
                  slot="p-body"
                >
                  <td class="text-center">
                    <input
                      v-model="checkedData[index].checked"
                      type="checkbox"
                      style="min-width: auto"
                      @change="countCheck()"
                    >
                  </td>
                  <td class="text-center">
                    {{ cashAdvance.form.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                  <td class="text-center">
                    <router-link :to="{ name: 'finance.cash-advance.show', params: { id: cashAdvance.id }}">
                      {{ cashAdvance.form.number }}
                    </router-link>
                  </td>
                  <td class="text-center">
                    {{ cashAdvance.employee.name }}
                  </td>
                  <td class="text-center">
                    {{ cashAdvanceDetail.notes }}
                  </td>
                  <td class="text-center">
                    {{ cashAdvanceDetail.account.number }} - {{ cashAdvanceDetail.account.alias }}
                  </td>
                  <td class="text-center">
                    {{ cashAdvance.amount | numberFormat }}
                  </td>
                  <td class="text-center">
                    <div
                      v-if="cashAdvance.form.approval_status == 0"
                      class="badge badge-primary"
                    >
                      {{ $t('pending') | uppercase }}
                    </div>
                    <div
                      v-if="cashAdvance.form.approval_status == -1"
                      class="badge badge-danger"
                    >
                      {{ $t('rejected') | uppercase }}
                    </div>
                    <div
                      v-if="cashAdvance.form.approval_status == 1"
                      class="badge badge-success"
                    >
                      {{ $t('approved') | uppercase }}
                    </div>
                  </td>
                  <td class="text-center">
                    <div v-if="cashAdvance.last_request_approval_at != null">
                      {{ cashAdvance.last_request_approval_at | dateFormat('DD MMMM YYYY HH:mm') }}
                    </div>
                  </td>
                </tr>
              </template>
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
import BreadcrumbFinance from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import JsonExcel from 'vue-json-excel'
import axios from '@/axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbFinance,
    PointTable,
    DownloadExcel: JsonExcel
  },
  data () {
    return {
      isCheckAll: false,
      checkedData: [],
      checkedLength: 0,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: 'approvalPending'
      },
      formCancellationStatus: {
        id: null,
        label: null,
        value: 'notCanceled'
      }
    }
  },
  computed: {
    ...mapGetters('financeCashAdvance', ['cashAdvances', 'pagination'])
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('financeCashAdvance', ['get', 'sendBulkRequestApproval']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.search()
    }, 300),
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.search()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.search()
    },
    checkAll () {
      this.checkedData.forEach(data => {
        data.checked = this.isCheckAll
      })
      this.countCheck()
    },
    countCheck () {
      this.checkedLength = this.checkedData.filter(data => data.checked).length
      if (this.checkedLength == this.cashAdvances.length) {
        this.isCheckAll = true
      } else if (this.checkedLength != this.cashAdvances.length) {
        this.isCheckAll = false
      }
    },
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,details,account,employee',
          sort_by: '-form.number',
          group_by: 'cash_advance.id',
          fields: 'cash_advance.*',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value + ';' + this.formCancellationStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'employee.name': this.searchText,
            'account.name': this.searchText
          },
          limit: this.limit,
          includes: 'employee;form;details.account;',
          page: this.currentPage
        }
      }).then(response => {
        response.data.forEach(cashAdvance => {
          this.checkedData.push({
            id: cashAdvance.id,
            checked: false
          })
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    },
    sendApproval () {
      const baseUrl = location.origin
      const data = []
      this.checkedData.forEach(cashAdvance => {
        if (cashAdvance.checked) {
          data.push(cashAdvance.id)
        }
      })
      console.log(data)
      this.sendBulkRequestApproval({
        bulk_id: data,
        tenant_url: baseUrl,
        activity: 'Request approve all'
      }).then(response => {
        this.isCheckAll = false
        this.checkAll()
        this.$notification.success('request approval success')
        this.search()
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    async generateReport () {
      this.isLoading = true
      try {
        const { data: { data: cashAdvances } } = await axios.get('/finance/cash-advances', {
          params: {
            join: 'form,details,account,employee',
            sort_by: '-form.number',
            group_by: 'cash_advance.id',
            fields: 'cash_advance.*',
            filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
            filter_like: {
              'form.number': this.searchText,
              'form.notes': this.searchText,
              'employee.name': this.searchText,
              'account.name': this.searchText
            },
            includes: 'employee;form;details.account;',
            limit: 10000,
            page: 1
          }
        })

        let indexItem = 0
        const dataResult = cashAdvances.map((cashAdvance) => {
          let approvalStatus = ''
          if (cashAdvance.form.approval_status == -1) {
            approvalStatus = 'rejected'
          } else if (cashAdvance.form.approval_status == 0) {
            approvalStatus = 'pending'
          } else if (cashAdvance.form.approval_status == 1) {
            approvalStatus = 'approve'
          }

          let formStatus = ''
          if (cashAdvance.form.cancellationStatus == 1) {
            formStatus = 'cancelled'
          } else if (cashAdvance.form.done == 0) {
            formStatus = 'pending'
          } else if (cashAdvance.form.done == 1) {
            formStatus = 'done'
          }

          return cashAdvance.details.map((detail) => {
            indexItem++

            return {
              No: indexItem,
              'Date Form': this.$options.filters.dateFormat(cashAdvance.form.date, 'DD MMMM YYYY'),
              'Form Number': cashAdvance.form.number,
              'Payment Method': cashAdvance.payment_type,
              Account: detail.account.name,
              Amount: cashAdvance.amount,
              Notes: detail.notes,
              'Approval status': approvalStatus,
              'Form status': formStatus
            }
          })
        })

        this.isLoading = false
        return dataResult.flat()
      } catch (error) {
        console.log(error)
        this.isLoading = false
        return this.$notification.error(error.message)
      }
    }
  }
}
</script>
