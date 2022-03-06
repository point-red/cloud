<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('detail form') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <hr>
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
      >
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>{{ type ? $t(type.toLowerCase()) : '' }}</th>
              <th>{{ $t(getTypeLabel()) }}</th>
              <th>{{ $t('amount') }}</th>
              <th>{{ $t('notes') }}</th>
            </tr>
            <template slot="p-body">
              <tr
                v-for="(row, i) in cutOff.cut_off_details"
                slot="p-body"
                :key="i"
              >
                <td>
                  {{ row.cutoffable[getPolyName()] && row.cutoffable[getPolyName()].name }}
                </td>
                <td>
                  {{ row.cutoffable.date | dateFormat('DD MMM YYYY') }}
                </td>
                <td>
                  {{ row.cutoffable.amount | numberFormat }}
                </td>
                <td>
                  {{ row.cutoffable.notes }}
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PointTable from 'point-table-vue'

export default {
  components: {
    PointTable
  },
  data () {
    return {
      index: null,
      items: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false,
      chartOfAccount: null,
      type: null
    }
  },
  computed: {
    ...mapGetters('accountingCutOff', ['cutOff'])
  },
  watch: {
    label () {
      this.mutableLabel = this.label
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('accountingCutOff', ['find']),
    getTypeLabel () {
      if (!this.chartOfAccount) return ''
      if (this.chartOfAccount.position === 'CREDIT') return 'date payable'

      return 'date receivable / invoice date'
    },
    getPolyName () {
      if (this.chartOfAccount && this.chartOfAccount.type.name.indexOf('DOWN PAYMENT') > -1 &&
        ['CUSTOMER', 'SUPPLIER', 'EXPEDITION', 'EMPLOYEE'].indexOf(this.type) > -1) {
        return 'cutoff_downpaymentable'
      } else if (['CUSTOMER', 'SUPPLIER', 'EXPEDITION', 'EMPLOYEE'].indexOf(this.type) > -1) {
        return 'cutoff_paymentable'
      }
    },
    open (cutoff) {
      this.chartOfAccount = cutoff.chart_of_account
      this.type = cutoff.chart_of_account.sub_ledger.trim()
      this.items = cutoff.items
      this.$refs.modal.open()
      this.getDetail(cutoff.id)
    },
    getDetail (id) {
      this.isLoading = true
      this.find({
        id,
        params: {
          includes: 'cutOffDetails.cutoffable.' + this.getPolyName()
        }
      }).then((response) => {
        this.isLoading = false
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
