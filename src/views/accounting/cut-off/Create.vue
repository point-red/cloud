<template>
  <div>
    <breadcrumb>
      <router-link
        to="/accounting/cut-off"
        class="breadcrumb-item">Cut Off</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <div class="row gutters-tiny">
      <p-box
        :name="$t('add')"
        icon="si si-plus"
        v-if="$permission.has('create employee')"
        link="/accounting/cut-off/create"/>
      <p-box
        :name="$t('list')"
        icon="si si-docs"
        v-if="$permission.has('read employee')"
        link="/accounting/cut-off"/>
    </div>

    <hr>

    <div class="row">
      <div class="col-sm-12">
        <form
          class="row"
          @submit.prevent="onSubmit">
          <p-block :title="$t('cut off')" :header="true">
            <p-block-inner :is-loading="loading">
              <p-form-row
                id="date"
                :label="$t('date')">
                <div slot="body" class="col-lg-9">
                  <p-date-picker
                    name="date"
                    v-model="form.date"/>
                </div>
              </p-form-row>
              <hr>
              <p-table>
                <tr slot="p-head">
                  <th>Number</th>
                  <th>Name</th>
                  <th>Debit</th>
                  <th>Credit</th>
                </tr>
                <tr
                  v-for="(chartOfAccount, index) in chartOfAccounts"
                  :key="index"
                  slot="p-body">
                  <td>{{ chartOfAccount.number }}</td>
                  <td>{{ chartOfAccount.name }}</td>
                  <td>
                    <p-form-number
                      :id="'debit-' + index"
                      value="0"
                      @input.native="debit($event)"
                      :disabled="loadingSaveButton"
                      :is-text-right="true"
                      name="debit[]"/>
                  </td>
                  <td>
                    <p-form-number
                      :id="'credit-' + index"
                      value="0"
                      @input.native="credit($event)"
                      :disabled="loadingSaveButton"
                      :is-text-right="true"
                      name="credit[]"/>
                  </td>
                </tr>
                <tr slot="p-body">
                  <td></td>
                  <td></td>
                  <td>
                    <p-form-number
                      id="total-debit"
                      v-model="totalDebit"
                      :disabled="true"
                      :is-text-right="true"
                      name="total_debit"
                      :errors="form.errors.get('total_debit')"
                      @errors="form.errors.set('total_debit', null)"/>
                  </td>
                  <td>
                    <p-form-number
                      id="total-credit"
                      v-model="totalCredit"
                      :disabled="true"
                      :is-text-right="true"
                      name="total_credit"
                      :errors="form.errors.get('total_credit')"
                      @errors="form.errors.set('total_credit', null)"/>
                  </td>
                </tr>
              </p-table>
              <button class="btn btn-sm btn-primary mb-10" :disabled="loadingSaveButton">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
              </button>
            </p-block-inner>
          </p-block>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        date: new Date(),
        details: []
      }),
      totalDebit: 0,
      totalCredit: 0
    }
  },
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters('ChartOfAccount', ['chartOfAccounts'])
  },
  methods: {
    ...mapActions('ChartOfAccount', {
      getChartOfAccounts: 'get'
    }),
    ...mapActions('CutOff', {
      storeCutOff: 'create'
    }),
    debit (event) {
      var chartOfAccountIndex = event.target.id.split('-')[1]
      this.form.details[chartOfAccountIndex].debit = event.target.value.split(',').join('')
      this.calculate()
    },
    credit (event) {
      var chartOfAccountIndex = event.target.id.split('-')[1]
      this.form.details[chartOfAccountIndex].credit = event.target.value.split(',').join('')
      this.calculate()
    },
    onSubmit () {
      this.loadingSaveButton = true
      if (this.totalDebit === this.totalCredit) {
        // Balance
        this.storeCutOff(this.form)
          .then((response) => {
            this.loadingSaveButton = false
            this.getChartOfAccounts()
              .then((response) => {
                this.$set(this.form, 'details', response.data)
              })
            this.form.reset()
            this.totalDebit = 0
            this.totalCredit = 0
            this.$notification.success('Create success')
            this.$router.replace('/accounting/cut-off/' + response.data.id)
          }, (error) => {
            this.loadingSaveButton = false
            this.$notification.error(error.message)
          })
      } else {
        // Unbalance
        this.loadingSaveButton = false
        this.$notification.error('Journal unbalance')
      }
    },
    calculate () {
      this.totalDebit = 0
      this.totalCredit = 0
      this.form.details.forEach(element => {
        this.totalCredit += parseFloat(element.credit)
        this.totalDebit += parseFloat(element.debit)
      })
    }
  },
  created () {
    this.loading = true
    this.getChartOfAccounts()
      .then((response) => {
        this.loading = false
        this.$set(this.form, 'details', response.data)
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
