<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <span class="breadcrumb-item active">{{ $t('delivery note') | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

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
            v-if="$permission.has('create sales delivery note')"
            to="/sales/delivery-note/create"
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
            <div class="col-sm-2 text-center">
              <p-form-row
                id="form-approval-status"
                name="form-approval-status"
                :label="$t('Item')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.item.open()"
                  >
                    {{ item.name || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-2 text-center">
              <p-form-row
                id="form-approval-status"
                name="form-approval-status"
                :label="$t('Warehouse')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.warehouse.open()"
                  >
                    {{ warehouse.label || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-2 text-center">
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
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Warehouse</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-center">
                Form Status
              </th>
              <th width="50px" />
            </tr>
            <template v-for="(deliveryNote, index) in deliveryNotes">
              <tr
                v-for="(deliveryNoteItem, index2) in deliveryNote.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.delivery-note.show', params: { id: deliveryNote.id }}">
                    {{ deliveryNote.form.number }}
                  </router-link>
                </th>
                <td>{{ deliveryNote.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="deliveryNote.customer">
                    {{ deliveryNote.customer.name }}
                  </template>
                </td>
                <td>{{ deliveryNoteItem.item.name }}</td>
                <td>{{ deliveryNote.warehouse.name }}</td>
                <td class="text-right">
                  {{ deliveryNoteItem.quantity | numberFormat }} {{ deliveryNoteItem.unit }}
                </td>
                <td class="text-center">
                  <div
                    v-if="deliveryNote.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="deliveryNote.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="deliveryNote.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
                <td />
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
    <m-warehouse
      id="warehouse"
      ref="warehouse"
      name="warehouse"
      @choosen="chooseWarehouse($event)"
    />
    <m-form-status
      ref="formStatus"
      @choosen="chooseFormStatus($event)"
    />
    <m-item
      ref="item"
      @choosen="chooseItem($event)"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
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
      warehouse: {
        id: null,
        label: null,
        value: null
      },
      item: {
        id: null,
        label: null,
        name: null
      },
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('salesDeliveryNote', ['deliveryNotes', 'pagination'])
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
        this.getDeliveryNote()
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
    this.getDeliveryNote()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesDeliveryNote', ['get', 'export']),
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getDeliveryNote()
    },
    chooseWarehouse (option) {
      this.warehouse.id = option.id
      this.warehouse.label = option.label
      this.warehouse.value = option.value
      this.getDeliveryNote()
    },
    chooseItem (option) {
      this.item.id = option.id
      this.item.label = option.label
      this.item.name = option.name
      this.getDeliveryNote()
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
      this.getDeliveryNote()
    }, 300),
    getDeliveryNote () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,customer,items',
          fields: 'sales_delivery_note.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: this.formStatus.value,
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText,
            'item.code': this.searchText,
            'item.name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          },
          filter_equal: {
            'sales_delivery_note_item.item_id': this.item.id,
            'sales_delivery_note.warehouse_id': this.warehouse.id
          },
          limit: 10,
          includes: 'form;customer;warehouse;items.item;items.allocation',
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
      this.getDeliveryNote()
    },
    async exportData () {
      if (this.isExportingData) return

      this.isExportingData = true

      try {
        const { data: { url } } = await this.export({
          params: {
            join: 'form,customer,items,item',
            fields: 'sales_delivery_note.*;sales_delivery_note_item.*',
            sort_by: '-form.number',
            filter_form: this.formStatus.value,
            filter_like: {
              'form.number': this.searchText,
              'customer.name': this.searchText,
              'item.code': this.searchText,
              'item.name': this.searchText
            },
            filter_date_min: {
              'form.date': this.serverDateTime(this.date.start, 'start')
            },
            filter_date_max: {
              'form.date': this.serverDateTime(this.date.end, 'end')
            },
            filter_equal: {
              'sales_delivery_note_item.item_id': this.item.id,
              'sales_delivery_note.warehouse_id': this.warehouse.id
            },
            limit: 10,
            includes: 'form;customer;warehouse;items.item;items.allocation',
            page: this.currentPage
          }
        })

        window.open(url, '_blank')
        this.isExportingData = false
      } catch (error) {
        this.isExportingData = false
        this.$notification.error(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
