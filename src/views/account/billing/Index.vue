<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('billing') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-lg-3">
        <div class="block block-link-shadow">
          <a class="text-right" href="javascript:void(0)">
            <div class="block-content block-content-full clearfix">
              <div class="float-left mt-10 d-none d-sm-block">
                <i class="si si-wallet fa-3x text-body-bg-dark"></i>
              </div>
              <div class="font-size-h3 font-w600">{{ amount | numberFormat }}</div>
              <div class="font-size-sm font-w600 text-uppercase text-muted">Balance (IDR)</div>
            </div>
          </a>
          <hr>
          <div class="block-content block-content-full block-content-sm">
            <button
              @click="$refs.mTopUp.show()"
              class="btn btn-sm btn-block btn-outline-secondary">
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
                <th>Status</th>
                <th>Date</th>
                <th class="text-right">Amount</th>
              </tr>
              <tr slot="p-body">
                <!-- <th>
                  <router-link :to="{ name: 'billing.show', params: { id: 1 }}">
                    <i class="fa fa-file-text-o"></i> INVOICE19010001 (unpaid)
                  </router-link>
                </th>
                <td>Subscribe</td>
                <td>01 Jan 2019</td>
                <td class="text-right">IDR 300.000</td>
                -->
              </tr>
            </point-table>
          </p-block-inner>
        </p-block>
        </div>
      </div>
    </div>
    <m-top-up ref="mTopUp"></m-top-up>
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
  computed: {
    ...mapGetters('accountWalletBalance', ['amount'])
  },
  methods: {
    ...mapActions('accountWalletBalance', ['get'])
  },
  created () {
    this.get()
    window.setInterval(() => {
      console.log('time')
      this.get()
    }, 5000)
  }
}
</script>
