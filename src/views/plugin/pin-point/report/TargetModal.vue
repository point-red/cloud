<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        :id="id"
        ref="target"
        :is-loading="isLoading"
        :title="'Target' | uppercase"
      >
        <template slot="content">
          <p-form-row
            id="date"
            name="date"
            :label="$t('period')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-date-picker
                id="date"
                v-model="date"
                name="date"
                type="date"
                @input="changeDate"
              />
            </div>
          </p-form-row>
          <p-table>
            <tr
              v-show="targets.length > 0"
              slot="p-head"
              class="bg-info-light"
            >
              <th>Sales</th>
              <th>Call</th>
              <th>Effective Call</th>
              <th>Value</th>
            </tr>
            <tr
              v-for="target in form.targets"
              slot="p-body"
              :key="target.id"
            >
              <td class="no-wrap">
                {{ target.first_name }} {{ target.last_name }}
              </td>
              <td>
                <p-form-number
                  id="call"
                  v-model="target.call"
                  :is-text-right="true"
                  name="call"
                  :errors="form.errors.get('call')"
                  @errors="form.errors.set('call', null)"
                />
              </td>
              <td>
                <p-form-number
                  id="effective-call"
                  v-model="target.effective_call"
                  :is-text-right="true"
                  name="effectiveCall"
                  :errors="form.errors.get('effectiveCall')"
                  @errors="form.errors.set('effectiveCall', null)"
                />
              </td>
              <td>
                <p-form-number
                  id="value"
                  v-model="target.value"
                  :is-text-right="true"
                  name="value"
                  :errors="form.errors.get('value')"
                  @errors="form.errors.set('value', null)"
                />
              </td>
            </tr>
          </p-table>
        </template>
        <template slot="footer">
          <button
            v-show="!isLoading"
            type="submit"
            class="btn btn-primary"
            :disabled="isSaving"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
          </button>
          <button
            :disabled="isSaving"
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="close"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('close') | uppercase }}
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
      isLoading: false,
      isSaving: false
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
      this.isLoading = true
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
        this.isLoading = false
      }, (error) => {
        this.isLoading = false
        this.$notification.error('Create failed', error.message)
      })
      this.$refs.target.show()
    },
    close () {
      this.form.reset()
      this.$refs.target.close()
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then((response) => {
          this.$notification.success('Set target success')
          this.isSaving = false
          this.form.reset()
          this.getReport({
            params: {
              date_from: this.dateFrom,
              date_to: this.dateTo
            }
          })
        }, (error) => {
          this.$notification.error('Set target failed', error.message)
          this.isSaving = false
        })
    },
    changeDate () {
      this.isLoading = true
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
        this.isLoading = false
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
