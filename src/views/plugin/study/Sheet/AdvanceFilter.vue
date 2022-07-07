<template>
  <div>
    <div class="text-center font-size-sm mb-10">
      <a
        href="javascript:void(0)"
        @click="isExpanded = !isExpanded"
      >
        {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
      </a>
    </div>
    <div
      v-show="isExpanded"
      class="card"
      :class="{ 'fadeIn': isExpanded }"
    >
      <div class="row">
        <div class="col-sm-6 col-md text-center">
          <p-form-row
            id="date-start"
            name="date-start"
            :label="$t('date start')"
            :is-horizontal="false"
          >
            <div slot="body">
              <p-date-picker v-model="date_from" />
            </div>
          </p-form-row>
        </div>
        <div class="col-sm-6 col-md text-center">
          <p-form-row
            id="date-end"
            name="date-end"
            :label="$t('date end')"
            :is-horizontal="false"
          >
            <div slot="body">
              <p-date-picker v-model="date_to" />
            </div>
          </p-form-row>
        </div>
        <div class="col-sm-6 col-md text-center">
          <p-form-row
            id="subject"
            name="subject"
            :label="$t('study subject')"
            :is-horizontal="false"
          >
            <div slot="body">
              <select-subject v-model="subject_id" />
            </div>
          </p-form-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectSubject from '../SelectSubject.vue'
export default {
  name: 'PluginStudyAdvanceFilter',
  components: {
    SelectSubject
  },
  data () {
    return {
      isExpanded: false,
      date_from: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
      date_to: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59'),
      subject_id: this.$route.query.subject_id ?? ''
    }
  },
  watch: {
    date_from () {
      const dateFrom = this.$moment(this.date_from)
      const dateTo = this.$moment(this.date_to)
      if (dateFrom.isAfter(dateTo)) {
        this.date_to = this.date_from
      }
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date_from,
          date_to: this.date_to
        }
      })
      this.$emit('change')
    },
    date_to () {
      const dateFrom = this.$moment(this.date_from)
      const dateTo = this.$moment(this.date_to)
      if (dateFrom.isAfter(dateTo)) {
        this.date_from = this.date_to
      }
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date_from,
          date_to: this.date_to
        }
      })
      this.$emit('change')
    },
    subject_id () {
      this.$router.push({
        query: {
          ...this.$route.query,
          subject_id: this.subject_id ? this.subject_id : undefined
        }
      })
      this.$emit('change')
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>
