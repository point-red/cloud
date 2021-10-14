<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('journal') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :title="$t('journal')"
        :header="false"
      >
        <p-form-row
          id="date"
          :label="$t('date')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              v-model="date"
              name="date"
              @input="load"
            />
          </div>
        </p-form-row>
        <hr>
        <div
          class="block"
          :class="{ 'block-mode-loading' : isLoading }"
        >
          <div class="block-content block-content-inner row">
            <div class="col-sm-12">
              <p-table>
                <tr slot="p-head">
                  <th>Date</th>
                  <th>Form</th>
                  <th>Account</th>
                  <th class="text-right">
                    Debit
                  </th>
                  <th class="text-right">
                    Credit
                  </th>
                </tr>
                <template v-for="(journal, index) in journals">
                  <tr
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ journal.form.date | dateFormat('D MMM Y') }}</td>
                    <td>{{ journal.form.number }}</td>
                    <td>{{ journal.chart_of_account.number }} {{ journal.chart_of_account.alias }}</td>
                    <td class="text-right">
                      {{ journal.debit | numberFormat }}
                    </td>
                    <td class="text-right">
                      {{ journal.credit | numberFormat }}
                    </td>
                  </tr>
                </template>
              </p-table>
            </div>
          </div>
        </div>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  data () {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('accountingJournal', ['journals'])
  },
  created () {
    this.load()
  },
  methods: {
    ...mapActions('accountingJournal', ['get']),
    load () {
      this.isLoading = true
      this.get({
        params: {
          date: this.date,
          includes: 'chartOfAccount;form',
          limit: 1000
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
