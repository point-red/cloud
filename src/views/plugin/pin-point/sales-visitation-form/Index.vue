<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point></breadcrumb-pin-point>
      <span class="breadcrumb-item active">{{ $t('sales visitation form') | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('sales visitation form')" :header="true">
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
                <a class="dropdown-item" @click="exportData('ChartNotInterestReason')">Export Chart Not Interest Reason</a>
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
              <th width="250px">{{ $t('date') }}</th>
              <th width="50px">{{ $t('time') }}</th>
              <th width="150px">{{ $t('sales') }}</th>
              <th width="150px">{{ $t('group') }}</th>
              <th width="150px">{{ $t('customer') }}</th>
              <th width="200px">{{ $t('address') }}</th>
              <th width="100px">{{ $t('phone') }}</th>
              <th width="250px">{{ $t('interest reason') }}</th>
              <th width="250px">{{ $t('no interest reason') }}</th>
              <th width="250px">{{ $t('similar product') }}</th>
              <th width="250px">{{ $t('notes') }}</th>
              <th width="250px">{{ $t('item') }}</th>
              <th class="text-right" width="250px">{{ $t('quantity') }}</th>
              <th class="text-right" width="250px">{{ $t('price') }}</th>
            </tr>
            <template v-for="(form, index) in forms">
              <template v-if="form.details && form.details.length > 0">
                <tr slot="p-body" v-for="(detail, index2) in form.details" :key="index + '-' + index2">
                  <th>{{ form.form.date | dateFormat('DD MMM YYYY') }}</th>
                  <td>{{ form.form.date | dateFormat('HH:mm') }}</td>
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
                    <template v-for="(notInterestReason, index) in form.not_interest_reasons">
                      <p :key="index" class="mb-0">- {{ notInterestReason.name }}</p>
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
                  <th>{{ form.form.date | dateFormat('DD MMM YYYY') }}</th>
                  <td>{{ form.form.date | dateFormat('HH:mm') }}</td>
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
                    <template v-for="(notInterestReason, index) in form.not_interest_reasons">
                      <p :key="index" class="mb-0">- {{ notInterestReason.name }}</p>
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
        start: this.$moment(this.$route.query.date_from).format('YYYY-MM-DD HH:mm:ss'),
        end: this.$moment(this.$route.query.date_to).format('YYYY-MM-DD HH:mm:ss')
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
    ...mapGetters('SalesVisitationForm', ['forms', 'pagination'])
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
    ...mapActions('SalesVisitationForm', ['get', 'export']),
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
    getSalesVisitationRequest () {
      this.isLoading = true
      this.get({
        params: {
          date_from: this.date.start,
          date_to: this.date.end,
          filter_like: {
            'forms.date': this.searchText,
            'pin_point_sales_visitations.name': this.searchText,
            'pin_point_sales_visitations.group': this.searchText,
            'pin_point_sales_visitations.address': this.searchText,
            'pin_point_sales_visitations.district': this.searchText,
            'pin_point_sales_visitations.sub_district': this.searchText,
            'pin_point_sales_visitations.phone': this.searchText,
            'pin_point_sales_visitations.notes': this.searchText,
            'users.name': this.searchText
          },
          limit: 20,
          page: this.currentPage,
          sort_by: '-forms.date'
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
