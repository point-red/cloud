<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <span class="breadcrumb-item active">{{ $t('purchase request') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <div class="row">
      <p-block :title="$t('purchase request')" :header="true">
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"/>
          <router-link
            to="/purchase/request/create"
            v-if="$permission.has('create purchase request')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>
        <div class="text-center font-size-sm mb-10">
          <a href="javascript:void(0)" @click="isAdvanceFilter = !isAdvanceFilter">
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down"></i>
          </a>
        </div>
        <div class="card" :class="{ 'fadeIn': isAdvanceFilter }" v-show="isAdvanceFilter">
          <div class="row">
            <div class="col-sm-4 text-center">
              <p-form-row id="date-start" name="date-start" :label="$t('date start')" :is-horizontal="false">
                <div slot="body">
                  <p-date-picker
                  id="date"
                  name="date"
                  label="Date"
                  v-model="date.start"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-4 text-center">
              <p-form-row id="date-end" name="date-end" :label="$t('date end')" :is-horizontal="false">
                <div slot="body">
                  <p-date-picker
                  id="date"
                  name="date"
                  label="Date"
                  v-model="date.end"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-4 text-center">
            </div>
            <div class="col-sm-4 text-center">
              <p-form-row id="form-status" name="form-status" :label="$t('form status')" :is-horizontal="false">
                <div slot="body">
                  <m-form-status
                    :id="'status-id'"
                    v-model="formStatus.id"
                    :label="formStatus.label"
                    @choosen="chooseFormStatus($event)"
                    @clear="clearFormStatus()"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-4 text-center">
              <p-form-row id="form-cancellation-status" name="form-cancellation-status" :label="$t('cancellation status')" :is-horizontal="false">
                <div slot="body">
                  <m-form-cancellation-status
                    :id="'form-cancellation-status-id'"
                    v-model="formCancellationStatus.id"
                    :label="formCancellationStatus.label"
                    @choosen="chooseFormCancellationStatus($event)"
                    @clear="clearFormCancellationStatus()"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-4 text-center">
              <p-form-row id="form-approval-status" name="form-approval-status" :label="$t('approval status')" :is-horizontal="false">
                <div slot="body">
                  <m-form-approval-status
                    :id="'form-approval-status-id'"
                    v-model="formApprovalStatus.id"
                    :label="formApprovalStatus.label"
                    @choosen="chooseFormApprovalStatus($event)"
                    @clear="clearFormApprovalStatus()"/>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <div class="mr-15 animated fadeIn" v-show="checkedRow.length > 0">
          <button type="button" class="btn btn-secondary mr-5" @click="bulkArchiveCustomer()">
            {{ $t('archive') | uppercase }}
          </button>
          <button type="button" class="btn btn-secondary mr-5" @click="bulkActivateCustomer()">
            {{ $t('activate') | uppercase }}
          </button>
          <button type="button" class="btn btn-secondary" @click="bulkDeleteCustomer()">
            {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Number</th>
              <th>Date</th>
              <th>Employee</th>
              <th>Supplier</th>
              <th>Item</th>
              <th>Notes</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Value</th>
              <th class="text-center">Approval Status</th>
              <th class="text-center">Form Status</th>
            </tr>
            <template v-for="(purchaseRequest, index) in purchaseRequests">
            <tr
              v-for="(purchaseRequestItem, index2) in purchaseRequest.items"
              :key="'pr-' + index + '-i-' + index2"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.id }}">
                  {{ purchaseRequest.form.number }}
                </router-link>
              </td>
              <td>{{ purchaseRequest.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
              <td>{{ purchaseRequest.employee.name }}</td>
              <td>
                <template v-if="purchaseRequest.supplier">
                  {{ purchaseRequest.supplier.name }}
                </template>
              </td>
              <td>{{ purchaseRequestItem.item.name }}</td>
              <td>{{ purchaseRequestItem.notes }}</td>
              <td class="text-right">{{ purchaseRequestItem.quantity | numberFormat }}</td>
              <td class="text-right">{{ purchaseRequestItem.price | numberFormat }}</td>
              <td class="text-right">{{ (purchaseRequestItem.quantity * purchaseRequestItem.price) | numberFormat }}</td>
              <td class="text-center">
                <div v-if="purchaseRequest.form.approved == null" class="badge badge-primary">{{ $t('pending') | uppercase }}</div>
                <div v-if="purchaseRequest.form.approved == 0" class="badge badge-danger">{{ $t('rejected') | uppercase }}</div>
                <div v-if="purchaseRequest.form.approved == 1" class="badge badge-success">{{ $t('approved') | uppercase }}</div>
              </td>
              <td class="text-center">
                <div v-if="purchaseRequest.form.canceled == null && purchaseRequest.form.done == 0" class="badge badge-primary">{{ $t('pending') | uppercase }}</div>
                <div v-if="purchaseRequest.form.canceled == null && purchaseRequest.form.done == 1" class="badge badge-success">{{ $t('done') | uppercase }}</div>
                <div v-if="purchaseRequest.form.canceled == 1" class="badge badge-danger">{{ $t('canceled') | uppercase }}</div>
              </td>
            </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      isAdvanceFilter: false,
      checkedRow: [],
      formStatus: {
        id: null,
        label: null
      },
      formApprovalStatus: {
        id: null,
        label: null
      },
      formCancellationStatus: {
        id: null,
        label: null
      },
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequests', 'pagination'])
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
      this.getPurchaseRequest()
    }
  },
  methods: {
    ...mapActions('purchaseRequest', ['get']),
    chooseStatus (option) {
      this.status.label = option
      this.getPurchaseRequest()
    },
    clearStatus () {
      this.status = {
        id: null,
        label: null
      }
      this.getPurchaseRequest()
    },
    chooseFormStatus (option) {
      this.formStatus.label = option
      this.getPurchaseRequest()
    },
    clearFormStatus () {
      this.formStatus = {
        id: null,
        label: null
      }
      this.getPurchaseRequest()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option
      this.getPurchaseRequest()
    },
    clearFormApprovalStatus () {
      this.formApprovalStatus = {
        id: null,
        label: null
      }
      this.getPurchaseRequest()
    },
    chooseFormCancellationStatus (option) {
      this.formCancellationStatus.label = option
      this.getPurchaseRequest()
    },
    clearFormCancellationStatus () {
      this.formCancellationStatus = {
        id: null,
        label: null
      }
      this.getPurchaseRequest()
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
      this.getPurchaseRequest()
    }, 300),
    getPurchaseRequest () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          fields: 'purchase_requests.*',
          sort_by: '-forms.number',
          filter_form: this.formStatus.label,
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'employee.name': this.searchText,
            'items.item.name': this.searchText,
            'items.notes': this.searchText,
            'items.quantity': this.searchText,
            'items.price': this.searchText
          },
          filter_equal: {
            'form.canceled': this.formCancellationStatus.id,
            'form.approved': this.formApprovalStatus.id
          },
          is_archived: this.formStatus.id == -1,
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: 10,
          includes: 'form;employee;supplier;items.item;services.service',
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
      this.getPurchaseRequest()
    }
  },
  created () {
    this.getPurchaseRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
