<template>
  <div>
    <p-loading-block
      v-show="isSaving"
      message="please wait and do not close this page"
    />
    <form @submit.prevent>
      <sweet-modal
        ref="modal"
        :title="$t('pay invoice') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <table class="table">
              <tr>
                <td>WALLET</td>
                <td class="text-right">
                  {{ amount | numberFormat }}
                </td>
              </tr>
              <tr>
                <td>INVOICE #{{ invoice.number }}</td>
                <td class="text-right">
                  -{{ invoice.total | numberFormat }}
                </td>
              </tr>
              <tr>
                <td />
                <td class="text-right">
                  {{ amount - invoice.total | numberFormat }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="pull-right">
          <button
            v-if="invoice.total <= amount"
            type="submit"
            class="btn btn-sm btn-primary mr-5"
            :disabled="isSaving"
            @click="onSubmit()"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('pay') | uppercase }}
          </button>
          <button
            v-if="invoice.total > amount"
            type="button"
            class="btn btn-sm btn-danger mr-5"
            :disabled="isSaving"
            @click="close()"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('not enough wallet') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      invoice: {
        id: null,
        number: null,
        total: 0
      },
      form: new Form({
        invoice_id: null
      })
    }
  },
  computed: {
    ...mapGetters('accountWalletBalance', ['amount'])
  },
  methods: {
    ...mapActions('accountWalletBalance', ['get']),
    ...mapActions('accountWalletPay', ['create']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.form.invoice_id = this.invoice.id
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('added', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (invoice) {
      this.get()
      this.invoice = invoice
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
