<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitContract">
      <sweet-modal
        ref="modal"
        :title="$t('add social media') | uppercase"
        overlay-theme="dark"
        @close="onClose()">
        <p-form-row
          id="contract-date"
          :label="$t('contract begin')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              name="contract-date"
              v-model="contract_begin"/>
          </div>
        </p-form-row>

        <p-form-row
          id="expired-date"
          :label="$t('contract end')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              name="expired-date"
              v-model="contract_end"/>
          </div>
        </p-form-row>

        <p-form-row
          id="notes"
          name="notes"
          :label="$t('notes')"
          v-model="notes">
        </p-form-row>

        <div class="pull-right">
          <button type="submit" class="btn btn-sm btn-primary">
            {{ $t('add') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      contract_begin: '',
      contract_end: '',
      notes: null
    }
  },
  watch: {
    'notes' () {
      this.$emit('value', this.notes)
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close')
    },
    onSubmitContract () {
      this.$emit('add', {
        contract_begin: this.contract_begin,
        contract_end: this.contract_end,
        notes: this.notes
      })
      this.contract = ''
      this.$refs.modal.close()
    }
  }
}
</script>
