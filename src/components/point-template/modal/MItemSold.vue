<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select item sold') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="list-group push">
        <template v-for="(option_label, option_key) in options">
          <a
            :key="option_key"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': option_key == optionKey }"
            href="javascript:void(0)"
            @click="choose(option_label, option_key)"
          >
            {{ option_label | uppercase }}
          </a>
        </template>
      </div>
      <div
        v-if="options.length == 0"
        class="alert alert-info text-center"
      >
        {{ $t('you don\'t have any') | capitalize }} {{ $t('item') | capitalize }}
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
    }
  },
  data () {
    return {
      options: {
        item_sold: 'item sold',
        no_item_sold: 'no item sold'
      },
      optionKey: '',
      optionLabel: ''
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    clear () {
      this.optionKey = null
      this.optionLabel = null
      this.$emit('choosen', {
        key: this.optionKey,
        name: this.optionLabel
      })
      this.close()
    },
    choose (label, key) {
      this.optionKey = key
      this.optionLabel = label
      this.$emit('choosen', {
        key: this.optionKey,
        label: this.optionLabel
      })
      this.close()
    },
    open (index = null) {
      this.index = index
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
