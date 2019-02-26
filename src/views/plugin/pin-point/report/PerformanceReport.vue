<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point></breadcrumb-pin-point>
      <span class="breadcrumb-item active">{{ $t('report') | titlecase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block :title="$t('performance report')" :header="true">
        <p-form-row :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-range-picker id="date" name="date" v-model="date"/>
          </div>
        </p-form-row>
        <p-form-row>
          <div slot="body" class="col-lg-9">
            <button class="btn btn-primary btn-sm mr-5" @click="search">Search</button>
            <button class="btn btn-primary btn-sm mr-5" @click="$refs.target.show(date.start, date.end)">Set Target</button>
            <button class="btn btn-primary btn-sm mr-5" @click="toggleColor">Highlight</button>
            <button :disabled="isExporting" type="submit" class="btn btn-sm btn-primary" @click="exportData">
              <i v-show="isExporting" class="fa fa-asterisk fa-spin"/> Export
            </button>
            <ul v-show="downloadFiles">
              <li v-for="(downloadFile, index) in downloadFiles" :key="index"><a :href="downloadFile.url" download>{{ downloadFile.name }}</a> (expired in 24 hour)</li>
            </ul>
          </div>
        </p-form-row>
        <p-block-inner :is-loading="loading">
          <div class="table-responsive">
            <p-table :is-bordered="true">
              <tr slot="p-head">
                <th :colspan="2" class="text-center"></th>
                <th :colspan="9" class="text-center">{{ this.dateView }}</th>
                <th :colspan="items.length" class="text-center">{{ this.dateView }}</th>
              </tr>
              <tr slot="p-head">
                <th colspan="2" class=""></th>
                <th colspan="3" class="text-center" :class="{'bg-success text-white': isColorful}">Target</th>
                <th colspan="3" class="text-center" :class="{'bg-danger text-white': isColorful}">Actual</th>
                <th colspan="3" class="text-center" :class="{'bg-primary text-white': isColorful}">Actual (%)</th>
                <th :colspan="items.length" class="text-center">Item Sold</th>
              </tr>
              <tr slot="p-head">
                <th style="min-width: 50px" class="text-center">NO</th>
                <th style="min-width: 100px" class="text-center">Name</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-success text-white': isColorful}">Call</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-success text-white': isColorful}">EC</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-success text-white': isColorful}">Value</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-danger text-white': isColorful}">Call</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-danger text-white': isColorful}">EC</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-danger text-white': isColorful}">Value</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-primary text-white': isColorful}">Call</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-primary text-white': isColorful}">EC</th>
                <th style="min-width: 50px" class="text-center" :class="{'bg-primary text-white': isColorful}">Value</th>
                <th style="min-width: 100px" class="text-center" v-for="(item, index) in items" :key="index">
                  {{ item.name }}
                </th>
              </tr>
              <tr slot="p-body" v-for="(report, index) in reports" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ report.first_name }} {{ report.last_name }}</td>
                <td class="text-center" :class="{'bg-success text-white': isColorful}">{{ report.target_call || 0 }}</td>
                <td class="text-center" :class="{'bg-success text-white': isColorful}">{{ report.target_effective_call || 0 }}</td>
                <td class="text-center" :class="{'bg-success text-white': isColorful}">{{ report.target_value || 0 | numberFormat }}</td>
                <td class="text-center" :class="{'bg-danger text-white': isColorful}">{{ report.call || 0 }}</td>
                <td class="text-center" :class="{'bg-danger text-white': isColorful}">{{ report.effective_call || 0 }}</td>
                <td class="text-center" :class="{'bg-danger text-white': isColorful}">{{ report.value || 0 | numberFormat }}</td>
                <td class="text-center" :class="{'bg-primary text-white': isColorful}">{{ percentage(report.call, report.target_call) | numberFormat }}%</td>
                <td class="text-center" :class="{'bg-primary text-white': isColorful}">{{ percentage(report.effective_call, report.target_effective_call) | numberFormat }}%</td>
                <td class="text-center" :class="{'bg-primary text-white': isColorful}">{{ report.value / report.target_value * 100 | numberFormat }}%</td>
                <td class="text-center" v-for="(item, index) in items" :key="index">
                  {{ getItemSoldQty(item.id, report.items) | numberFormat }}
                </td>
              </tr>
            </p-table>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <target-modal id="target" ref="target" :title="'Target'"/>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import TargetModal from './TargetModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    TargetModal,
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPinPoint
  },
  data () {
    return {
      date: {
        start: this.$moment(),
        end: this.$moment()
      },
      loading: false,
      isExporting: false,
      isColorful: false,
      downloadFiles: []
    }
  },
  computed: {
    ...mapGetters('PinPointPerformanceReport', ['reports', 'items']),
    dateView: function () {
      if (this.date.start == this.date.end) {
        return this.$moment(this.date.start).format('D MMM Y')
      } else if (this.date.start < this.date.end) {
        return this.$moment(this.date.start).format('D MMM Y') + ' - ' + this.$moment(this.date.end).format('D MMM Y')
      } else {
        return 'Invalid date'
      }
    }
  },
  methods: {
    ...mapActions('PinPointPerformanceReport', ['get', 'export']),
    percentage: function (actual, target) {
      let result = actual / target * 100
      return result >= 100 ? 100 : result
    },
    getItemSoldQty (itemId, reportItems) {
      let item = reportItems.find(o => o.item_id === itemId)
      return item ? item.quantity : 0
    },
    toggleColor () {
      this.isColorful = !this.isColorful
    },
    search () {
      this.loading = true
      this.get({
        params: {
          date_from: this.date.start,
          date_to: this.date.end
        }
      }).then((response) => {
        this.loading = false
      }, (error) => {
        this.$notification.error(error.message)
        this.loading = false
      })
    },
    exportData () {
      this.isExporting = true
      this.export({
        date_from: this.date.start,
        date_to: this.date.end
      }).then((response) => {
        this.isExporting = false
        this.downloadFiles = response.data.files
      }, (error) => {
        this.isExporting = false
        console.log(error)
      })
    }
  },
  created () {
    this.get({
      params: {
        date_from: this.date.start,
        date_to: this.date.end
      }
    })
  }
}
</script>
