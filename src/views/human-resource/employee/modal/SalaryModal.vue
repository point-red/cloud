<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitContract">
      <p-modal
        ref="salaryModal"
        :id="id"
        :title="title">
        <template slot="content">
          <p-form-row
            id="salary-date"
            :label="$t('salary date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                name="salary-date"
                v-model="salary_date"/>
            </div>
          </p-form-row>

          <p-form-row
            id="salary"
            name="salary"
            :label="$t('salary')"
            v-model="salary">
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
    show () {
      this.$refs.salaryModal.show()
    },
    close () {
      this.$refs.salaryModal.close()
    },
    onSubmitContract () {
      this.$emit('add', {
        date: this.salary_date,
        salary: this.salary
      })
      this.salary = ''
      this.$refs.salaryModal.close()
    }
  }
}
</script>
