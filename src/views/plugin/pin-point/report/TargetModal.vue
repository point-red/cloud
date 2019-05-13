<template>
  <div>
    <form class="row" @submit.prevent="onSubmit">
      <p-modal ref="target" :id="id" :is-loading="loading" :title="'Target' | uppercase">
        <template slot="content">
          <p-form-row id="date" name="date" :label="$t('period')">
            <div slot="body" class="col-lg-9">
              <p-date-picker id="date" name="date" type="date" v-model="date" @input="changeDate"/>
            </div>
          </p-form-row>
          <p-table>
            <tr slot="p-head" v-show="targets.length > 0" class="bg-info-light">
              <th>Sales</th>
              <th>Call</th>
              <th>Effective Call</th>
              <th>Value</th>
            </tr>
            <tr
              v-for="target in form.targets"
              slot="p-body"
              :key="target.id">
              <td class="no-wrap">{{ target.first_name }} {{ target.last_name }}</td>
              <td>
                <p-form-number
                  id="call"
                  v-model="target.call"
                  :is-text-right="true"
                  name="call"
                  :errors="form.errors.get('call')"
                  @errors="form.errors.set('call', null)"/>
              </td>
              <td>
                <p-form-number
                  id="effective-call"
                  v-model="target.effective_call"
                  :is-text-right="true"
                  name="effectiveCall"
                  :errors="form.errors.get('effectiveCall')"
                  @errors="form.errors.set('effectiveCall', null)"/>
              </td>
              <td>
                <p-form-number
                  id="value"
                  v-model="target.value"
                  :is-text-right="true"
                  name="value"
                  :errors="form.errors.get('value')"
                  @errors="form.errors.set('value', null)"/>
              </td>
            </tr>
          </p-table>
        </template>
        <template slot="footer">
          <button type="submit" class="btn btn-primary" :disabled="loadingSaveButton" v-show="!loading">
            <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
          </button>
          <button :disabled="loadingSaveButton" type="button" class="btn btn-outline-danger" @click="close">
            <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Close
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: new Form({
        date: this.$moment(),
        targets: []
      }),
      date: this.$moment(),
      dateFrom: this.$moment(),
      dateTo: this.$moment(),
      loading: false,
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapGetters('pluginPinPointSalesVisitationTarget', ['targets'])
  },
  methods: {
    ...mapActions('pluginPinPointSalesVisitationTarget', {
      get: 'get',
      create: 'create'
    }),
    ...mapActions('pluginPinPointReportPerformance', {
      getReport: 'get'
    }),
    show (dateFrom, dateTo) {
      this.loading = true
      this.dateFrom = dateFrom
      this.dateTo = dateTo
      this.get({
        params: {
          date: this.date
        }
      }).then((response) => {
        this.form = new Form({
          date: this.$moment(),
          targets: response.data
        })
        this.form.targets.forEach(element => {
          element.date = this.date
          element.value = parseFloat(element.value)
        })
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notification.error('Create failed', error.message)
      })
      this.$refs.target.show()
    },
    close () {
      this.form.reset()
      this.$refs.target.close()
    },
    onSubmit () {
      this.loadingSaveButton = true
      this.create(this.form)
        .then((response) => {
          this.$notification.success('Set target success')
          this.loadingSaveButton = false
          this.form.reset()
          this.getReport({
            params: {
              date_from: this.dateFrom,
              date_to: this.dateTo
            }
          })
        }, (error) => {
          this.$notification.error('Set target failed', error.message)
          this.loadingSaveButton = false
        })
    },
    changeDate () {
      this.loading = true
      this.get({
        params: {
          date: this.date
        }
      }).then((response) => {
        this.form = new Form({
          date: this.$moment(),
          targets: response.data
        })
        this.form.targets.forEach(element => {
          element.date = this.date
          element.value = parseFloat(element.value)
        })
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
