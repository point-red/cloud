<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory/>
      <span class="breadcrumb-item active">{{ $t('report') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            to="/purchase/request/create"
            v-if="$permission.has('create purchase request')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"/>
        </div>
        <div class="text-center font-size-sm mb-10">
          <a href="javascript:void(0)" @click="isAdvanceFilter = !isAdvanceFilter">
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down"></i>
          </a>
        </div>
        <div class="card" :class="{ 'fadeIn': isAdvanceFilter }" v-show="isAdvanceFilter">
          <div class="row">
            <div class="col-sm-6 text-center">
              <p-form-row id="date-start" name="date-start" :label="$t('date start')" :is-horizontal="false">
                <div slot="body">
                  <p-date-picker
                    id="date"
                    name="date"
                    label="date"
                    v-model="date.start"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row id="date-end" name="date-end" :label="$t('date end')" :is-horizontal="false">
                <div slot="body">
                  <p-date-picker
                    id="date"
                    name="date"
                    label="date"
                    v-model="date.end"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row id="form-approval-status" name="form-approval-status" :label="$t('approval status')" :is-horizontal="false">
                <div slot="body">
                  <m-form-approval-status
                    :id="'form-approval-status-id'"
                    v-model="formApprovalStatus.id"
                    :label="formApprovalStatus.label"
                    @choosen="chooseFormApprovalStatus($event)"
                    @clear="chooseFormApprovalStatus($event)"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row id="form-status" name="form-status" :label="$t('form status')" :is-horizontal="false">
                <div slot="body">
                  <m-form-status
                    :id="'status-id'"
                    :label="formStatus.label"
                    @choosen="chooseFormStatus($event)"
                    @clear="chooseFormStatus($event)"/>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <div class="mt-10">
          <label class="css-control css-control-primary css-checkbox mr-10">
            <input
              type="checkbox"
              class="css-control-input"
              @click="toggleCheckRows()"
              :checked="isRowsChecked(purchaseRequests, checkedRow)">
            <span class="css-control-indicator"></span>
          </label>
          <span class="mr-15 animated fadeIn" v-show="checkedRow.length > 0">
            <button type="button" class="btn btn-sm btn-secondary mr-5" @click="bulkCancel()">
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
            </button>
          </span>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th width="50px"></th>
              <th>Number</th>
              <th>Date</th>
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
              <th>
                {{ ((currentPage - 1) * limit) + index + 1 }}<template v-if="purchaseRequest.items.length > 1">.{{ index2 + 1 }}</template>
              </th>
              <td>
                <p-form-check-box
                  :is-form="false"
                  id="check-box"
                  name="check-box"
                  @click.native="toggleCheckRow(purchaseRequest.id)"
                  :checked="isRowChecked(purchaseRequest.id)"
                  class="text-center"/>
              </td>
              <td>
                <router-link :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.id }}">
                  {{ purchaseRequest.form.number }}
                </router-link>
              </td>
              <td>{{ purchaseRequest.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
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
import Menu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Menu,
    Breadcrumb,
    BreadcrumbInventory,
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
    ...mapGetters('purchaseRequest', ['purchaseRequests', 'pagination'])
  },
  watch: {
    'date': {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getPurchaseRequest()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('purchaseRequest', ['get']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.purchaseRequests, this.checkedRow)) {
        this.purchaseRequests.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            let id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.purchaseRequests.forEach(element => {
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
        let found = needles.some(element => {
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
        purchaseRequests: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getPurchaseRequest()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getPurchaseRequest()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
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
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'items.item.name': this.searchText,
            'items.notes': this.searchText,
            'items.quantity': this.searchText,
            'items.price': this.searchText
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: 10,
          includes: 'form;supplier;items.item;services.service',
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
    this.$router.push({
      query: {
        ...this.$route.query,
        date_from: this.date.start,
        date_to: this.date.end
      }
    })
    this.getPurchaseRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>