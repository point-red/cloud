<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Billing</span>
    </breadcrumb>

    <p class="p-10 bg-danger text-white"><i class="fa fa-warning"></i> Under Construction (Demo Page)</p>

    <div class="row gutters-tiny">
      <div class="col-md-6 col-xl-3">
        <a class="block block-link-shadow text-right" href="javascript:void(0)">
          <div class="block-content block-content-full clearfix">
            <div class="float-left mt-10">
              <i class="si si-wallet fa-3x text-body-bg-dark"></i>
            </div>
            <div class="font-size-h3 font-w600">2.000.000</div>
            <div class="font-size-sm font-w600 text-uppercase text-muted">Balance (IDR)</div>
          </div>
        </a>
      </div>
      <div class="col-md-6 col-xl-3">
        <a class="block block-link-shadow text-right" href="javascript:void(0)">
          <div class="block-content block-content-full clearfix">
            <div class="float-left mt-10">
              <i class="si si-note fa-3x text-body-bg-dark"></i>
            </div>
            <div class="font-size-h3 font-w600">1</div>
            <div class="font-size-sm font-w600 text-uppercase text-muted">Unpaid</div>
          </div>
        </a>
      </div>
    </div>

    <div class="row">
      <p-block>
        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>Invoice Number</th>
              <th>Date</th>
              <th class="text-right">Amount</th>
            </tr>
            <tr slot="p-body">
              <th>
                <router-link :to="{ name: 'billing.show', params: { id: 1 }}">
                  <i class="fa fa-file-text-o"></i> INVOICE19010001 (unpaid)
                </router-link>
              </th>
              <td>01 Jan 2019</td>
              <td class="text-right">IDR 300.000</td>
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import PointTable from 'point-table-vue'

export default {
  components: {
    Breadcrumb,
    PointTable
  }
}
</script>
