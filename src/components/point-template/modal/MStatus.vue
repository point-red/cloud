<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select') | uppercase"
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
      <div class="pull-right">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

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
      searchText: '',
      options: [
        { id: 0, label: 'active' },
        { id: 1, label: 'archived' }
      ],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    this.options.forEach(element => {
      if (this.value == element.id) {
        this.mutableLabel = element.label
      }
    })
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('choosen', option)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', null)
      this.close()
    },
    open (status = { id: null, label: null }) {
      this.mutableId = status.id
      this.mutableLabel = status.label
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
