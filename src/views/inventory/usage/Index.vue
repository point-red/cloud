<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <span class="breadcrumb-item active">{{ $t('inventory usage') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <div
            class="input-group-prepend"
            :disabled="isExportingData"
            :style="{
              'opacity': isExportingData ? 0.3 : 1,
              'cursor': isExportingData ? 'not-allowed' : 'pointer'
            }"
            @click="exportData"
          >
            <span
              v-if="isExportingData"
              class="input-group-text"
            >
              <i class="fa fa-asterisk fa-spin" />
            </span>
            <span
              v-else
              class="input-group-text"
            >
              <i class="fa fa-download" />
            </span>
          </div>
          <router-link
            v-if="$permission.has('create inventory usage')"
            to="/inventory/usage/create"
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
        <div class="text-center font-size-sm mb-10">
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
        </div>
        <div style="margin-top: 10px">
          <router-link
            v-if="$permission.has('create sales delivery order')"
            to="/sales/delivery-order/approval"
            class="input-group-prepend"
          >
            <span class="input-group-text font-size-sm">
              {{ $t('request approval all') | uppercase }}
            </span>
          </router-link>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Form Number</th>
              <th>Date</th>
              <th>Item</th>
              <th>Production Number</th>
              <th>Expiry Date</th>
              <th>Notes</th>
              <th class="text-right">
                Quantity
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
            <template v-for="(inventoryUsage, index) in inventoryUsages">
              <tr
                v-for="(inventoryUsageItem, index2) in inventoryUsage.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <td>
                  <router-link :to="{ name: 'inventory.usage.show', params: { id: inventoryUsage.id }}">
                    {{ inventoryUsage.form.number }}
                  </router-link>
                </td>
                <td>{{ inventoryUsage.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ inventoryUsageItem.item.name }}</td>
                <td>{{ inventoryUsageItem.production_number }}</td>
                <td>{{ inventoryUsage.expiry_date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ inventoryUsageItem.notes }}</td>
                <td class="text-right">
                  {{ inventoryUsageItem.quantity | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="inventoryUsage.form.last_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="inventoryUsage.form.last_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="inventoryUsage.form.last_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td>
                  <div
                    v-if="inventoryUsage.form.close_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('closed') | uppercase }}
                  </div>
                  <div
                    v-else-if="inventoryUsage.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="inventoryUsage.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="inventoryUsage.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <router-link
                    class="btn btn-sm btn-light"
                    :to="{ name: 'inventory.usage.histories', params: { id: inventoryUsage.id }}"
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
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      isExportingData: false,
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
    ...mapGetters('inventoryUsage', ['inventoryUsages', 'pagination'])
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
        this.getInventoryUsage()
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
    this.getInventoryUsage()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('inventoryUsage', ['get']),
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getInventoryUsage()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getInventoryUsage()
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
      this.getInventoryUsage()
    }, 300),
    getInventoryUsage () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          fields: 'inventory_usages.*',
          sort_by: '-forms.number',
          // filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          // filter_like: {
          //   'form.number': this.searchText,
          //   'warehouse.name': this.searchText,
          //   'items.item.name': this.searchText,
          //   'items.notes': this.searchText,
          //   'items.quantity': this.searchText
          // },
          // filter_date_min: {
          //   'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          // },
          // filter_date_max: {
          //   'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          // },
          limit: 10,
          includes: 'form;warehouse;items.item',
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
      this.getInventoryUsage()
    },
    async exportData () {
      if (this.isExportingData) return

      this.isExportingData = true

      // try {
      //   const { data: { url } } = await this.export({
      //     params: {
      //       join: 'form,customer,items,item',
      //       fields: 'sales_delivery_order.*;sales_delivery_order_item.*',
      //       sort_by: '-form.number',
      //       filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
      //       filter_like: {
      //         'form.number': this.searchText,
      //         'customer.name': this.searchText,
      //         'item.code': this.searchText,
      //         'item.name': this.searchText
      //       },
      //       filter_date_min: {
      //         'form.date': this.serverDateTime(this.date.start, 'start')
      //       },
      //       filter_date_max: {
      //         'form.date': this.serverDateTime(this.date.end, 'end')
      //       },
      //       includes: 'form;customer;warehouse;items.item'
      //     }
      //   })

      //   window.open(url, '_blank')
      //   this.isExportingData = false
      // } catch (error) {
      //   this.isExportingData = false
      //   this.$notification.error(error.message)
      // }
    }
  }
}
</script>
