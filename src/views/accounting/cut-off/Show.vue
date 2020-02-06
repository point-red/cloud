<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">
        <router-link to="/accounting/cut-off" class="breadcrumb-item">{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ cutOff.form.number }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <form
          class="row"
          @submit.prevent="onSubmit">
          <p-block :title="$t('cut off')" :header="false">
            <p-block-inner :is-loading="isLoading">
              <h5>{{ $t('cut off') | uppercase }} </h5>
              <p-form-row
                id="date"
                :label="$t('date')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ cutOff.form.date | dateFormat('DD MMMM YYYY') }} <span style="font-size:10px">({{ cutOff.form.date | dateFormat('HH:mm') }})</span>
                </div>
              </p-form-row>
              <p-form-row
                id="number"
                :label="$t('number')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ cutOff.form.number }}
                </div>
              </p-form-row>
              <hr>
              <p-table>
                <tr slot="p-head">
                  <th>Number</th>
                  <th>Name</th>
                  <th class="text-right">Debit</th>
                  <th class="text-right">Credit</th>
                </tr>
                <tr
                  v-for="cutOffDetail in cutOff.details"
                  :key="cutOffDetail.id"
                  slot="p-body">
                  <td>{{ cutOffDetail.chart_of_account.number }}</td>
                  <td>{{ cutOffDetail.chart_of_account.name }}</td>
                  <td class="text-right">{{ cutOffDetail.debit | numberFormat }}</td>
                  <td class="text-right">{{ cutOffDetail.credit | numberFormat }}</td>
                </tr>
                <tr slot="p-body">
                  <td></td>
                  <td></td>
                  <td class="text-right font-w600">{{ cutOff.totalDebit | numberFormat }}</td>
                  <td class="text-right font-w600">{{ cutOff.totalCredit | numberFormat }}</td>
                </tr>
              </p-table>
              <div class="row mt-50">
                <div class="col-sm-6">
                  <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
                  <div style="white-space: pre-wrap;">{{ cutOff.form.notes }}</div>
                  <div class="d-sm-block d-md-none mt-10"></div>
                </div>
                <div class="col-sm-3 text-center">
                  <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
                  <div class="mb-50" style="font-size:11px">{{ cutOff.form.date | dateFormat('DD MMMM YYYY') }}</div>
                  {{ cutOff.form.created_by.full_name | uppercase }}
                  <div class="d-sm-block d-md-none mt-10"></div>
                </div>
                <div class="col-sm-3 text-center">
                  <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
                  <div class="mb-50" style="font-size:11px">
                    <template v-if="cutOff.approvers[0].approval_at">
                      {{ cutOff.approvers[0].approval_at | dateFormat('DD MMMM YYYY') }}
                    </template>
                    <template v-else>
                      _______________
                    </template>
                  </div>
                  {{ cutOff.approvers[0].requested_to.first_name | uppercase }} {{ cutOff.approvers[0].requested_to.last_name | uppercase }}
                  <div style="font-size:11px">{{ cutOff.approvers[0].requested_to.email | lowercase }}</div>
                </div>
                <div class="col-sm-12">
                  <hr>
                  <!-- <router-link :to="{ name: 'purchase.request.edit', params: { id: cutOff.id }}" class="btn btn-sm btn-primary mr-5">
                    {{ $t('edit') | uppercase }}
                  </router-link> -->
                  <button class="btn btn-sm btn-danger mb-10" :disabled="isLoading" @click="remove">
                    <i v-show="isLoading" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
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
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    TabMenu
  },
  computed: {
    ...mapGetters('accountingCutOff', ['cutOff'])
  },
  methods: {
    ...mapActions('accountingCutOff', ['find', 'delete']),
    remove () {
      this.isLoading = true
      this.delete({ id: this.id })
        .then((response) => {
          this.isLoading = false
          this.$notification.success('Delete success')
          this.$router.replace('/accounting/cut-off')
        }, (error) => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        with_archives: true,
        with_origin: true,
        includes: 'form;details.chartOfAccount;approvers.requestedBy;approvers.requestedTo'
      }
    }).then((response) => {
      this.isLoading = false
    }, (error) => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
