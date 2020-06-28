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
      <span class="breadcrumb-item active">{{ $t('merge') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block
        :title="'Scale Weight - Merge'"
        :header="true"
      >
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
              type="datetime"
              :only-date="false"
              format="YYYY-MM-DD HH:mm"
            />
          </div>
        </p-form-row>
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
              type="datetime"
              :only-date="false"
              format="YYYY-MM-DD HH:mm"
            />
          </div>
        </p-form-row>
        <div class="form-group row">
          <label class="col-form-label col-lg-3">Show/hide Column </label>
          <div class="col-lg-9">
            <div class="dropdown">
              <button
                id="dropdownMenuButton"
                class="btn btn-secondary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                @click="isShow=!isShow"
              >
                Show/hide Column
              </button>
              <div
                :class="{'dropdown-menu': true, 'show': isShow}"
                aria-labelledby="dropdownMenuButton"
              >
                <div
                  v-for="(header, index) in headers"
                  :key="index"
                  class="form-check"
                >
                  <input
                    v-model="checkedColumn"
                    class="form-check-input"
                    type="checkbox"
                    :value="header"
                  >
                  <label class="form-check-label">
                    {{ header }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-lg-3">Filter Category </label>
          <div class="col-lg-9">
            <div class="dropdown">
              <button
                id="dropdownMenuButton1"
                class="btn btn-secondary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                @click="isShowCat=!isShowCat"
              >
                Filter Category
              </button>
              <div
                :class="{'dropdown-menu': true, 'show': isShowCat}"
                aria-labelledby="dropdownMenuButton"
              >
                <div
                  v-for="(item, index) in items"
                  :key="index"
                  class="form-check"
                >
                  <input
                    v-model="checkedColumnCat"
                    class="form-check-input"
                    type="checkbox"
                    :value="item"
                  >
                  <label class="form-check-label">
                    {{ item }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p-form-row
          id="export"
          name="export"
        >
          <div
            slot="body"
            class="col-lg-9"
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
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th v-if="checkedColumn.indexOf('Date In') != -1">
                Date In
              </th>
              <th v-if="checkedColumn.indexOf('Time In') != -1">
                Time In
              </th>
              <th v-if="checkedColumn.indexOf('Date Out') != -1">
                Date Out
              </th>
              <th v-if="checkedColumn.indexOf('Time Out') != -1">
                Time Out
              </th>
              <th v-if="checkedColumn.indexOf('Machine') != -1">
                Machine
              </th>
              <th v-if="checkedColumn.indexOf('Form Number') != -1">
                Form Number
              </th>
              <th v-if="checkedColumn.indexOf('Vendor') != -1">
                Vendor
              </th>
              <th v-if="checkedColumn.indexOf('Driver') != -1">
                Driver
              </th>
              <th v-if="checkedColumn.indexOf('License Number') != -1">
                License Number
              </th>
              <th v-if="checkedColumn.indexOf('Item') != -1">
                Item
              </th>
              <th
                v-if="checkedColumn.indexOf('Gross') != -1"
                class="text-right"
              >
                Gross
              </th>
              <th
                v-if="checkedColumn.indexOf('Tare') != -1"
                class="text-right"
              >
                Tare
              </th>
              <th
                v-if="checkedColumn.indexOf('Net') != -1"
                class="text-right"
              >
                Net
              </th>
              <th
                v-if="checkedColumn.indexOf('User') != -1"
                class="text-right"
              >
                User
              </th>
              <th
                v-if="checkedColumn.indexOf('Date') != -1"
                class="text-right"
              >
                Date
              </th>
              <th
                v-if="checkedColumn.indexOf('Time') != -1"
                class="text-right"
              >
                Time
              </th>
              <th v-if="checkedColumn.indexOf('Item Machine') != -1">
                Item Machine
              </th>
              <th v-if="checkedColumn.indexOf('Item Form Number') != -1">
                Item Form Number
              </th>
              <th v-if="checkedColumn.indexOf('Item Vendor') != -1">
                Item Vendor
              </th>
              <th v-if="checkedColumn.indexOf('Item Driver') != -1">
                Item Driver
              </th>
              <th
                v-if="checkedColumn.indexOf('Item Item') != -1"
                class="text-right"
              >
                Item Item
              </th>
              <th
                v-if="checkedColumn.indexOf('Box') != -1"
                class="text-right"
              >
                Box
              </th>
              <th
                v-if="checkedColumn.indexOf('Item Gross') != -1"
                class="text-right"
              >
                Item Gross
              </th>
              <th
                v-if="checkedColumn.indexOf('Item Tare') != -1"
                class="text-right"
              >
                Item Tare
              </th>
              <th
                v-if="checkedColumn.indexOf('Item Net') != -1"
                class="text-right"
              >
                Item Net
              </th>
              <th
                v-if="checkedColumn.indexOf('Item User') != -1"
                class="text-right"
              >
                Item User
              </th>
            </tr>
            <tr
              v-for="scaleWeight in scaleWeights"
              :key="scaleWeight.id"
              slot="p-body"
            >
              <td v-if="checkedColumn.indexOf('Date In') != -1">
                {{ scaleWeight.date_in }}
              </td>
              <td v-if="checkedColumn.indexOf('Time In') != -1">
                {{ scaleWeight.time_in | dateFormat('HH.mm') }}
              </td>
              <td v-if="checkedColumn.indexOf('Date Out') != -1">
                {{ scaleWeight.date_out }}
              </td>
              <td v-if="checkedColumn.indexOf('Time Out') != -1">
                {{ scaleWeight.time_out | dateFormat('HH.mm') }}
              </td>
              <td v-if="checkedColumn.indexOf('Machine') != -1">
                {{ scaleWeight.machine_code }}
              </td>
              <td v-if="checkedColumn.indexOf('Form Number') != -1">
                {{ scaleWeight.form_number }}
              </td>
              <td v-if="checkedColumn.indexOf('Vendor') != -1">
                {{ scaleWeight.vendor }}
              </td>
              <td v-if="checkedColumn.indexOf('Driver') != -1">
                {{ scaleWeight.driver }}
              </td>
              <td v-if="checkedColumn.indexOf('License Number') != -1">
                {{ scaleWeight.license_number }}
              </td>
              <td v-if="checkedColumn.indexOf('Item') != -1">
                {{ scaleWeight.item }}
              </td>
              <td
                v-if="checkedColumn.indexOf('Gross') != -1"
                class="text-right"
              >
                {{ scaleWeight.gross_weight |
                  numberFormat }}
              </td>
              <td
                v-if="checkedColumn.indexOf('Tare') != -1"
                class="text-right"
              >
                {{ scaleWeight.tare_weight |
                  numberFormat }}
              </td>
              <td
                v-if="checkedColumn.indexOf('Net') != -1"
                class="text-right"
              >
                {{ scaleWeight.net_weight |
                  numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('User') != -1">
                {{ scaleWeight.user }}
              </td>
              <td v-if="checkedColumn.indexOf('Date') != -1">
                {{ scaleWeight.item_date }}
              </td>
              <td v-if="checkedColumn.indexOf('Time') != -1">
                {{ scaleWeight.item_time }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Machine') != -1">
                {{ scaleWeight.item_machine_code }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Form Number') != -1">
                {{ scaleWeight.item_form_number }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Vendor') != -1">
                {{ scaleWeight.item_vendor }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Driver') != -1">
                {{ scaleWeight.item_driver }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Item') != -1">
                {{ scaleWeight.item_item }}
              </td>
              <td v-if="checkedColumn.indexOf('Box') != -1">
                {{ scaleWeight.box }}
              </td>
              <td
                v-if="checkedColumn.indexOf('Item Gross') != -1"
                class="text-right"
              >
                {{ scaleWeight.item_gross_weight |
                  numberFormat }}
              </td>
              <td
                v-if="checkedColumn.indexOf('Item Tare') != -1"
                class="text-right"
              >
                {{ scaleWeight.item_tare_weight |
                  numberFormat }}
              </td>
              <td
                v-if="checkedColumn.indexOf('Item Net') != -1"
                class="text-right"
              >
                {{ scaleWeight.item_net_weight |
                  numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('Item User') != -1">
                {{ scaleWeight.item_user }}
              </td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import TabMenu from '../TabMenu'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu
  },
  data () {
    return {
      headers: [
        'Date In',
        'Time In',
        'Date Out',
        'Time Out',
        'Machine',
        'Form Number',
        'Vendor',
        'Driver',
        'License Number',
        'Item',
        'Gross',
        'Tare',
        'Net',
        'User',
        'Date',
        'Time',
        'Item Machine',
        'Item Form Number',
        'Item Vendor',
        'Item Driver',
        'Item Item',
        'Box',
        'Item Gross',
        'Item Tare',
        'Item Net',
        'Item User'
      ],
      checkedColumn: [
        'Date In',
        'Time In',
        'Date Out',
        'Time Out',
        'Machine',
        'Form Number',
        'Vendor',
        'Driver',
        'License Number',
        'Item',
        'Gross',
        'Tare',
        'Net',
        'User',
        'Date',
        'Time',
        'Item Machine',
        'Item Form Number',
        'Item Vendor',
        'Item Driver',
        'Item Item',
        'Box',
        'Item Gross',
        'Item Tare',
        'Item Net',
        'Item User'
      ],
      checkedColumnCat: [],
      isShow: false,
      isShowCat: false,
      isLoading: true,
      isExporting: false,
      date_from: this.serverDateTime(),
      date_to: this.serverDateTime(),
      downloadLink: ''
    }
  },
  computed: {
    ...mapGetters('pluginScaleWeightMerge', ['scaleWeights', 'items'])
  },
  watch: {
    'date_from' () {
      this.updateDateFrom()
    },
    'date_to' () {
      this.updateDateTo()
    },
    'checkedColumnCat' () {
      this.updateDateTo()
    }
  },
  created () {
    this.isLoading = true
    this.get({
      params: {
        date_from: this.serverDateTime(this.date_from, 'start'),
        date_to: this.serverDateTime(this.date_to, 'end')
      }
    }).then((response) => {
      this.isLoading = false
    }, (error) => {
      this.isLoading = false
      this.$notifications.error(error.message)
    })
    this.getItems({
      params: {}
    }).then((response) => {
      this.checkedColumnCat = response.data
      this.isLoading = false
    }, (error) => {
      this.isLoading = false
      this.$notifications.error(error.message)
    })
  },
  methods: {
    ...mapActions('pluginScaleWeightMerge', ['get', 'export', 'getItems']),
    updateDateFrom () {
      this.isLoading = true
      this.get({
        params: {
          date_from: this.date_from,
          date_to: this.date_to,
          cat: this.checkedColumnCat
        }
      }).then((response) => {
        this.isLoading = false
      }, (error) => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    updateDateTo () {
      this.isLoading = true
      this.get({
        params: {
          date_from: this.date_from,
          date_to: this.date_to,
          cat: this.checkedColumnCat
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    exportData () {
      this.isExporting = true
      this.export({
        date_from: this.serverDateTime(this.date_from, 'start'),
        date_to: this.serverDateTime(this.date_to, 'end'),
        header: this.checkedColumn,
        cat: this.checkedColumnCat
      }).then(response => {
        this.isExporting = false
        this.downloadLink = response.data.url
      }).catch(error => {
        this.isExporting = false
        console.log(error)
      })
    }
  }
}
</script>
