<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <span class="breadcrumb-item active">{{ $t('stock correction') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <download-excel
            :fetch="generateReport"
            :name="`Stock Correction_${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`"
            class="input-group-prepend"
            :header="[
              `Export date: ${$options.filters.dateFormat(new Date(), 'DD MMM YYYY HH:mm')} `,
              `Export period: ${$options.filters.dateFormat(date.start, 'DD MMM YYYY')} - ${$options.filters.dateFormat(date.end, 'DD MMM YYYY')}`,
              ' ',
              `Project name: ${authUser.tenant_name}`,
              'Stock Correction',
              ' '
            ]"
          >
            <span class="input-group-text">
              <i class="fa fa-download" />
            </span>
          </download-excel>
          <router-link
            v-if="$permission.has('create stock correction')"
            to="/inventory/correction/create"
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
          </div>
          <hr>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>Item</th>
              <th>Production Number</th>
              <th>Expiry Date</th>
              <th>Notes</th>
              <th class="text-right">
                Quantity
              </th>
              <th>Approval</th>
            </tr>
            <template v-for="(stockCorrection, index) in stockCorrections">
              <tr
                v-for="(stockCorrectionItem, index2) in stockCorrection.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'inventory.correction.show', params: { id: stockCorrection.id }}">
                    {{ stockCorrection.form.number }}
                  </router-link>
                </th>
                <td>{{ stockCorrection.form.date | dateFormat('DD MMMM YYYY') }}</td>
                <td>{{ stockCorrectionItem.item.name }}</td>
                <td>{{ stockCorrectionItem.productionNumber }}</td>
                <td>
                  {{ stockCorrectionItem.expiryDate ? $options.filters.dateFormat(stockCorrectionItem.expiryDate) : '' }}
                </td>
                <td class="text-break">
                  {{ stockCorrectionItem.notes }}
                </td>
                <td class="text-right">
                  {{ stockCorrectionItem.quantity | numberFormat }} {{ stockCorrectionItem.unit }}
                </td>
                <td>
                  <div
                    v-if="stockCorrection.form.approvalStatus == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="stockCorrection.form.approvalStatus == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="stockCorrection.form.approvalStatus == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
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
        <m-form-approval-status
          ref="formApprovalStatus"
          @choosen="chooseFormApprovalStatus($event)"
        />
        <m-form-status
          ref="formStatus"
          @choosen="chooseFormStatus($event)"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import JsonExcel from 'vue-json-excel'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import axiosNode from '@/axiosNode'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable,
    DownloadExcel: JsonExcel
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
      },
      approvalStatusses: {
        0: 'pending',
        1: 'approved',
        '-1': 'reject'
      }
    }
  },
  computed: {
    ...mapGetters('inventoryCorrection', ['stockCorrections', 'pagination']),
    ...mapGetters('auth', ['authUser'])
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
        this.getStockCorrections()
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
    this.getStockCorrections()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('inventoryCorrection', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value,
          page: 1
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getStockCorrections()
    }, 300),
    chooseFormStatus: debounce(function (option) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1
        }
      })
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.currentPage = 1
      this.getStockCorrections()
    }),
    chooseFormApprovalStatus: debounce(function (option) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1
        }
      })
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.currentPage = 1
      this.getStockCorrections()
    }),
    getStockCorrections () {
      this.isLoading = true
      const formStatus = this.formStatus.value ? this.formStatus.value.split(';')[1] || null : null
      const formApprovalStatus = this.formApprovalStatus.value || null
      this.get({
        params: {
          filter_form: formStatus + ';' + formApprovalStatus,
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'items.item.name': this.searchText,
            'items.production_number': this.searchText,
            'items.notes': this.searchText
          },
          filter_date_min: this.serverDateTime(this.date.start, 'start'),
          filter_date_max: this.serverDateTime(this.date.end, 'end'),
          limit: 10,
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
      this.getStockCorrections()
    },
    async generateReport () {
      this.isLoading = true
      try {
        const formStatus = this.formStatus.value ? this.formStatus.value.split(';')[1] || null : null
        const formApprovalStatus = this.formApprovalStatus.value || null
        const { data: { data: stockCorrections } } = await axiosNode.get('/inventory/corrections', {
          params: {
            filter_form: formStatus + ';' + formApprovalStatus,
            filter_like: {
              'form.number': this.searchText,
              'form.notes': this.searchText,
              'items.item.name': this.searchText
            },
            filter_date_min: this.serverDateTime(this.date.start, 'start'),
            filter_date_max: this.serverDateTime(this.date.end, 'end'),
            limit: 10000,
            page: 1
          }
        })

        let indexItem = 0
        const dataResult = stockCorrections.map((stockCorrection) => {
          let formStatus = ''
          if (stockCorrection.form.cancellationStatus == 1) {
            formStatus = 'cancelled'
          } else if (stockCorrection.form.approvalStatus == 1) {
            formStatus = 'approved'
          } else if (stockCorrection.form.approvalStatus == -1) {
            formStatus = 'rejected'
          } else if (stockCorrection.form.approvalStatus == 0) {
            formStatus = 'pending'
          }

          return stockCorrection.items.map((item) => {
            indexItem++
            return {
              No: indexItem,
              'Form Number': stockCorrection.form.number,
              Warehouse: stockCorrection.warehouse.name,
              'Stock Correction Date': this.$options.filters.dateFormat(stockCorrection.form.date, 'DD/MM/YYYY'),
              Item: item.item.name,
              'Stock Database': item.initialStock,
              'Stock Correction': item.quantity,
              Balance: item.finalStock,
              'Production Number': item.productionNumber,
              'Expiry Date': item.expiryDate,
              'Form Status': formStatus
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

<style>
.text-break {
  word-break: break-word;
}
</style>
