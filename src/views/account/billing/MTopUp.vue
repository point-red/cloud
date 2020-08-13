<template>
  <div>
    <p-modal
      id="top-up-component"
      ref="topUpModal"
      title="top up"
    >
      <template slot="content">
        <div class="row gutters-tiny">
          <div class="col-sm-12 mb-10">
            <p>{{ 'select the top up value' | uppercase }}</p>
            <button
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="onClickTemplateButton(50000)"
            >
              {{ 50000 | numberFormat }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="onClickTemplateButton(100000)"
            >
              {{ 100000 | numberFormat }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="onClickTemplateButton(300000)"
            >
              {{ 300000 | numberFormat }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="onClickTemplateButton(500000)"
            >
              {{ 500000 | numberFormat }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="onClickTemplateButton(1000000)"
            >
              {{ 1000000 | numberFormat }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="onClickTemplateButton(5000000)"
            >
              {{ 5000000 | numberFormat }}
            </button>
            <p-form-number
              id="amount"
              v-model="form.amount"
              name="amount"
              class="mt-10"
              :is-text-right="false"
            />
          </div>
        </div>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="isSaving"
          @click="pay()"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('pay now') | uppercase }}
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('cancel') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      form: new Form({
        amount: 0
      }),
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('accountWalletTopUp', ['invoice_url'])
  },
  watch: {
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
  },
  methods: {
    ...mapActions('accountWalletTopUp', ['create']),
    onClickTemplateButton (value) {
      this.form.amount = value
    },
    pay () {
      if (this.form.amount == 0) {
        this.$notification.error('How much money do you want to deposit?')
        return
      } else if (this.form.amount < 50000) {
        this.$notification.error('Minimum value to deposit is 50,000')
        return
      }
      this.isSaving = true
      this.create(this.form).then(response => {
        this.isSaving = false
        window.open(response.data.invoice_url, '_blank')
        this.close()
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    show () {
      this.$refs.topUpModal.show()
    },
    close () {
      this.$refs.topUpModal.close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
