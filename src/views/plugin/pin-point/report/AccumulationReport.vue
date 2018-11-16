<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point></breadcrumb-pin-point>
      <span class="breadcrumb-item active">{{ $t('report') | titlecase }}</span>
    </breadcrumb>

    <tab-menu>
      <li class="nav-item" v-if="$permission.has('create pin point sales visitation form')">
        <router-link
          to="/plugin/pin-point/report/performance"
          class="nav-link">
          <span>Interest Reason</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create pin point sales visitation form')">
        <router-link
          to="/plugin/pin-point/report/performance"
          class="nav-link">
          <span>Not Interest Reason</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create pin point sales visitation form')">
        <router-link
          to="/plugin/pin-point/report/performance"
          class="nav-link">
          <span>Similar Product</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create pin point sales visitation form')">
        <router-link
          to="/plugin/pin-point/report/repeat-order"
          class="nav-link">
          <span>Repeat Order</span>
        </router-link>
      </li>
    </tab-menu>

    <div class="row">
      <p-block :title="$t('accumulation report')" :header="true">
        <p-block-inner :is-loading="loading">
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
          <div class="table-responsive">
            <p-table :is-bordered="true">
              <tr slot="p-head">
                <th rowspan="2" class="text-center align-middle">{{ date | dateFormat('MMMM YYYY') }}</th>
                <th :colspan="totalPerWeek.length * 2" class="text-center">{{ $t('interest reason') }}</th>
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
      date: new Date()
    }
  },
  computed: {
    ...mapGetters('InterestReasonReport', ['reasons', 'totalPerWeek'])
  },
  methods: {
    ...mapActions('InterestReasonReport', ['get'])
  },
  created () {
    this.loading = true
    this.get({
      params: {
        date: this.date
      }
    }).then((response) => {
      this.loading = false
    })
  }
}
</script>
