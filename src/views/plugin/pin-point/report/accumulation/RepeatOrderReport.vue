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
              class="btn btn-sm btn-outline-dark mr-5"
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
              class="btn btn-dark btn-sm mr-5"
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
                  :colspan="sales.length"
                  class="text-center align-middle"
                >
                  {{ date | dateFormat('MMMM YYYY') }}
                </th>
              </tr>
              <tr slot="p-head">
                <th />
                <th class="text-center">
                  New
                </th>
                <th class="text-center">
                  Percentage
                </th>
                <th class="text-center">
                  Repeat
                </th>
                <th class="text-center">
                  Percentage
                </th>
              </tr>
              <template v-for="(sales, index) in sales">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <td>Week {{ index + 1 }}</td>
                  <td class="text-center">
                    {{ sales.new }}
                  </td>
                  <td class="text-center">
                    {{ sales.new / sales.total * 100 | numberFormat }}%
                  </td>
                  <td class="text-center">
                    {{ sales.repeat }}
                  </td>
                  <td class="text-center">
                    {{ sales.repeat / sales.total * 100 | numberFormat }}%
                  </td>
                </tr>
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
    ...mapGetters('pluginPinPointReportRepeatOrder', ['sales'])
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('pluginPinPointReportRepeatOrder', ['get']),
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
