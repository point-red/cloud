<template>
  <div>
    <breadcrumb>
      <router-link
        to="/plugin"
        class="breadcrumb-item">Plugin</router-link>
      <router-link
        to="/plugin/scale-weight"
        class="breadcrumb-item">Scale Weight</router-link>
      <span class="breadcrumb-item active">Item</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block
        :title="'Scale Weight - Item'"
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
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th>Machine Code</th>
              <th>Form Number</th>
              <th>Time</th>
              <th>Vendor</th>
              <th>Driver</th>
              <th>License Number</th>
              <th>Item</th>
              <th class="text-right">Gross</th>
              <th class="text-right">Tare</th>
              <th class="text-right">Net</th>
            </tr>
            <tr
              v-for="scaleWeight in scaleWeights"
              :key="scaleWeight.id"
              slot="p-body">
              <td>{{ scaleWeight.machine_code }}</td>
              <td>
                <router-link :to="{ name: 'ScaleWeightTruck', params: { id: scaleWeight.id }}">
                  {{ scaleWeight.form_number }}
                </router-link>
              </td>
              <td>{{ scaleWeight.time }}</td>
              <td>{{ scaleWeight.vendor }}</td>
              <td>{{ scaleWeight.driver }}</td>
              <td>{{ scaleWeight.license_number }}</td>
              <td>{{ scaleWeight.item }}</td>
              <td class="text-right">{{ scaleWeight.gross_weight | numberFormat }}</td>
              <td class="text-right">{{ scaleWeight.tare_weight | numberFormat }}</td>
              <td class="text-right">{{ scaleWeight.net_weight | numberFormat }}</td>
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
      isLoading: true,
      isExporting: false,
      date_from: this.serverDateTime(),
      date_to: this.serverDateTime(),
      downloadLink: ''
    }
  },
  computed: {
    ...mapGetters('pluginScaleWeightItem', ['scaleWeights'])
  },
  watch: {
    'date_from' () {
      this.updateDateFrom()
    },
    'date_to' () {
      this.updateDateTo()
    }
  },
  methods: {
    ...mapActions('pluginScaleWeightItem', ['get', 'export']),
    updateDateFrom () {
      this.isLoading = true
      this.get({
        params: {
          date_from: this.serverDateTime(this.date_from, 'start'),
          date_to: this.serverDateTime(this.date_to, 'end')
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    updateDateTo () {
      this.isLoading = true
      this.get({
        params: {
          date_from: this.serverDateTime(this.date_from, 'start'),
          date_to: this.serverDateTime(this.date_to, 'end')
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
        date_to: this.serverDateTime(this.date_to, 'end')
      }).then(response => {
        this.isExporting = false
        this.downloadLink = response.data.url
      }).catch(error => {
        this.isExporting = false
        console.log(error)
      })
    }
  },
  created () {
    this.isLoading = true
    this.get({
      params: {
        date_from: this.serverDateTime(this.date_from, 'start'),
        date_to: this.serverDateTime(this.date_to, 'end')
      }
    }).then(response => {
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
      this.$notifications.error(error.message)
    })
  }
}
</script>
