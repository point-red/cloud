<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('billing') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-lg-3">
        <div class="block block-link-shadow">
          <a
            class="text-right"
            href="javascript:void(0)"
          >
            <div class="block-content block-content-full clearfix">
              <div class="float-left mt-10 d-none d-sm-block">
                <i class="si si-wallet fa-3x text-body-bg-dark" />
              </div>
              <div class="font-size-h3 font-w600">{{ amount | numberFormat }}</div>
              <div class="font-size-sm font-w600 text-uppercase text-muted">Balance (IDR)</div>
            </div>
          </a>
          <hr>
          <div class="block-content block-content-full block-content-sm">
            <button
              class="btn btn-sm btn-block btn-outline-secondary"
              @click="$refs.mTopUp.show()"
            >
              {{ $t('top up') | uppercase }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <div class="row">
          <p-block>
            <p-block-inner>
              <point-table>
                <tr slot="p-head">
                  <th>Invoice Number</th>
                  <th>Due Date</th>
                  <th class="text-right">
                    Total DUE
                  </th>
                  <th class="text-right">
                    Status
                  </th>
                </tr>
                <tr
                  v-for="(invoice, index) in invoices"
                  slot="p-body"
                  :key="index"
                >
                  <th>
                    <router-link :to="{ name: 'billing.show', params: { id: invoice.id }}">
                      <i class="fa fa-file-text-o" /> {{ invoice.number }}
                    </router-link>
                  </th>
                  <td>{{ invoice.due_date | dateFormat('DD MMMM YYYY') }}</td>
                  <td class="text-right">
                    IDR {{ invoice.total | numberFormat }}
                  </td>
                  <td class="text-right">
                    <div
                      v-if="invoice.total > 0 && invoice.paidable_id == null"
                      class="badge badge-danger"
                    >
                      UNPAID
                    </div>
                    <div
                      v-else
                      class="badge badge-success"
                    >
                      PAID
                    </div>
                  </td>
                </tr>
              </point-table>
            </p-block-inner>
          </p-block>
        </div>
      </div>
    </div>
    <m-top-up ref="mTopUp" />
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import PointTable from 'point-table-vue'
import MTopUp from './MTopUp'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    PointTable,
    MTopUp
  },
  data () {
    return {
      getBalanceInterval: null
    }
  },
  computed: {
    ...mapGetters('accountWalletBalance', ['amount']),
    ...mapGetters('accountInvoice', ['invoices', 'pagination'])
  },
  beforeDestroy () {
    clearInterval(this.getBalanceInterval)
  },
  created () {
    this.get()
    this.getInvoices()
    this.getBalanceInterval = window.setInterval(() => {
      console.log('time')
      this.get()
    }, 5000)
  },
  methods: {
    ...mapActions('accountWalletBalance', ['get']),
    ...mapActions('accountInvoice', {
      getInvoices: 'get'
    })
  }
}
</script>
