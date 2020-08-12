<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-pin-point />
      <span class="breadcrumb-item active">{{ $t('report') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block
        :title="$t('accumulation report')"
        :header="true"
      >
        <p-form-row
          id="date"
          name="date"
          :label="$t('period')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              id="date"
              v-model="date"
              name="date"
              label="date"
              type="month"
              format="MMMM YYYY"
            />
          </div>
        </p-form-row>
        <p-form-row>
          <div
            slot="body"
            class="col-lg-9"
          >
            <router-link
              to="/plugin/pin-point/report/accumulation/interest-reason"
              class="btn btn-dark btn-sm mr-5"
            >
              <span>{{ $t('interest reason') | titlecase }}</span>
            </router-link>
            <router-link
              to="/plugin/pin-point/report/accumulation/no-interest-reason"
              class="btn btn-sm btn-outline-dark mr-5"
            >
              <span>{{ $t('no interest reason') | titlecase }}</span>
            </router-link>
            <router-link
              to="/plugin/pin-point/report/accumulation/similar-product"
              class="btn btn-sm btn-outline-dark mr-5"
            >
              <span>{{ $t('similar product') | titlecase }}</span>
            </router-link>
            <router-link
              to="/plugin/pin-point/report/accumulation/repeat-order"
              class="btn btn-sm btn-outline-dark mr-5"
            >
              <span>{{ $t('repeat order') | titlecase }}</span>
            </router-link>
          </div>
        </p-form-row>
        <p-form-row>
          <div
            slot="body"
            class="col-lg-9"
          >
            <button
              v-show="!isLoading"
              class="btn btn-primary btn-sm mr-5"
              :disabled="isSaving"
              @click="search"
            >
              <i
                v-show="isSaving"
                class="fa fa-asterisk fa-spin"
              /> Search
            </button>
          </div>
        </p-form-row>
        <p-block-inner :is-loading="isLoading">
          <div class="table-responsive">
            <p-table :is-bordered="true">
              <tr slot="p-head">
                <th
                  rowspan="2"
                  class="text-center align-middle"
                >
                  {{ date | dateFormat('MMMM YYYY') }}
                </th>
                <th
                  :colspan="totalPerWeek.length * 2"
                  class="text-center"
                >
                  {{ $t('interest reason') }}
                </th>
              </tr>
              <tr slot="p-head">
                <template v-for="(week, index) in totalPerWeek">
                  <th
                    :key="index"
                    colspan="2"
                    class="text-center"
                  >
                    Week {{ index + 1 }}
                  </th>
                </template>
              </tr>
              <tr slot="p-head">
                <th
                  class="text-center"
                  width="150px"
                >
                  {{ $t('description') }}
                </th>
                <template v-for="(week, index) in totalPerWeek">
                  <th
                    :key="'count-'+index"
                    class="text-center"
                  >
                    {{ $t('total') }}
                  </th>
                  <th
                    :key="'percentage-'+index"
                    class="text-center"
                  >
                    {{ $t('percentage') }}
                  </th>
                </template>
              </tr>
              <template v-for="(week, indexWeek) in totalPerWeek">
                <template v-if="indexWeek == 0">
                  <template v-for="(reason, indexReason) in reasons">
                    <tr
                      slot="p-body"
                      :key="'week-' + indexWeek + indexReason"
                    >
                      <td>{{ reason.name }}</td>
                      <td class="text-right">
                        {{ reason.week1 }}
                      </td>
                      <td class="text-right">
                        {{ reason.week1 / totalPerWeek[0] * 100 | numberFormat }}%
                      </td>
                      <td class="text-right">
                        {{ reason.week2 }}
                      </td>
                      <td class="text-right">
                        {{ reason.week2 / totalPerWeek[1] * 100 | numberFormat }}%
                      </td>
                      <td class="text-right">
                        {{ reason.week3 }}
                      </td>
                      <td class="text-right">
                        {{ reason.week3 / totalPerWeek[2] * 100 | numberFormat }}%
                      </td>
                      <td class="text-right">
                        {{ reason.week4 }}
                      </td>
                      <td class="text-right">
                        {{ reason.week4 / totalPerWeek[3] * 100 | numberFormat }}%
                      </td>
                      <td
                        v-show="totalPerWeek.length > 4"
                        class="text-right"
                      >
                        {{ reason.week5 }}
                      </td>
                      <td
                        v-show="totalPerWeek.length > 4"
                        class="text-right"
                      >
                        {{ reason.week5 / totalPerWeek[4] * 100 | numberFormat }}%
                      </td>
                    </tr>
                  </template>
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
      isLoading: false,
      isSaving: false,
      date: new Date()
    }
  },
  computed: {
    ...mapGetters('pluginPinPointReportInterestReason', ['reasons', 'totalPerWeek'])
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('pluginPinPointReportInterestReason', ['get']),
    search () {
      this.isLoading = true
      this.isSaving = true
      this.get({
        params: {
          date: this.date
        }
      }).then((response) => {
      }).catch((error) => {
        this.$notification.error(error)
      }).then(() => {
        this.isLoading = false
        this.isSaving = false
      })
    }
  }
}
</script>
