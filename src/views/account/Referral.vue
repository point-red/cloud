<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('referral') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block column="col-sm-12 offset-md-2 col-md-8">
        <div class="font-size-h5 font-w300 text-center">
          Refer Point.RED and earn $10 per paid signup!
        </div>
        <hr>
        <div class="font-w300 mt-30">
          <ol>
            <li>$10 earned for every new unique paid user you refer.</li>
            <li>Referred users must be active for 30+ days and use at least $10 in payments to be counted as verified sales.</li>
            <li>Payouts are finalized and issued on the business day following the 1st day of each month.</li>
            <li>Your referral link below uniquely identifies your account. Use this code when linking to point.red and start earning today!</li>
          </ol>
        </div>
        <hr>
        <div class="text-center mb-30">
          <input
            id="referralCode"
            type="text"
            name="referralCode"
            class="btn btn-sm btn-outline-secondary"
            value="SAMPLECODE"
            @click="copyToClipboard"
          >
        </div>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      //
    }
  },
  methods: {
    copyToClipboard () {
      var copyText = document.getElementById('referralCode')

      /* Select the text field */
      copyText.select()

      /* Copy the text inside the text field */
      document.execCommand('copy')

      /* Send notification */
      this.$notification.info('Copied to clipboard')
    }
  }
}
</script>
