<template>
  <div>
    <!-- Cash Type Modal -->
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select cash type') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <!-- Cash Type Option -->
      <div
        v-else
        class="list-group push"
      >
        <template v-for="(option, index) in options">
          <a
            :key="index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{ active: option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }}
          </a>
        </template>
      </div>
      <!-- Button Clear -->
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
  // Props Data
  props: {
    // Id
    id: {
      type: String,
      default: ''
    },
    // Value
    value: {
      type: [String, Number],
      default: ''
    },
    // Label
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // Data Default Loading
      isLoading: false,
      // Data Default Options
      options: [
        { id: 0, label: 'in', value: false },
        { id: 1, label: 'out', value: true }
      ],
      // Data Default Mutable Id & Label
      mutableId: null,
      mutableLabel: null
    }
  },
  methods: {
    // Choose Option Cash Type
    choose (option) {
      // Initialization Data Cash Type Id
      this.mutableId = option.id
      // Emit Choose Option
      this.$emit('choosen', option)
      // Close Modal
      this.close()
    },
    // Clear Choose Option
    clear () {
      // Initialization Data Cash Type to Null
      this.mutableId = null
      this.mutableLabel = null
      // Emit Choose
      this.$emit('choosen', '')
      // Close Modal
      this.close()
    },
    // Open Modal
    open () {
      this.$refs['select-' + this.id].open()
    },
    // Close Modal
    close () {
      this.$refs['select-' + this.id].close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>
