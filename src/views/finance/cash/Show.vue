<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <router-link to="/finance/cash" class="breadcrumb-item">{{ $t('cash') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('cash')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              {{ payment.form.date }}
            </div>
          </p-form-row>

          <p-form-row
            id="payment-account"
            name="payment-account"
            :label="$t('payment account')">
            <div slot="body" class="col-lg-9">
              {{ payment.payment_account.number }} - {{ payment.payment_account.alias }}
            </div>
          </p-form-row>

          <p-form-row
            id="payment-from"
            name="payment-from"
            :label="$t('payment from')">
            <div slot="body" class="col-lg-9 mt-5">
              {{ payment.paymentable_name }}
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5>Detail</h5>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th style="min-width: 120px">Account</th>
              <th>Notes</th>
              <th class="text-right">Amount</th>
              <th style="min-width: 120px">Allocation</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in payment.details" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.chart_of_account.number }} - {{ row.chart_of_account.alias }}</td>
              <td>{{ row.notes }}</td>
              <td class="text-right">{{ row.amount | numberFormat }}</td>
              <td>
                <template v-if="row.allocation">
                  {{ row.allocation.name }}
                </template>
              </td>
              <td></td>
            </tr>
            <tr slot="p-body">
              <th></th>
              <td></td>
              <td></td>
              <td class="text-right"></td>
              <td></td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-12">
              <h4>Notes</h4>
              <hr/>
              {{ payment.form.notes }}
            </div>
          </div>

          <p-separator></p-separator>

          <div class="form-group row">
            <div class="col-md-12">
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
// import debounce from 'lodash/debounce'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
// import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('financePayment', ['payment'])
  },
  methods: {
    ...mapActions('financePayment', ['find'])
  },
  created () {
    this.find({
      id: this.id,
      params: {
        includes: 'form;details.chartOfAccount;details.allocation;paymentAccount'
      }
    })
  }
}
</script>
