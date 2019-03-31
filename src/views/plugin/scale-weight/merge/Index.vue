<template>
  <div>
    <breadcrumb>
      <router-link
        to="/plugin"
        class="breadcrumb-item">Plugin
      </router-link>
      <router-link
        to="/plugin/scale-weight"
        class="breadcrumb-item">Scale Weight
      </router-link>
      <span class="breadcrumb-item active">Merge</span>
    </breadcrumb>

    <hr>

    <div class="row">
      <p-block
        :title="'Scale Weight - Merge'"
        :header="true">
        <p-form-row
          id="date"
          name="date"
          :label="$t('date from')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date-from"
              name="date_from"
              type="datetime"
              format="YYYY-MM-DD HH:mm"
              v-model="date_from"/>
          </div>
        </p-form-row>
        <p-form-row
          id="date"
          name="date"
          :label="$t('date to')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date-to"
              name="date_to"
              type="datetime"
              format="YYYY-MM-DD HH:mm"
              v-model="date_to"/>
          </div>
        </p-form-row>
        <div class="form-group row">
          <label class="col-form-label col-lg-3">Show/hide Column </label>
          <div class="col-lg-9">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" @click="isShow=!isShow" type="button"
                      id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Show/hide Column
              </button>
              <div :class="{'dropdown-menu': true, 'show': isShow}" aria-labelledby="dropdownMenuButton">
                <div class="form-check" v-for="(header, index) in headers" :key="index">
                  <input class="form-check-input" type="checkbox" :value="header" v-model="checkedColumn">
                  <label class="form-check-label">
                    {{header}}
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
              <button class="btn btn-secondary dropdown-toggle" @click="isShowCat=!isShowCat" type="button"
                      id="dropdownMenuButton1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Filter Category
              </button>
              <div :class="{'dropdown-menu': true, 'show': isShowCat}" aria-labelledby="dropdownMenuButton">
                <div class="form-check" v-for="(item, index) in items" :key="index">
                  <input class="form-check-input" type="checkbox" :value="item" v-model="checkedColumnCat">
                  <label class="form-check-label">
                    {{item}}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p-form-row id="export" name="export">
          <div slot="body" class="col-lg-9">
            <button :disabled="isExporting" type="submit" class="btn btn-sm btn-primary" @click="exportData">
              <i v-show="isExporting" class="fa fa-asterisk fa-spin"/> Export
            </button>
            <ul v-show="downloadLink">
              <li><a :href="downloadLink" download>{{ downloadLink }}</a> (expired in 24 hour)</li>
            </ul>
          </div>
        </p-form-row>
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th v-if="checkedColumn.indexOf('Date In') != -1">Date In</th>
              <th v-if="checkedColumn.indexOf('Time In') != -1">Time In</th>
              <th v-if="checkedColumn.indexOf('Date Out') != -1">Date Out</th>
              <th v-if="checkedColumn.indexOf('Time Out') != -1">Time Out</th>
              <th v-if="checkedColumn.indexOf('Machine') != -1">Machine</th>
              <th v-if="checkedColumn.indexOf('Form Number') != -1">Form Number</th>
              <th v-if="checkedColumn.indexOf('Vendor') != -1">Vendor</th>
              <th v-if="checkedColumn.indexOf('Driver') != -1">Driver</th>
              <th v-if="checkedColumn.indexOf('License Number') != -1">License Number</th>
              <th v-if="checkedColumn.indexOf('Item') != -1">Item</th>
              <th v-if="checkedColumn.indexOf('Gross') != -1" class="text-right">Gross</th>
              <th v-if="checkedColumn.indexOf('Tare') != -1" class="text-right">Tare</th>
              <th v-if="checkedColumn.indexOf('Net') != -1" class="text-right">Net</th>
              <th v-if="checkedColumn.indexOf('User') != -1" class="text-right">User</th>
              <th v-if="checkedColumn.indexOf('Date') != -1" class="text-right">Date</th>
              <th v-if="checkedColumn.indexOf('Time') != -1" class="text-right">Time</th>
              <th v-if="checkedColumn.indexOf('Item Machine') != -1">Item Machine</th>
              <th v-if="checkedColumn.indexOf('Item Form Number') != -1">Item Form Number</th>
              <th v-if="checkedColumn.indexOf('Item Vendor') != -1">Item Vendor</th>
              <th v-if="checkedColumn.indexOf('Item Driver') != -1">Item Driver</th>
              <th v-if="checkedColumn.indexOf('Item Item') != -1" class="text-right">Item Item</th>
              <th v-if="checkedColumn.indexOf('Box') != -1" class="text-right">Box</th>
              <th v-if="checkedColumn.indexOf('Item Gross') != -1" class="text-right">Item Gross</th>
              <th v-if="checkedColumn.indexOf('Item Tare') != -1" class="text-right">Item Tare</th>
              <th v-if="checkedColumn.indexOf('Item Net') != -1" class="text-right">Item Net</th>
              <th v-if="checkedColumn.indexOf('Item User') != -1" class="text-right">Item User</th>
            </tr>
            <tr
              v-for="scaleWeight in scaleWeights"
              :key="scaleWeight.id"
              slot="p-body">
              <td v-if="checkedColumn.indexOf('Date In') != -1">{{ scaleWeight.date_in }}</td>
              <td v-if="checkedColumn.indexOf('Time In') != -1">{{ scaleWeight.time_in }}</td>
              <td v-if="checkedColumn.indexOf('Date Out') != -1">{{ scaleWeight.date_out }}</td>
              <td v-if="checkedColumn.indexOf('Time Out') != -1">{{ scaleWeight.time_out }}</td>
              <td v-if="checkedColumn.indexOf('Machine') != -1">{{ scaleWeight.machine_code }}</td>
              <td v-if="checkedColumn.indexOf('Form Number') != -1">{{ scaleWeight.form_number }}</td>
              <td v-if="checkedColumn.indexOf('Vendor') != -1">{{ scaleWeight.vendor }}</td>
              <td v-if="checkedColumn.indexOf('Driver') != -1">{{ scaleWeight.driver }}</td>
              <td v-if="checkedColumn.indexOf('License Number') != -1">{{ scaleWeight.license_number }}</td>
              <td v-if="checkedColumn.indexOf('Item') != -1">{{ scaleWeight.item }}</td>
              <td v-if="checkedColumn.indexOf('Gross') != -1" class="text-right">{{ scaleWeight.gross_weight |
                numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('Tare') != -1" class="text-right">{{ scaleWeight.tare_weight |
                numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('Net') != -1" class="text-right">{{ scaleWeight.net_weight |
                numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('User') != -1">{{ scaleWeight.user }}</td>
              <td v-if="checkedColumn.indexOf('Date') != -1">{{ scaleWeight.item_date }}</td>
              <td v-if="checkedColumn.indexOf('Time') != -1">{{ scaleWeight.item_time }}</td>
              <td v-if="checkedColumn.indexOf('Item Machine') != -1">{{ scaleWeight.item_machine_code }}</td>
              <td v-if="checkedColumn.indexOf('Item Form Number') != -1">{{ scaleWeight.item_form_number }}</td>
              <td v-if="checkedColumn.indexOf('Item Vendor') != -1">{{ scaleWeight.item_vendor}}</td>
              <td v-if="checkedColumn.indexOf('Item Driver') != -1">{{ scaleWeight.item_driver}}</td>
              <td v-if="checkedColumn.indexOf('Item Item') != -1">{{ scaleWeight.item_item}}</td>
              <td v-if="checkedColumn.indexOf('Box') != -1">{{ scaleWeight.box}}</td>
              <td v-if="checkedColumn.indexOf('Item Gross') != -1" class="text-right">{{ scaleWeight.item_gross_weight |
                numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Tare') != -1" class="text-right">{{ scaleWeight.item_tare_weight |
                numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('Item Net') != -1" class="text-right">{{ scaleWeight.item_net_weight |
                numberFormat }}
              </td>
              <td v-if="checkedColumn.indexOf('Item User') != -1">{{ scaleWeight.item_user }}</td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb
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
      loading: true,
      isExporting: false,
      date_from: new Date(),
      date_to: new Date(),
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
  methods: {
    ...mapActions('pluginScaleWeightMerge', ['get', 'export', 'getItems']),
    updateDateFrom () {
      this.loading = true
      this.date_to = this.date_from
      this.get({
        params: {
          date_from: this.date_from,
          date_to: this.date_to,
          cat: this.checkedColumnCat
        }
      }).then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notifications.error(error.message)
      })
    },
    updateDateTo () {
      this.loading = true
      this.get({
        params: {
          date_from: this.date_from,
          date_to: this.date_to,
          cat: this.checkedColumnCat
        }
      }).then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notifications.error(error.message)
      })
    },
    exportData () {
      this.isExporting = true
      this.export({
        date_from: this.date_from,
        date_to: this.date_to,
        header: this.checkedColumn,
        cat: this.checkedColumnCat
      }).then((response) => {
        this.isExporting = false
        this.downloadLink = response.data.url
      }, (error) => {
        this.isExporting = false
        console.log(error)
      })
    }
  },
  created () {
    this.loading = true
    this.get({
      params: {
        date_from: this.date_from,
        date_to: this.date_to
      }
    }).then((response) => {
      this.loading = false
    }, (error) => {
      this.loading = false
      this.$notifications.error(error.message)
    })
    this.getItems({
      params: {}
    }).then((response) => {
      this.checkedColumnCat = response.data
      this.loading = false
    }, (error) => {
      this.loading = false
      this.$notifications.error(error.message)
    })
  }
}
</script>
