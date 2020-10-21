<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitContract"
    >
      <sweet-modal
        ref="modal"
        :title="$t('add salary history') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <p-form-row
          id="salary-date"
          :label="$t('salary date')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              v-model="salary_date"
              name="salary-date"
            />
          </div>
        </p-form-row>

        <p-form-row
          id="salary"
          name="salary"
          :label="$t('salary')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-form-number
              v-model="salary"
              :is-text-right="false"
            />
          </div>
        </p-form-row>

        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
          >
            {{ $t('save') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      salary_date: '',
      salary: null
    }
  },
  watch: {
    'salary' () {
      this.$emit('value', this.salary)
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close')
    },
    onSubmitContract () {
      this.$emit('add', {
        date: this.salary_date,
        salary: this.salary
      })
      this.salary = ''
      this.$refs.modal.close()
    }
  }
}
</script>
