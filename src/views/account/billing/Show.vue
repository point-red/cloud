<template>
  <div>
    <breadcrumb>
      <router-link to="/billing" class="breadcrumb-item">{{ $t('billing') | uppercase }}</router-link>
      <span class="breadcrumb-item active">1903010001</span>
    </breadcrumb>

    <p class="p-10 bg-danger text-white"><i class="fa fa-warning"></i> Under Construction (Demo Page)</p>

    <div class="row">
      <p-block :header="true">
        <p-block-inner>
          <!-- Invoice Info -->
          <div class="row my-20">
            <!-- Company Info -->
            <div class="col-6">
              <p class="h3">INVOICE #1903010001</p>
              <address>
                Street Address<br>
                State, City<br>
                Region, Postal Code<br>
                ltd@example.com
              </address>
            </div>
            <!-- END Company Info -->

            <!-- Client Info -->
            <div class="col-6 text-right">
              <p class="h3">Client</p>
              <address>
                Street Address<br>
                State, City<br>
                Region, Postal Code<br>
                ctr@example.com
              </address>
            </div>
            <!-- END Client Info -->
          </div>
          <!-- END Invoice Info -->

          <!-- Table -->
          <div class="table-responsive push">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th class="text-center" style="width: 60px;"></th>
                  <th>Product</th>
                  <th class="text-center" style="width: 90px;">Qty</th>
                  <th class="text-right" style="width: 120px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">1</td>
                  <td>
                    01 Feb 2019 - 28 Feb 2019 - KBSURABAYA.CLOUD.POINT.RED
                  </td>
                  <td class="text-center">
                    1
                  </td>
                  <td class="text-right">300,000.00</td>
                </tr>
                <tr>
                  <td colspan="3" class="font-w600 text-right">Subtotal</td>
                  <td class="text-right">300,000.00</td>
                </tr>
                <tr>
                  <td colspan="3" class="font-w600 text-right">Vat (10%)</td>
                  <td class="text-right">30,000.00</td>
                </tr>
                <tr class="table-warning">
                  <td colspan="3" class="font-w700 text-uppercase text-right">Total</td>
                  <td class="font-w700 text-right">330,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- END Table -->

          <!-- Footer -->
          <p class="text-muted text-center">Thank you very much for doing business with us. We look forward to working with you again!</p>
          <!-- END Footer -->
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
