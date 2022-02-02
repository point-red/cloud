<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('select filter') | uppercase"
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
            {{ option.label | uppercase }}
          </a>
        </template>
      </div>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </sweet-modal>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      options: [
        {
          id: 1,
          name: 'Interest Reason',
          label: 'Interest Reason'
        },
        {
          id: 2,
          name: 'No Interest Reason',
          label: 'No Interest Reason'
        },
        {
          id: 3,
          name: 'Similar Product',
          label: 'Similar Product'
        },
        {
          id: 4,
          name: 'Repeat Order',
          label: 'Repeat Order'
        }
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
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
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
