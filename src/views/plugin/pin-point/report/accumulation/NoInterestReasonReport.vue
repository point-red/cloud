<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point></breadcrumb-pin-point>
      <span class="breadcrumb-item active">{{ $t('report') | titlecase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('accumulation report')" :header="true">
        <p-form-row
          id="date"
          name="date"
          :label="$t('period')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date"
              name="date"
              label="date"
              type="month"
              format="MMMM YYYY"
              v-model="date"/>
          </div>
        </p-form-row>
        <p-form-row>
          <div slot="body" class="col-lg-9">
            <router-link
              to="/plugin/pin-point/report/accumulation/interest-reason"
              class="btn btn-outline-dark btn-sm mr-5">
              <span>{{ $t('interest reason') | titlecase }}</span>
            </router-link>
            <router-link
              to="/plugin/pin-point/report/accumulation/no-interest-reason"
              class="btn btn-dark btn-sm mr-5">
              <span>{{ $t('no interest reason') | titlecase }}</span>
            </router-link>
            <router-link
              to="/plugin/pin-point/report/accumulation/similar-product"
              class="btn btn-outline-dark btn-sm mr-5">
              <span>{{ $t('similar product') | titlecase }}</span>
            </router-link>
            <router-link
              to="/plugin/pin-point/report/accumulation/repeat-order"
              class="btn btn-outline-dark btn-sm mr-5">
              <span>{{ $t('repeat order') | titlecase }}</span>
            </router-link>
          </div>
        </p-form-row>
        <p-form-row>
          <div slot="body" class="col-lg-9">
            <button class="btn btn-primary btn-sm mr-5" :disabled="loadingSaveButton" v-show="!loading" @click="search">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Search
            </button>
          </div>
        </p-form-row>
        <p-block-inner :is-loading="loading">
          <div class="table-responsive">
            <p-table :is-bordered="true">
              <tr slot="p-head">
                <th rowspan="2" class="text-center align-middle">{{ date | dateFormat('MMMM YYYY') }}</th>
                <th :colspan="totalPerWeek.length * 2" class="text-center">{{ $t('no interest reason') }}</th>
              </tr>
              <tr slot="p-head">
                <template v-for="(week, index) in totalPerWeek">
                  <th colspan="2" class="text-center" :key="index">Week {{ index + 1 }}</th>
                </template>
              </tr>
              <tr slot="p-head">
                <th class="text-center" width="150px">{{ $t('description') }}</th>
                <template v-for="(week, index) in totalPerWeek">
                  <th class="text-center" :key="'count-'+index">{{ $t('total') }}</th>
                  <th class="text-center" :key="'percentage-'+index">{{ $t('percentage') }}</th>
                </template>
              </tr>
              <template v-for="(week, indexWeek) in totalPerWeek">
                <template v-for="(reason, indexReason) in reasons" v-if="indexWeek == 0">
                  <tr slot="p-body" :key="'week-' + indexWeek + indexReason">
                    <td>{{ reason.name }}</td>
                    <td class="text-right">{{ reason.week1 }}</td>
                    <td class="text-right">{{ reason.week1 / totalPerWeek[0] * 100 | numberFormat }}%</td>
                    <td class="text-right">{{ reason.week2 }}</td>
                    <td class="text-right">{{ reason.week2 / totalPerWeek[1] * 100 | numberFormat }}%</td>
                    <td class="text-right">{{ reason.week3 }}</td>
                    <td class="text-right">{{ reason.week3 / totalPerWeek[2] * 100 | numberFormat }}%</td>
                    <td class="text-right">{{ reason.week4 }}</td>
                    <td class="text-right">{{ reason.week4 / totalPerWeek[3] * 100 | numberFormat }}%</td>
                    <td class="text-right" v-show="totalPerWeek.length > 4">{{ reason.week5 }}</td>
                    <td class="text-right" v-show="totalPerWeek.length > 4">{{ reason.week5 / totalPerWeek[4] * 100 | numberFormat }}%</td>
                  </tr>
                </template>
              </template>
            </p-table>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from '../TabMenu'
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
      loadingSaveButton: false,
      date: new Date()
    }
  },
  computed: {
    ...mapGetters('NoInterestReasonReport', ['reasons', 'totalPerWeek'])
  },
  methods: {
    ...mapActions('NoInterestReasonReport', ['get']),
    search () {
      this.loading = true
      this.loadingSaveButton = true
      this.get({
        params: {
          date: this.date
        }
      }).then((response) => {
      }).catch((error) => {
      }).then(() => {
        this.loading = false
        this.loadingSaveButton = false
      })
    }
  },
  created () {
    this.search()
  }
}
</script>
