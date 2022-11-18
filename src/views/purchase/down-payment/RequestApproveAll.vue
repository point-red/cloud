<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/down-payment"
        class="breadcrumb-item"
      >
        {{ $t('purchase order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('request approve all') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('purchase order')">
        <div class="input-group block">
          <download-excel
            :name="`Purchase Order_approve`"
            :fetch="generateReport"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create purchase order')"
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
                Supplier
              </th>
              <th class="text-center">
                Notes
              </th>
              <th class="text-center">
                Tax
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
            <template v-for="(purchaseOrder, index) in purchaseOrders">
              <tr
                :key="'purchase-order-' + index"
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
                  {{ purchaseOrder.form.date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td class="text-center">
                  <router-link :to="{ name: 'purchase.order.show', params: { id: purchaseOrder.id }}">
                    {{ purchaseOrder.form.number }}
                  </router-link>
                </td>
                <td class="text-center">
                  {{ purchaseOrder.supplier.name }}
                </td>
                <td class="text-center">
                  {{ purchaseOrder.form.notes }}
                </td>
                <td class="text-center">
                  {{ purchaseOrder.tax }}
                </td>
                <td class="text-center">
                  {{ purchaseOrder.amount | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="purchaseOrder.form.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="purchaseOrder.form.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="purchaseOrder.form.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <div v-if="purchaseOrder.last_request_approval_at != null">
                    {{ purchaseOrder.last_request_approval_at | dateFormat('DD MMMM YYYY HH:mm') }}
                  </div>
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
import BreadcrumbPurchase from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import JsonExcel from 'vue-json-excel'
import axios from '@/axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase,
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
    ...mapGetters('purchaseOrder', ['purchaseOrders', 'pagination'])
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('purchaseOrder', ['get', 'sendBulkRequestApproval']),
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
      if (this.checkedLength == this.purchaseOrders.length) {
        this.isCheckAll = true
      } else if (this.checkedLength != this.purchaseOrders.length) {
        this.isCheckAll = false
      }
    },
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          sort_by: '-form.number',
          group_by: 'purchase_order.id',
          fields: 'purchase_order.*',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value + ';' + this.formCancellationStatus.value,
          filter_like: {},
          limit: this.limit,
          includes: 'form;items;supplier;',
          page: this.currentPage
        }
      }).then(response => {
        response.data.forEach(purchaseOrder => {
          this.checkedData.push({
            id: purchaseOrder.id,
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
      this.checkedData.forEach(purchaseOrder => {
        if (purchaseOrder.checked) {
          data.push(purchaseOrder.id)
        }
      })
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
        const { data: { data: purchaseOrders } } = await axios.get('/purchase/orders', {
          params: {
            join: 'form',
            sort_by: '-form.number',
            group_by: 'purchase_order.id',
            fields: 'purchase_order.*',
            filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value + ';' + this.formCancellationStatus.value,
            filter_like: {},
            includes: 'form;items;supplier;',
            limit: 10000,
            page: 1
          }
        })

        let indexItem = 0
        const dataResult = purchaseOrders.map((purchaseOrder) => {
          let approvalStatus = ''
          if (purchaseOrder.form.approval_status == -1) {
            approvalStatus = 'rejected'
          } else if (purchaseOrder.form.approval_status == 0) {
            approvalStatus = 'pending'
          } else if (purchaseOrder.form.approval_status == 1) {
            approvalStatus = 'approve'
          }

          let formStatus = ''
          if (purchaseOrder.form.cancellationStatus == 1) {
            formStatus = 'cancelled'
          } else if (purchaseOrder.form.done == 0) {
            formStatus = 'pending'
          } else if (purchaseOrder.form.done == 1) {
            formStatus = 'done'
          }

          return purchaseOrder.details.map((detail) => {
            indexItem++

            return {
              No: indexItem,
              'Date Form': this.$options.filters.dateFormat(purchaseOrder.form.date, 'DD MMMM YYYY'),
              'Form Number': purchaseOrder.form.number,
              'Payment Method': purchaseOrder.payment_type,
              Account: detail.account.name,
              Amount: purchaseOrder.amount,
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

<style scoped>

</style>
