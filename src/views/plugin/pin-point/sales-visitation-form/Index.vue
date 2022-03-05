<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-pin-point />
      <span class="breadcrumb-item active">{{ $t('sales visitation') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            to="/plugin/pin-point/sales-visitation-form/create"
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
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <div class="text-center font-size-sm mb-10">
          <a
            href="javascript:void(0)"
            @click="isFilterOpen = !isFilterOpen"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
        </div>
        <div
          v-show="isFilterOpen"
          class="card"
          :class="{ 'fadeIn': isFilterOpen }"
        >
          <div class="row">
            <div class="col-sm-2 text-center">
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
            <div class="col-sm-2 text-center">
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
                id="filter-item"
                name="filter-item"
                :label="$t('filter item')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.item.open()"
                  >
                    {{ itemName || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-2 text-center">
              <p-form-row
                id="filter-payment-method"
                name="filter-payment-method"
                :label="$t('payment method')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.paymentable.open()"
                  >
                    {{ paymentName || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-2 text-center">
              <p-form-row
                id="filter-branch"
                name="filter-branch"
                :label="$t('branch')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.branch.open()"
                  >
                    {{ branchName || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-2 text-center">
              <p-form-row
                id="filter-item-sold"
                name="filter-item-sold"
                :label="$t('item sold')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.itemSold.open()"
                  >
                    {{ itemSoldLabel || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-12 ml-10 mb-10">
              <button
                type="button"
                :disabled="isExporting"
                class="btn btn-sm btn-secondary mr-5"
                @click="exportData('SalesVisitationReport')"
              >
                <i
                  v-show="isExporting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('export report') | uppercase }}
              </button>
              <button
                type="button"
                :disabled="isExporting"
                class="btn btn-sm btn-secondary mr-5"
                @click="exportData('ChartInterestReason')"
              >
                <i
                  v-show="isExporting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('export interest reason') | uppercase }}
              </button>
              <button
                type="button"
                :disabled="isExporting"
                class="btn btn-sm btn-secondary mr-5"
                @click="exportData('ChartNoInterestReason')"
              >
                <i
                  v-show="isExporting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('export no interest reason') | uppercase }}
              </button>
              <button
                type="button"
                :disabled="isExporting"
                class="btn btn-sm btn-secondary mr-5"
                @click="exportData('ChartSimilarProduct')"
              >
                <i
                  v-show="isExporting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('export similar product') | uppercase }}
              </button>
              <hr v-show="downloadLink">
              <a
                v-show="downloadLink"
                :href="downloadLink"
              >{{ downloadLink }}</a> <span v-show="downloadLink">(expired in 24 hour)</span>
            </div>
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th style="min-width: 50px">
                #
              </th>
              <th style="min-width: 150px">
                {{ $t('photo') }}
              </th>
              <th style="min-width: 100px">
                {{ $t('date') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('sales') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('group') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('customer') }}
              </th>
              <th style="min-width: 250px">
                {{ $t('address') }}
              </th>
              <th style="min-width: 100px">
                {{ $t('phone') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('interest reason') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('no interest reason') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('similar product') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('notes') }}
              </th>
              <th style="min-width: 150px">
                {{ $t('item') }}
              </th>
              <th
                class="text-right"
                style="min-width: 100px"
              >
                {{ $t('quantity') }}
              </th>
              <th
                class="text-right"
                style="min-width: 100px"
              >
                {{ $t('price') }}
              </th>
            </tr>
            <template v-for="(form, index) in forms">
              <template v-if="form.details && form.details.length > 0">
                <tr
                  v-for="(detail, index2) in form.details"
                  slot="p-body"
                  :key="index + '-' + index2"
                >
                  <th>
                    {{ (page * limit) - limit + index + 1 }}<template v-if="form.details.length > 1">
                      .{{ ++index2 }}
                    </template>
                  </th>
                  <td>
                    <template v-if="form.photo">
                      <img
                        :src="form.photo"
                        alt=""
                        width="150px"
                      >
                    </template>
                  </td>
                  <td>
                    {{ form.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>{{ form.group }}</td>
                  <td>{{ form.name }}</td>
                  <td>{{ form.address }}</td>
                  <td>{{ form.phone }}</td>
                  <td>
                    <template v-for="(interestReason, interestIndex) in form.interest_reasons">
                      <p
                        :key="interestIndex"
                        class="mb-0"
                      >
                        - {{ interestReason.name }}
                      </p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(noInterestReason, noInterestIndex) in form.no_interest_reasons">
                      <p
                        :key="noInterestIndex"
                        class="mb-0"
                      >
                        - {{ noInterestReason.name }}
                      </p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, similarProductIndex) in form.similar_products">
                      <p
                        :key="similarProductIndex"
                        class="mb-0"
                      >
                        - {{ similarProduct.name }}
                      </p>
                    </template>
                  </td>
                  <td>
                    {{ form.notes }}
                  </td>
                  <td>
                    {{ detail.item.name }}
                  </td>
                  <td class="text-right">
                    {{ detail.quantity | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ detail.price | numberFormat }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ (page * limit) - limit + index + 1 }}</th>
                  <td>
                    <template v-if="form.photo">
                      <img
                        :src="form.photo"
                        alt=""
                        width="150px"
                      >
                    </template>
                  </td>
                  <td>{{ form.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>{{ form.group }}</td>
                  <td>{{ form.name }}</td>
                  <td>{{ form.address }}</td>
                  <td>{{ form.phone }}</td>
                  <td>
                    <template v-for="(interestReason, interestIndex) in form.interest_reasons">
                      <p
                        :key="interestIndex"
                        class="mb-0"
                      >
                        - {{ interestReason.name }}
                      </p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(noInterestReason, noInterestIndex) in form.no_interest_reasons">
                      <p
                        :key="noInterestIndex"
                        class="mb-0"
                      >
                        - {{ noInterestReason.name }}
                      </p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, similarProductIndex) in form.similar_products">
                      <p
                        :key="similarProductIndex"
                        class="mb-0"
                      >
                        - {{ similarProduct.name }}
                      </p>
                    </template>
                  </td>
                  <td />
                  <td />
                  <td />
                </tr>
              </template>
            </template>
          </point-table>
          <p-pagination
            :current-page="page"
            :last-page="lastPage"
            @updatePage="updatePage"
          />
        </p-block-inner>
      </p-block>
    </div>
    <m-branch
      ref="branch"
      :clear-button="true"
      @choosen="chooseBranch"
    />
    <m-item
      ref="item"
      :create-button="false"
      @choosen="chooseItem"
    />
    <m-item-sold
      ref="itemSold"
      @choosen="chooseItemSold"
    />
    <m-payment-method
      ref="paymentable"
      @choosen="choosePayment"
    />
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPinPoint,
    PointTable
  },
  data () {
    return {
      date: {
        start: this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00'),
        end: this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59')
      },
      branch: {},
      branchId: null,
      branchName: '',
      isFilterOpen: false,
      isLoading: false,
      isExporting: false,
      isDropdown: false,
      downloadLink: '',
      searchText: '',
      limit: 10,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      itemSoldKey: '',
      itemSoldLabel: '',
      itemId: null,
      itemName: '',
      paymentKey: '',
      paymentName: ''
    }
  },
  computed: {
    ...mapGetters('pluginPinPointSalesVisitationForm', ['forms', 'pagination']),
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
        this.search()
      },
      deep: true
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('pluginPinPointSalesVisitationForm', ['get', 'export']),
    toggleBtnDropdown () {
      this.isDropdown = !this.isDropdown
    },
    updatePage (value) {
      this.page = value
      this.search()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.search()
    }, 300),
    onClickSearchButton () {
      this.search()
    },
    check (form) {
      this.$alert.error('', form.photo)
    },
    chooseBranch (option) {
      this.branchId = null
      this.branchName = ''
      this.authUser.branches.forEach(element => {
        if (option.id == element.id) {
          this.branchId = option.id
          this.branchName = option.name
        }
      })
      this.search()
    },
    chooseItem (item) {
      this.itemId = item.id
      this.itemName = item.name
      this.search()
    },
    chooseItemSold (itemSold) {
      this.itemSoldKey = itemSold.key
      this.itemSoldLabel = itemSold.label
      this.search()
    },
    choosePayment (paymentMethod) {
      this.paymentName = paymentMethod.name
      this.paymentKey = paymentMethod.key
      this.search()
    },
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          date_from: this.date.start,
          date_to: this.date.end,
          fields: 'sales_visitation.*',
          sort_by: '-form.date',
          filter_like: {
            'sales_visitation.name': this.searchText,
            'sales_visitation.group': this.searchText,
            'sales_visitation.address': this.searchText,
            'sales_visitation.district': this.searchText,
            'sales_visitation.sub_district': this.searchText,
            'sales_visitation.phone': this.searchText,
            'sales_visitation.notes': this.searchText
          },
          limit: this.limit,
          page: this.page,
          payment_method: this.paymentKey,
          branch_id: this.branchId,
          item_id: this.itemId,
          item_sold: this.itemSoldKey
        }
      }).then(response => {
        this.isLoading = false
        this.lastPage = this.pagination.last_page
      }).catch(errors => {
        this.isLoading = false
      })
    },
    exportData (file = '') {
      this.isExporting = true

      const date1 = new Date(this.date.start)
      const date2 = new Date(this.date.end)
      const diffTime = Math.abs(date2 - date1)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 31) {
        this.isExporting = false
        this.$alert.error('', 'Export tidak bisa lebih dari 1 bulan')
        return
      }

      this.toggleBtnDropdown()
      this.export({
        date_from: this.date.start,
        date_to: this.date.end,
        file_export: file,
        branch_id: this.branchId
      }).then(response => {
        this.downloadLink = response.data.url
      }).catch(error => {
      }).then(() => {
        this.isExporting = false
      })
    }
  }
}
</script>
