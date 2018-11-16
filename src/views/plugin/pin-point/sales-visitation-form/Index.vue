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
        <p-form-row
          id="date"
          name="date"
          :label="$t('date from')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date-from"
              name="date_from"
              @input="updateDateFrom"
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
              @input="updateDateTo"
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
        <p-block-inner :is-loading="loading">
          <div class="table-responsive">
            <p-table>
              <tr slot="p-head">
                <th width="150px">{{ $t('date') }}</th>
                <th width="50px">{{ $t('time') }}</th>
                <th width="150px">{{ $t('sales') }}</th>
                <th width="150px">{{ $t('group') }}</th>
                <th width="150px">{{ $t('customer') }}</th>
                <th width="200px">{{ $t('address') }}</th>
                <th width="100px">{{ $t('phone') }}</th>
                <th width="250px">{{ $t('interest reason') }}</th>
                <th width="250px">{{ $t('not interest reason') }}</th>
                <th width="250px">{{ $t('similar product') }}</th>
                <th width="250px">{{ $t('item sold') }}</th>
              </tr>
              <tr slot="p-body" v-for="(form, index) in forms" :key="index">
                <td>{{ form.form.date | dateFormat('DD MMM YYYY') }}</td>
                <td>{{ form.form.date | dateFormat('hh:mm') }}</td>
                <td>{{ form.form.created_by.first_name }} {{ form.form.created_by.last_name }}</td>
                <td>{{ form.group }}</td>
                <td>{{ form.name }}</td>
                <td>{{ form.address }}</td>
                <td>{{ form.phone }}</td>
                <td>
                    <ol>
                      <li v-for="(interestReason, index) in form.interest_reasons" :key="index">
                        {{ interestReason.name }}
                      </li>
                    </ol>
                </td>
                <td>
                    <ol>
                      <li v-for="(notInterestReason, index) in form.not_interest_reasons" :key="index">
                        {{ notInterestReason.name }}
                      </li>
                    </ol>
                </td>
                <td>
                    <ol>
                      <li v-for="(similarProduct, index) in form.similar_products" :key="index">
                        {{ similarProduct.name }}
                      </li>
                    </ol>
                </td>
                <td>
                    <ol>
                      <li v-for="(detail, index) in form.details" :key="index">
                        {{ detail.item.name }} (Qty: {{ detail.quantity | numberFormat }}) (Price: {{ detail.price | numberFormat }}) (Total: {{ detail.quantity * detail.price | numberFormat }})
                      </li>
                    </ol>
                </td>
              </tr>
            </p-table>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
// import { debounce } from 'lodash'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPinPoint
  },
  data () {
    return {
      loading: false,
      isExporting: false,
      date_from: new Date(),
      date_to: new Date(),
      downloadLink: ''
    }
  },
  computed: {
    ...mapGetters('SalesVisitationForm', ['forms'])
  },
  methods: {
    ...mapActions('SalesVisitationForm', ['get', 'export']),
    updateDateFrom () {
      this.loading = true
      this.date_to = this.date_from
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
        date_to: this.date_to
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
    this.get({
      params: {
        date_from: this.date_from,
        date_to: this.date_to
      }
    })
  }
}
</script>
