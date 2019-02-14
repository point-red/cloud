<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitBaseSalary">
      <p-modal
        ref="baseSalaryModal"
        :id="id"
        :title="title">
        <template slot="content">
          <p-form-row
            id="base-salary-year"
            :label="$t('salary year')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                name="base-salary-year"
                type="year"
                format="YYYY"
                placeholder="Select Year"
                v-model="year"/>
            </div>
          </p-form-row>

          <p-form-row
            id="base-salary"
            name="base-salary"
            :label="$t('base salary')">
            <div slot="body" class="col-lg-9">
              <p-form-number
                v-model="salary"
                :is-text-right="false"/>
            </div>
          </p-form-row>
        </template>
        <template slot="footer">
          <button class="btn btn-primary">Add</button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      year: '',
      salary: null
    }
  },
  watch: {
    'baseSalary' () {
      this.$emit('value', this.baseSalary)
    }
  },
  methods: {
    show () {
      this.$refs.baseSalaryModal.show()
    },
    close () {
      this.$refs.baseSalaryModal.close()
    },
    onSubmitBaseSalary () {
      this.$emit('add', {
        year: this.year,
        salary: this.salary
      })
      this.baseSalary = ''
      this.$refs.baseSalaryModal.close()
    }
  }
}
</script>
