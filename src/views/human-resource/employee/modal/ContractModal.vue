<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitContract"
    >
      <sweet-modal
        ref="modal"
        :title="$t('add contract') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <p-form-row
          id="contract-date"
          :label="$t('contract begin')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              v-model="contract_begin"
              name="contract-date"
            />
          </div>
        </p-form-row>

        <p-form-row
          id="expired-date"
          :label="$t('contract end')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              v-model="contract_end"
              name="expired-date"
            />
          </div>
        </p-form-row>

        <p-form-row
          id="notes"
          v-model="notes"
          name="notes"
          :label="$t('notes')"
        />

        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
          >
            {{ $t('save') | uppercase }}
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
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
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
