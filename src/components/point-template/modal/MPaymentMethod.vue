<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select payment method') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="list-group push">
        <template v-for="(payment_name, payment_key) in payments">
          <a
            :key="payment_key"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': payment_key == selectedMethodKey }"
            href="javascript:void(0)"
            @click="choose(payment_name, payment_key)"
          >
            {{ payment_name | uppercase }}
          </a>
        </template>
      </div>
      <div
        v-if="payments.length == 0"
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
      payments: this.$vars.payment_method,
      selectedMethodKey: '',
      selectedMethodName: ''
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    clear () {
      this.selectedMethodKey = null
      this.selectedMethodName = null
      this.$emit('choosen', {
        key: this.selectedMethodKey,
        name: this.selectedMethodName
      })
      this.close()
    },
    choose (name, key) {
      this.selectedMethodKey = key
      this.selectedMethodName = name
      this.$emit('choosen', {
        key: this.formatKey(this.selectedMethodKey),
        name: this.selectedMethodName
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
    },
    formatKey (key) {
      return key.replace('_', '-')
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
