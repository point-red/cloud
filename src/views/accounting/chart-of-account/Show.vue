<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <router-link to="/accounting/chart-of-account" class="breadcrumb-item">{{ $t('chart of account') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ chartOfAccount.label }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-lg-4">
        <div class="row">
          <p-block :title="'chart of account'" :header="false">
            <p-block-inner :is-loading="isLoading">
              <p-form-row
                id="account-type"
                name="account-type"
                :is-horizontal="false"
                :label="$t('account type')">
                <div slot="body" class="col-lg-9 mt-5">
                  {{ chartOfAccount.type.alias }}
                </div>
              </p-form-row>

              <p-form-row
                id="sub_ledger"
                :label="$t('sub ledger')"
                :is-horizontal="false"
                v-if="chartOfAccount.sub_ledger != null"
                name="sub_ledger">
                <div slot="body" class="col-lg-9 mt-5">
                  {{ chartOfAccount.sub_ledger }}
                </div>
              </p-form-row>

              <p-form-row
                id="number"
                :label="$t('number')"
                :is-horizontal="false"
                name="number">
                <div slot="body" class="col-lg-9 mt-5">
                  {{ chartOfAccount.number }}
                </div>
              </p-form-row>

              <p-form-row
                id="name"
                :label="$t('name')"
                :is-horizontal="false"
                name="name">
                <div slot="body" class="col-lg-9 mt-5">
                  {{ chartOfAccount.alias }}
                </div>
              </p-form-row>

              <p-form-row
                id="position"
                :label="$t('position')"
                :is-horizontal="false"
                name="position">
                <div slot="body" class="col-lg-9 mt-5">
                  {{ chartOfAccount.position }}
                </div>
              </p-form-row>

              <p-form-row
                id="cash_flow"
                :disabled="isLoading"
                :label="$t('cash flow')"
                :is-horizontal="false"
                name="cash_flow"
                v-if="chartOfAccount.cash_flow != null">
                <div slot="body" class="col-lg-9">
                  {{ chartOfAccount.cash_flow }}
                </div>
              </p-form-row>

              <p-form-row
                id="cash_flow_position"
                :disabled="isLoading"
                :label="$t('cash flow position')"
                :is-horizontal="false"
                name="cash_flow_position"
                v-if="chartOfAccount.cash_flow != null">
                <div slot="body" class="col-lg-9">
                  {{ chartOfAccount.cash_flow_position }}
                </div>
              </p-form-row>

              <hr>

              <router-link
                :to="{ path: '/accounting/chart-of-account/' + chartOfAccount.id + '/edit', params: { id: chartOfAccount.id }}"
                v-if="$permission.has('update chart of account')"
                class="btn btn-sm btn-primary mr-5">
                {{ $t('edit') | uppercase }}
              </router-link>
              <button
                type="button"
                @click="onDelete()"
                v-if="$permission.has('delete chart of account')"
                :disabled="isDeleting || chartOfAccount.is_locked == true"
                class="btn btn-sm btn-outline-secondary">
                <i class="fa fa-lock" v-if="chartOfAccount.is_locked"></i>
                <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
              </button>
            </p-block-inner>
          </p-block>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="row">
          <p-block :title="'chart of account'" :header="false">
            <p-block-inner :is-loading="isLoading">
              <point-table>
                <tr slot="p-head">
                  <th></th>
                  <th>Notes</th>
                  <th class="text-right">Debit</th>
                  <th class="text-right">Credit</th>
                </tr>
                <tr
                  slot="p-body"
                  v-for="(journal, index) in journals"
                  :key="index">
                  <th>{{ $index + 1 }}</th>
                  <td>{{ journal.notes }}</td>
                  <td class="text-right">{{ journal.debit }}</td>
                  <td class="text-right">{{ journal.credit }}</td>
                </tr>
              </point-table>
            </p-block-inner>
          </p-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chartOfAccount']),
    ...mapGetters('accountingJournal', ['journals'])
  },
  methods: {
    ...mapActions('accountingChartOfAccount', ['find', 'delete']),
    ...mapActions('accountingJournal', ['get']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/accounting/chart-of-account')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this account')
        })
      })
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then(response => {
        this.isLoading = false
        this.find({
          id: this.id
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    this.get({
      chart_of_account_id: this.id
    })
  }
}
</script>
