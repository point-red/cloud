<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('email subscription') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block column="col-sm-12 offset-md-2 col-md-8">
        <div class="font-size-h5 font-w300 text-center">
          Email Subscription
        </div>
        <hr>
        <div class="text-center">
          By subscribing to our email newsletter,
          you will be opting to receive updates about new feature releases,
          discounts and promotional codes, security updates, and more.
        </div>
        <div class="mt-30 text-center">
          If you're not interested in receiving this content,
          please uncheck the box below to unsubscribe.
        </div>
        <hr>
        <p-form-check-box
          id="subscibe"
          name="subscibe"
          class="text-center"
          description="Subscribe to newsletters"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'

export default {
  components: {
    Breadcrumb
  }
}
</script>
