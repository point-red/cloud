<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select form status') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
      >
        <template v-for="(option, index) in options">
          <a
            :key="index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }}<br v-if="option.address">
            {{ option.address | uppercase }}<br v-if="option.email">
            {{ option.email | uppercase }}<br v-if="option.phone">
            {{ option.phone | uppercase }}
          </a>
        </template>
      </div>
      <div class="pull-right">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="clear()"
        >
          {{ $t('clear') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: [
        { id: 1, label: 'done', value: 'notArchived;done' },
        { id: 0, label: 'pending', value: 'notArchived;pending' },
        { id: -1, label: 'canceled', value: 'notArchived;cancellationApproved' }
      ],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
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
  beforeDestroy () {
    this.close()
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
