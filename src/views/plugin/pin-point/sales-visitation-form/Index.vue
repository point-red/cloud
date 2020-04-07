<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point></breadcrumb-pin-point>
      <span class="breadcrumb-item active">{{ $t('sales visitation') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('sales visitation')" :header="true">
        <p-form-row id="date" name="date" :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-range-picker id="date" name="date" v-model="date"/>
          </div>
        </p-form-row>
        <p-form-row>
          <div slot="body" class="col-lg-9">
            <button :disabled="isLoading" class="btn btn-sm btn-primary mr-5" @click="onClickSearchButton">
              <i v-show="isLoading" class="fa fa-asterisk fa-spin"/> Search
            </button>
            <div class="btn-group">
              <button :disabled="isExporting" class="btn btn-sm btn-primary" @click="toggleBtnDropdown">
                <i v-show="isExporting" class="fa fa-asterisk fa-spin"/>
                Export
              </button>
              <button :disabled="isExporting" type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" @click="toggleBtnDropdown">
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div :class="{'dropdown-menu': true, 'show': !isExporting && isDropdown}">
                <a class="dropdown-item" @click="exportData('SalesVisitationReport')">Export Report</a>
                <a class="dropdown-item" @click="exportData('ChartInterestReason')">Export Chart Interest Reason</a>
                <a class="dropdown-item" @click="exportData('ChartNoInterestReason')">Export Chart Not Interest Reason</a>
                <a class="dropdown-item" @click="exportData('ChartSimilarProduct')">Export Chart Similar Product</a>
              </div>
            </div>
            <ul v-show="downloadLink">
              <li><a :href="downloadLink" download>{{ downloadLink }}</a> (expired in 24 hour)</li>
            </ul>
          </div>
        </p-form-row>
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th style="min-width: 50px">#</th>
              <th style="min-width: 150px">{{ $t('photo') }}</th>
              <th style="min-width: 100px">{{ $t('date') }}</th>
              <th style="min-width: 150px">{{ $t('sales') }}</th>
              <th style="min-width: 150px">{{ $t('group') }}</th>
              <th style="min-width: 150px">{{ $t('customer') }}</th>
              <th style="min-width: 250px">{{ $t('address') }}</th>
              <th style="min-width: 100px">{{ $t('phone') }}</th>
              <th style="min-width: 150px">{{ $t('interest reason') }}</th>
              <th style="min-width: 150px">{{ $t('no interest reason') }}</th>
              <th style="min-width: 150px">{{ $t('similar product') }}</th>
              <th style="min-width: 150px">{{ $t('notes') }}</th>
              <th style="min-width: 150px">{{ $t('item') }}</th>
              <th class="text-right" style="min-width: 100px">{{ $t('quantity') }}</th>
              <th class="text-right" style="min-width: 100px">{{ $t('price') }}</th>
            </tr>
            <template v-for="(form, index) in forms">
              <template v-if="form.details && form.details.length > 0">
                <tr slot="p-body" v-for="(detail, index2) in form.details" :key="index + '-' + index2">
                  <th>{{ index + 1 }}</th>
                  <td>
                    <template v-if="form.photo">
                      <img :src="form.photo" alt="" width="150px">
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
                    <template v-for="(interestReason, index) in form.interest_reasons">
                      <p :key="index" class="mb-0">- {{ interestReason.name }}</p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(noInterestReason, index) in form.no_interest_reasons">
                      <p :key="index" class="mb-0">- {{ noInterestReason.name }}</p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, index) in form.similar_products">
                      <p :key="index" class="mb-0">- {{ similarProduct.name }}</p>
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
                <tr slot="p-body" :key="index">
                  <th>{{ index + 1 }}</th>
                  <td>
                    <template v-if="form.photo">
                      <img :src="form.photo" alt="" width="150px">
                    </template>
                  </td>
                  <td>{{ form.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                  <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                  <td>{{ form.group }}</td>
                  <td>{{ form.name }}</td>
                  <td>{{ form.address }}</td>
                  <td>{{ form.phone }}</td>
                  <td>
                    <template v-for="(interestReason, index) in form.interest_reasons">
                      <p :key="index" class="mb-0">- {{ interestReason.name }}</p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(noInterestReason, index) in form.no_interest_reasons">
                      <p :key="index" class="mb-0">- {{ noInterestReason.name }}</p>
                    </template>
                  </td>
                  <td>
                    <template v-for="(similarProduct, index) in form.similar_products">
                      <p :key="index" class="mb-0">- {{ similarProduct.name }}</p>
                    </template>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </template>
            </template>
          </point-table>
          <p-pagination
            :current-page="currentPage"
            :last-page="lastPage"
            @updatePage="updatePage">
          </p-pagination>
        </p-block-inner>
      </p-block>
    </div>
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
        end: this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 23:59:59')
      },
      isLoading: false,
      isExporting: false,
      isDropdown: false,
      downloadLink: '',
      searchText: '',
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('pluginPinPointSalesVisitationForm', ['forms', 'pagination'])
  },
  watch: {
    date: function () {
      this.$router.push({
        query: {
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
    }
  },
  methods: {
    ...mapActions('pluginPinPointSalesVisitationForm', ['get', 'export']),
    toggleBtnDropdown () {
      this.isDropdown = !this.isDropdown
    },
    updatePage (value) {
      this.currentPage = value
      this.getSalesVisitationRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getSalesVisitationRequest()
    }, 300),
    onClickSearchButton () {
      this.getSalesVisitationRequest()
    },
    check (form) {
      this.$alert.error('', form.photo)
    },
    getSalesVisitationRequest () {
      this.isLoading = true
      this.get({
        params: {
          date_from: this.date.start,
          date_to: this.date.end,
          join: 'form',
          fields: 'pin_point_sales_visitations.*',
          sort_by: '-forms.date',
          filter_like: {
            'form.date': this.searchText
            // 'name': this.searchText,
            // 'group': this.searchText,
            // 'address': this.searchText,
            // 'district': this.searchText,
            // 'sub_district': this.searchText,
            // 'phone': this.searchText,
            // 'notes': this.searchText,
            // 'form.createdBy.name': this.searchText
          },
          limit: 20,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
        this.lastPage = this.pagination.last_page
      }).catch(errors => {
        this.isLoading = false
        console.log(errors.data)
      })
    },
    exportData (file = '') {
      this.isExporting = true
      this.toggleBtnDropdown()
      this.export({
        date_from: this.date.start,
        date_to: this.date.end,
        file_export: file
      }).then((response) => {
        this.downloadLink = response.data.url
      }, (error) => {
        console.log(error)
      }).then(() => {
        this.isExporting = false
      })
    }
  },
  created () {
    this.getSalesVisitationRequest()
  }
}
</script>
