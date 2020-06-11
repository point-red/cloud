<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select form approval status') | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <div v-if="isLoading">
        <h3 class="text-center">Loading ...</h3>
      </div>
      <div v-else class="list-group push">
        <template v-for="(option, index) in options">
        <a
          :key="index"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          :class="{'active': option.id == mutableId }"
          @click="choose(option)"
          href="javascript:void(0)">
          {{ option.label | uppercase }}<br v-if="option.address">
          {{ option.address | uppercase }}<br v-if="option.email">
          {{ option.email | uppercase }}<br v-if="option.phone">
          {{ option.phone | uppercase }}
        </a>
        </template>
      </div>
      <div class="pull-right">
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [
        { id: null, label: 'pending', value: 'approvalPending' },
        { id: 1, label: 'approved', value: 'approvalApproved' },
        { id: 0, label: 'rejected', value: 'approvalRejected' }
      ],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  props: {
    id: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    }
  },
  watch: {
    label () {
      this.mutableLabel = this.label
    },
    value () {
      this.mutableId = this.value
    }
  },
  methods: {
    choose (option) {
      this.mutableId = option.id
      this.$emit('choosen', option)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', '')
      this.close()
    },
    open () {
      this.$refs['select-' + this.id].open()
    },
    close () {
      this.$refs['select-' + this.id].close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>
