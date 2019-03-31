<template>
  <div>
    <breadcrumb>
      <router-link
        to="/accounting/cut-off"
        class="breadcrumb-item">Cut Off</router-link>
      <span class="breadcrumb-item active">{{ cutOff.number }}</span>
    </breadcrumb>

    <tab-menu/>

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
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ cutOff.date | dateFormat }}
                </div>
              </p-form-row>
              <p-form-row
                id="number"
                :label="$t('number')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ cutOff.number }}
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
                  <td>{{ cutOffDetail.chartOfAccount.number }}</td>
                  <td>{{ cutOffDetail.chartOfAccount.name }}</td>
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
              <button class="btn btn-sm btn-danger mb-10" :disabled="loadingSaveButton" @click="remove">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Delete
              </button>
            </p-block-inner>
          </p-block>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingSaveButton: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  computed: {
    ...mapGetters('accountingCutOff', ['cutOff'])
  },
  methods: {
    ...mapActions('accountingCutOff', ['find', 'delete']),
    remove () {
      this.loadingSaveButton = true
      this.delete({ id: this.id })
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.success('Delete success')
          this.$router.replace('/accounting/cut-off')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    this.loading = true
    this.find({ id: this.id })
      .then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
