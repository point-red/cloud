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
            id="year"
            v-model="areaValue.year"
            name="year"
            :label="$t('year')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="year"
                v-model="areaValue.year"
                name="year"
                :is-text-right="false"
                :label="$t('year')"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="value"
            v-model="areaValue.value"
            name="value"
            :label="$t('value')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="value"
                v-model="areaValue.value"
                name="value"
                :is-text-right="false"
                :label="$t('value')"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="notes"
            ref="notes"
            v-model="areaValue.notes"
            :label="$t('notes')"
            name="notes"
          />
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
      areaValue: {
        id: null,
        year: null,
        value: null,
        notes: null
      },
      areaValues: [{
        id: null,
        year: null,
        value: null,
        notes: null
      }]
    }
  },
  methods: {
    updated () {
      const yearToCheck = this.areaValue.year

      const isDuplicate = this.areaValues.some((item, idx) =>
        item.year === yearToCheck && idx !== this.index
      )

      if (isDuplicate) {
        this.$notification.error('Year already exist')
        return
      }

      if (!this.areaValue.value || this.areaValue.value == 0) {
        this.$notification.error('Value is invalid')
        return
      }

      this.$emit('updated', { index: this.index, areaValue: this.areaValue })
      this.close()
    },
    open (index, areaValue, areaValues) {
      this.$refs.modal.open()
      this.index = index
      if (areaValue) {
        this.areaValue = areaValue
      }
      this.areaValues = areaValues
    },
    close () {
      this.index = null
      this.areaValue = {
        id: null,
        year: null,
        value: null,
        notes: null
      }
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>
