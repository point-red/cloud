<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('add area value') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <p-form-row
            id="description"
            ref="description"
            v-model="scale.description"
            :label="$t('description')"
            name="description"
          />
          <p-form-row
            id="value"
            v-model="scale.value"
            name="value"
            :label="$t('value')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="value"
                v-model="scale.value"
                name="value"
                :is-text-right="false"
                :label="$t('value')"
              />
            </div>
          </p-form-row>
        </div>
      </div>
      <div class="pull-right">
        <button
          type="button"
          class="btn btn-sm btn-primary mr-5"
          @click="updated()"
        >
          {{ $t('save') | uppercase }}
        </button>
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
export default {
  data () {
    return {
      index: null,
      scale: {
        id: null,
        description: null,
        value: null
      },
      scales: [{
        id: null,
        description: null,
        value: null
      }]
    }
  },
  methods: {
    updated () {
      if (!this.scale.value || this.scale.value == 0) {
        this.$notification.error('Value is invalid')
        return
      }

      this.$emit('updated', { index: this.index, scale: this.scale })
      this.close()
    },
    open (index, scale, scales) {
      this.$refs.modal.open()
      this.index = index
      if (scale) {
        this.scale = scale
      }
      this.scales = scales
    },
    close () {
      this.index = null
      this.scale = {
        id: null,
        description: null,
        value: null
      }
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>
