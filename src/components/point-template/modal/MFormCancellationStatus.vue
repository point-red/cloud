<template>
  <div>
    <span
      class="link"
      @click="show"
    >{{ mutableLabel || 'SELECT' | uppercase }}</span>
    <a
      v-show="mutableId != null"
      href="javascript:void(0)"
      class="ml-5"
      @click="clear"
    >
      <i class="clickable fa fa-close" />
    </a>
    <p-modal
      :id="'select-form-cancellation-' + id"
      :ref="'select-form-cancellation-' + id"
      title="select form cancellation status"
    >
      <template slot="content">
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
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  props: {
    id: {
      type: String,
      default: null
    },
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
      searchText: '',
      options: [
        { id: null, label: 'pending' },
        { id: 1, label: 'canceled' }
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
  beforeDestroy () {
    this.close()
  },
  methods: {
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option.label)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', '')
    },
    show () {
      this.$refs['select-form-cancellation-' + this.id].show()
    },
    close () {
      this.$refs['select-form-cancellation-' + this.id].close()
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
