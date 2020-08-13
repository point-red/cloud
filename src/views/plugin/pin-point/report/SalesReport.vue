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
        :title="$t('performance report')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
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
          <div class="table-responsive">
            <p-table :is-bordered="true">
              <tr slot="p-head">
                <th />
                <th
                  colspan="2"
                  class="text-center"
                >
                  Invoice
                </th>
                <th />
                <th
                  colspan="2"
                  class="text-center"
                >
                  Item
                </th>
                <th colspan="6" />
              </tr>
              <tr slot="p-head">
                <th
                  style="min-width: 150px"
                  class="text-center"
                >
                  Cash / Bank
                </th>
                <th
                  style="min-width: 150px"
                  class="text-center"
                >
                  Date
                </th>
                <th
                  style="min-width: 150px"
                  class="text-center"
                >
                  Number
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Customer
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Code
                </th>
                <th
                  style="min-width: 200px"
                  class="text-center"
                >
                  Name
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Quantity
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Price
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Total
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Sales
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Due Date
                </th>
                <th
                  style="min-width: 100px"
                  class="text-center"
                >
                  Notes
                </th>
              </tr>
              <tr slot="p-body">
                <td class="text-center">
                  Bank Mandiri
                </td>
                <td class="text-center">
                  01 OCT 2018
                </td>
                <td class="text-center">
                  INV0102302
                </td>
                <td class="text-center">
                  Toko 27
                </td>
                <td class="text-center">
                  001-2
                </td>
                <td class="text-center">
                  Kopi Bara 5gr
                </td>
                <td class="text-center">
                  2
                </td>
                <td class="text-center">
                  900
                </td>
                <td class="text-center">
                  1800
                </td>
                <td class="text-center">
                  Nur Hidayat
                </td>
                <td class="text-center">
                  -
                </td>
                <td class="text-center" />
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
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('pluginPinPointSalesVisitationForm', ['forms'])
  },
  created () {
    this.get()
  },
  methods: {
    ...mapActions('pluginPinPointSalesVisitationForm', ['get'])
  }
}
</script>
