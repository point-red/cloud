<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">
        <router-link to="/accounting/cut-off" class="breadcrumb-item">{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <form class="row" @submit.prevent="onSubmit">
          <p-block :title="$t('cut off')" :header="false">
            <p-block-inner :is-loading="isLoading">
              <p-form-row
                id="date"
                :is-horizontal="false"
                :label="$t('date')">
                <div slot="body">
                  <p-date-picker name="date" v-model="form.date"/>
                </div>
              </p-form-row>
              <hr>
              <p-table>
                <tr slot="p-head">
                  <th>#</th>
                  <th>Account</th>
                  <th>Debit</th>
                  <th>Credit</th>
                </tr>
                <tr
                  v-for="(chartOfAccount, index) in chartOfAccounts"
                  :key="index"
                  slot="p-body">
                  <td>{{ index + 1 }}</td>
                  <td>{{ chartOfAccount.number }} - {{ chartOfAccount.alias }}</td>
                  <td>
                    <p-form-number
                      :id="'debit-' + index"
                      value="0"
                      @input.native="debit($event, index)"
                      :disabled="isSaving"
                      :is-text-right="true"
                      name="debit[]"/>
                  </td>
                  <td>
                    <p-form-number
                      :id="'credit-' + index"
                      value="0"
                      @input.native="credit($event, index)"
                      :disabled="isSaving"
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
              <div class="row mt-50">
                <div class="col-sm-6">
                  <textarea rows="5" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
                  <div class="d-sm-block d-md-none mt-10"></div>
                </div>
                <div class="col-sm-3 text-center">
                  <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
                  <div class="mb-50" style="font-size:11px">{{ Date.now() | dateFormat('DD MMMM YYYY') }}</div>
                  {{ requestedBy | uppercase }}
                  <div class="d-sm-block d-md-none mt-10"></div>
                </div>
                <div class="col-sm-3 text-center">
                  <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
                  <div class="mb-50" style="font-size:11px">_______________</div>
                  <m-user
                    :id="'user'"
                    v-model="form.approver_id"
                    :errors="form.errors.get('approver_id')"
                    @errors="form.errors.set('approver_id', null)"
                    @choosen="chooseApprover"/>
                    {{ form.approver_email }} <br v-if="form.approver_email">
                </div>

                <div class="col-sm-12">
                  <hr>
                  <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                    <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
                  </button>
                </div>
              </div>
            </p-block-inner>
          </p-block>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false,
      isSaving: false,
      requestedBy: localStorage.getItem('userName'),
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD'),
        details: [],
        approver_id: null,
        approver_name: null,
        approver_email: null
      }),
      totalDebit: 0,
      totalCredit: 0
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chartOfAccounts']),
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('accountingChartOfAccount', {
      getChartOfAccounts: 'get'
    }),
    ...mapActions('accountingCutOff', {
      storeCutOff: 'create'
    }),
    debit (event, index) {
      this.form.details[index].debit = event.target.value.split(',').join('')
      this.calculate()
    },
    credit (event, index) {
      var chartOfAccountIndex = event.target.id.split('-')[1]
      this.form.details[index].credit = event.target.value.split(',').join('')
      this.calculate()
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
        })
        return
      }

      if (this.totalDebit !== this.totalCredit) {
        // Unbalance
        this.isSaving = false
        this.$notification.error('Journal unbalance')
        return
      }

      this.storeCutOff(this.form)
        .then((response) => {
          this.isSaving = false
          this.getRequest()
          this.form.reset()
          this.totalDebit = 0
          this.totalCredit = 0
          this.$notification.success('Create success')
          this.$router.replace('/accounting/cut-off/' + response.data.id)
        }, (error) => {
          this.isSaving = false
          this.$notification.error(error.message)
        })
    },
    chooseApprover (value) {
      this.form.approver_name = value.label
      this.form.approver_email = value.email
    },
    calculate () {
      this.totalDebit = 0
      this.totalCredit = 0
      this.form.details.forEach(element => {
        this.totalCredit += parseFloat(element.credit)
        this.totalDebit += parseFloat(element.debit)
      })
    },
    getRequest () {
      this.isLoading = true
      this.getChartOfAccounts({
        params: {
          limit: 99999,
          sort_by: 'number'
        }
      }).then((response) => {
        this.isLoading = false
        this.$set(this.form, 'details', response.data)
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.getRequest()
  }
}
</script>
