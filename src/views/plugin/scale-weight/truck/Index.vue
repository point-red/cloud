<template>
  <div>
    <breadcrumb>
      <router-link
        to="/plugin"
        class="breadcrumb-item"
      >
        {{ $t('plugin') | uppercase }}
      </router-link>
      <router-link
        to="/plugin/scale-weight"
        class="breadcrumb-item"
      >
        {{ $t('scale weight') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('truck') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block
        :title="'Scale Weight - Truck'"
        :header="true"
      >
        <div class="row">
          <div class="col-sm-6">
            <p-form-row
              id="date"
              name="date"
              :label="$t('date from')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="date-from"
                  v-model="date_from"
                  name="date_from"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-6">
            <p-form-row
              id="date"
              name="date"
              :label="$t('date to')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="date-to"
                  v-model="date_to"
                  name="date_to"
                />
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="block input-group">
          <router-link
            v-if="$permission.has('create scale weight truck')"
            to="/plugin/scale-weight/truck/create"
            class="input-group-append"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <p-form-row
          id="date"
          name="date"
        >
          <div
            slot="body"
            class="col-lg-12"
          >
            <button
              :disabled="isExporting"
              type="submit"
              class="btn btn-sm btn-primary"
              @click="exportData"
            >
              <i
                v-show="isExporting"
                class="fa fa-asterisk fa-spin"
              /> Export
            </button>
            <ul v-show="downloadLink">
              <li>
                <a
                  :href="downloadLink"
                  download
                >{{ downloadLink }}</a> (expired in 24 hour)
              </li>
            </ul>
          </div>
        </p-form-row>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Machine Code</th>
              <th>Form Number</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Vendor</th>
              <th>Driver</th>
              <th>License Number</th>
              <th>Item</th>
              <th class="text-right">
                Gross
              </th>
              <th class="text-right">
                Tare
              </th>
              <th class="text-right">
                Net
              </th>
            </tr>
            <tr
              v-for="(scaleWeight, index) in scaleWeights"
              :key="scaleWeight.id"
              slot="p-body"
            >
              <th>{{ ++index }}</th>
              <td>{{ scaleWeight.machine_code }}</td>
              <td>
                <router-link :to="{ name: 'plugin.scale-weight.truck.show', params: { id: scaleWeight.id }}">
                  {{ scaleWeight.form_number }}
                </router-link>
              </td>
              <td>{{ scaleWeight.time_in }}</td>
              <td>{{ scaleWeight.time_out }}</td>
              <td>{{ scaleWeight.vendor }}</td>
              <td>{{ scaleWeight.driver }}</td>
              <td>{{ scaleWeight.license_number }}</td>
              <td>{{ scaleWeight.item }}</td>
              <td class="text-right">
                {{ scaleWeight.gross_weight | numberFormat }}
              </td>
              <td class="text-right">
                {{ scaleWeight.tare_weight | numberFormat }}
              </td>
              <td class="text-right">
                {{ scaleWeight.net_weight | numberFormat }}
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import TabMenu from '../TabMenu'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    PointTable,
    TabMenu
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      isExporting: false,
      date_from: this.serverDate(),
      date_to: this.serverDate(),
      downloadLink: ''
    }
  },
  computed: {
    ...mapGetters('pluginScaleWeightTruck', ['scaleWeights', 'pagination'])
  },
  watch: {
    'date_from' () {
      this.$router.push({ query: { search: this.searchText, dateFrom: this.date_from, dateTo: this.date_to } })
      this.currentPage = 1
      this.getScaleWeightRequest()
    },
    'date_to' () {
      this.$router.push({ query: { search: this.searchText, dateFrom: this.date_from, dateTo: this.date_to } })
      this.currentPage = 1
      this.getScaleWeightRequest()
    }
  },
  created () {
    this.getScaleWeightRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginScaleWeightTruck', ['get', 'export']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, dateFrom: this.date_from, dateTo: this.date_to } })
      this.searchText = value
      this.currentPage = 1
      this.getScaleWeightRequest()
    }, 300),
    exportData () {
      this.isExporting = true
      this.export({
        date_from: this.serverDateTime(this.date_from, 'start'),
        date_to: this.serverDateTime(this.date_to, 'end')
      }).then(response => {
        this.isExporting = false
        this.downloadLink = response.data.url
      }).catch(error => {
        this.isExporting = false
        console.log(error)
      })
    },
    getScaleWeightRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'scale_weight_trucks.*',
          sort_by: 'time_in',
          filter_like: {
            form_number: this.searchText,
            machine_code: this.searchText,
            vendor: this.searchText,
            driver: this.searchText,
            license_number: this.searchText
          },
          filter_null: 'deleted_at',
          filter_min: {
            time_in: this.serverDateTime(this.date_from, 'start')
          },
          filter_max: {
            time_in: this.serverDateTime(this.date_to, 'end')
          },
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getScaleWeightRequest()
    }
  }
}
</script>
