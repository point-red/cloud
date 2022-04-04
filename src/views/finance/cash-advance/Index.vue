<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item active">{{ $t('cash advance') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('cash advance')">
        <div class="input-group block">
          <download-excel
            :name="`Cash Advance_${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`"
            :fetch="generateReport"
            :header="[
              `Export date: ${$options.filters.dateFormat(new Date(), 'DD MMM YYYY HH:mm')} `,
              `Export period: ${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`,
              ' ',
              `Project name: ${authUser.tenant_name}`,
              'Cash Advance',
              ' '
            ]"
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
        <div class="d-flex justify-content-between">
          <router-link
            to="/finance/cash-advance/request-approve-all"
            class="btn btn-sm btn-light"
          >
            {{ $t('request approve all') | uppercase }}
          </router-link>
          <div class="font-size-sm mb-10 mt-2">
            <a
              href="javascript:void(0)"
              @click="isAdvanceFilter = !isAdvanceFilter"
            >
              {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
            </a>
          </div>
          <div />
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
          <div class="row">
            <div class="col-sm-6 text-center">
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
                    @input="search()"
                  />
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
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
                    @input="search()"
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
            <div class="col-sm-6 text-center">
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
            </div>
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th class="text-center">
                No
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
                Amount Remaining
              </th>
              <th class="text-center">
                Approval Status
              </th>
              <th class="text-center">
                Form Status
              </th>
              <th class="text-center">
                History
              </th>
            </tr>
            <template v-for="(cashAdvance, index) in cashAdvances">
              <template v-for="(cashAdvanceDetail, index2) in cashAdvance.details">
                <tr
                  :key="'cash-advance-' + index + '-' + index2"
                  slot="p-body"
                >
                  <td class="text-center">
                    {{ ++index }}
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
                    {{ cashAdvance.amount_remaining | numberFormat }}
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
                    <div
                      v-if="cashAdvance.form.cancellation_status == 1"
                      class="badge badge-danger"
                    >
                      {{ $t('canceled') | uppercase }}
                    </div>
                    <div
                      v-else-if="cashAdvance.form.done == 0"
                      class="badge badge-primary"
                    >
                      {{ $t('pending') | uppercase }}
                    </div>
                    <div
                      v-else-if="cashAdvance.form.done == 1"
                      class="badge badge-success"
                    >
                      {{ $t('done') | uppercase }}
                    </div>
                  </td>
                  <td class="text-center">
                    <router-link
                      :to="{ name: 'finance.cash-advance.history', params: { number: cashAdvance.form.number }}"
                      class="btn btn-sm btn-light"
                    >
                      <i class="fa fa-history p-0" />
                    </router-link>
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
      isAdvanceFilter: false,
      checkedRow: [],
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
        value: null
      }
    }
  },
  computed: {
    ...mapGetters('financeCashAdvance', ['cashAdvances', 'pagination']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    date: function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.search()
    }
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('financeCashAdvance', ['get']),
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
    search () {
      this.isLoading = true
      this.get({
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
            'account.alias': this.searchText,
            'cash_advance_detail.notes': this.searchText,
            'cash_advance.amount': this.searchText,
            'cash_advance.amount_remaining': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'employee;form;details.account;',
          page: this.currentPage
        }
      }).then(response => {
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
            filter_date_min: {
              'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
            },
            filter_date_max: {
              'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
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
