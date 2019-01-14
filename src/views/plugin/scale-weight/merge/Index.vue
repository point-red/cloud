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
              v-model="date_to"/>
          </div>
        </p-form-row>
        <div class="form-group row">
          <label class="col-form-label col-lg-3">Show/hide Column </label>
          <div class="col-lg-9">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" @click="isShow=!isShow" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Show/hide Column
              </button>
              <div :class="{'dropdown-menu': true, 'show': isShow}" aria-labelledby="dropdownMenuButton">
                <div class="form-check" v-for="(header, index) in headers" :key="index">
                  <input class="form-check-input" type="checkbox" :value="header" v-model="checkedColumn">
                  <label class="form-check-label" >
                    {{header}}
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
              <th v-if="checkedColumn.indexOf('Date') != -1">Date</th>
              <th v-if="checkedColumn.indexOf('License Number') != -1">License Number</th>
              <th v-if="checkedColumn.indexOf('Item Gross') != -1" class="text-right">Item Gross</th>
              <th v-if="checkedColumn.indexOf('Item Tare') != -1" class="text-right">Item Tare</th>
              <th v-if="checkedColumn.indexOf('Item Net') != -1" class="text-right">Item Net</th>
              <th v-if="checkedColumn.indexOf('Truck Gross') != -1" class="text-right">Truck Gross</th>
              <th v-if="checkedColumn.indexOf('Truck Tare') != -1" class="text-right">Truck Tare</th>
              <th v-if="checkedColumn.indexOf('Truck Net') != -1" class="text-right">Truck Net</th>
            </tr>
            <tr
              v-for="scaleWeight in scaleWeights"
              :key="scaleWeight.id"
              slot="p-body">
              <td v-if="checkedColumn.indexOf('Date') != -1">{{ scaleWeight.date }}</td>
              <td v-if="checkedColumn.indexOf('License Number') != -1">{{ scaleWeight.license_number }}</td>
              <td v-if="checkedColumn.indexOf('Item Gross') != -1" class="text-right">{{ scaleWeight.item_gross_weight | numberFormat }}</td>
              <td v-if="checkedColumn.indexOf('Item Tare') != -1" class="text-right">{{ scaleWeight.item_tare_weight | numberFormat }}</td>
              <td v-if="checkedColumn.indexOf('Item Net') != -1" class="text-right">{{ scaleWeight.item_net_weight | numberFormat }}</td>
              <td v-if="checkedColumn.indexOf('Truck Gross') != -1" class="text-right">{{ scaleWeight.truck_gross_weight | numberFormat }}</td>
              <td v-if="checkedColumn.indexOf('Truck Tare') != -1" class="text-right">{{ scaleWeight.truck_tare_weight | numberFormat }}</td>
              <td v-if="checkedColumn.indexOf('Truck Net') != -1" class="text-right">{{ scaleWeight.truck_net_weight | numberFormat }}</td>
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
        'Date',
        'License Number',
        'Item Gross',
        'Item Tare',
        'Item Net',
        'Truck Gross',
        'Truck Tare',
        'Truck Net'
      ],
      checkedColumn: [
        'Date',
        'License Number',
        'Item Gross',
        'Item Tare',
        'Item Net',
        'Truck Gross',
        'Truck Tare',
        'Truck Net'
      ],
      isShow: false,
      loading: true,
      isExporting: false,
      date_from: new Date(),
      date_to: new Date(),
      downloadLink: ''
    }
  },
  computed: {
    ...mapGetters('ScaleWeightMerge', ['scaleWeights'])
  },
  watch: {
    'date_from' () {
      this.updateDateFrom()
    }
  },
  methods: {
    ...mapActions('ScaleWeightMerge', ['get', 'export']),
    updateDateFrom () {
      this.date_to = this.date_from
      this.get({
        params: {
          date_from: this.date_from,
          date_to: this.date_to,
        }
      }).then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notifications.error(error.message)
      })
    },
    updateDateTo () {
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
    },
    exportData () {
      this.isExporting = true
      this.export({
        date_from: this.date_from,
        date_to: this.date_to,
        header: this.checkedColumn
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
  }
}
</script>
