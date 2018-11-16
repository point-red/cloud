<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitContract">
      <p-modal
        ref="contractModalRef"
        :id="id"
        :title="title">
        <template slot="content">
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
        </template>
        <template slot="footer">
          <button class="btn btn-primary">Add</button>
        </template>
      </p-modal>
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
      type: String,
      required: true
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
    show () {
      this.$refs.contractModalRef.show()
    },
    close () {
      this.$refs.contractModalRef.close()
    },
    onSubmitContract () {
      this.$emit('add', {
        contract_begin: this.contract_begin,
        contract_end: this.contract_end,
        notes: this.notes
      })
      this.contract = ''
      this.$refs.contractModalRef.close()
    }
  }
}
</script>
