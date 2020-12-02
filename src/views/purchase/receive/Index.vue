<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <span class="breadcrumb-item active">{{ $t('purchase receive') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create purchase receive')"
            :to="{name: 'purchase.receive.create'}"
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
        <div class="text-center font-size-sm">
          <a
            href="javascript:void(0)"
            @click="isAdvanceFilter = !isAdvanceFilter"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
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
            <div class="col-sm-3 text-center">
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
          <hr>
        </div>
        <div class="mt-10">
          <!-- <label class="css-control css-control-primary css-checkbox mr-10">
            <input
              type="checkbox"
              class="css-control-input"
              @click="toggleCheckRows()"
              :checked="isRowsChecked(purchaseReceives, checkedRow)">
            <span class="css-control-indicator"></span>
          </label> -->
          <span
            v-show="checkedRow.length > 0"
            class="mr-15 animated fadeIn"
          >
            <!--
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
              <th>Number</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Warehouse</th>
              <th>Item</th>
              <th>Notes</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-right">
                Price
              </th>
              <th class="text-right">
                Value
              </th>
              <th class="text-center">
                Form Status
              </th>
              <th width="50px" />
            </tr>
            <template v-for="purchaseReceive in purchaseReceives">
              <tr
                v-for="purchaseReceiveItem in purchaseReceive.items"
                :key="'pi-' + purchaseReceive.id + '-i-' + purchaseReceiveItem.id"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'purchase.receive.show', params: { id: purchaseReceive.id }}">
                    {{ purchaseReceive.form.number }}
                  </router-link>
                </th>
                <td>{{ purchaseReceive.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="purchaseReceive.supplier">
                    {{ purchaseReceive.supplier.name }}
                  </template>
                </td>
                <td>{{ purchaseReceive.warehouse_name }}</td>
                <td>{{ purchaseReceiveItem.item.name }}</td>
                <td>{{ purchaseReceiveItem.notes }}</td>
                <td class="text-right">
                  {{ purchaseReceiveItem.quantity | numberFormat }} {{ purchaseReceiveItem.unit }}
                </td>
                <td class="text-right">
                  {{ purchaseReceiveItem.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ (purchaseReceiveItem.quantity * purchaseReceiveItem.price) | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="purchaseReceive.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="purchaseReceive.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="purchaseReceive.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td>
                <!-- <p-form-check-box
                  :is-form="false"
                  id="check-box"
                  name="check-box"
                  @click.native="toggleCheckRow(purchaseReceive.id)"
                  :checked="isRowChecked(purchaseReceive.id)"
                  class="text-center"/> -->
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
    <m-form-status
      ref="formStatus"
      @choosen="chooseFormStatus($event)"
    />
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Index',
  components: {
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
    ...mapGetters('purchaseReceive', ['purchaseReceives', 'pagination'])
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
        this.getPurchaseReceive()
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
    this.getPurchaseReceive()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('purchaseReceive', ['get']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.purchaseReceives, this.checkedRow)) {
        this.purchaseReceives.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.purchaseReceives.forEach(element => {
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
        purchaseReceives: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getPurchaseReceive()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getPurchaseReceive()
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
      this.getPurchaseReceive()
    }, 300),
    getPurchaseReceive () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,supplier,items,item',
          fields: 'purchase_receive.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'supplier.name': this.searchText,
            'item.code': this.searchText,
            'item.name': this.searchText,
            'purchase_receive_item.notes': this.searchText,
            'purchase_receive_item.quantity': this.searchText,
            'purchase_receive_item.price': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          },
          limit: 10,
          includes: 'form;supplier;items.item;items.allocation',
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
      this.getPurchaseReceive()
    }
  }
}
</script>
