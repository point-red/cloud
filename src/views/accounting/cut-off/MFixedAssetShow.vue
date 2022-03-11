<template>
  <div>
    <sweet-modal
      ref="modal"
      width="100%"
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
              <th>{{ $t('asset') }}</th>
              <th>{{ $t('supplier') }}</th>
              <th>{{ $t('location') }}</th>
              <th>{{ $t('purchase date') }}</th>
              <th>{{ $t('quantity') }}</th>
              <th>{{ $t('price') }}</th>
              <th>{{ $t('acquisition cost') }}</th>
              <th>{{ $t('accumulated depreciation') }}</th>
              <th>{{ $t('book value') }}</th>
            </tr>
            <template slot="p-body">
              <tr
                v-for="(row, i) in cutOff.cut_off_details"
                slot="p-body"
                :key="i"
              >
                <td>
                  {{ row.cutoffable && row.cutoffable.fixed_asset && row.cutoffable.fixed_asset.name }}
                </td>
                <td>
                  {{ row.cutoffable && row.cutoffable.supplier && row.cutoffable.supplier.name }}
                </td>
                <td>
                  {{ row.cutoffable && row.cutoffable.location }}
                </td>
                <td>
                  {{ row.cutoffable.purchase_date | dateFormat('DD MMM YYYY') }}
                </td>
                <td>
                  {{ row.cutoffable.quantity | numberFormat }}
                </td>
                <td>
                  {{ row.cutoffable.price | numberFormat }}
                </td>
                <td>
                  {{ row.cutoffable.total | numberFormat }}
                </td>
                <td>
                  {{ row.cutoffable.accumulation | numberFormat }}
                </td>
                <td>
                  {{ row.cutoffable.book_value | numberFormat }}
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
          includes: 'cutOffDetails.cutoffable.fixedAsset;cutOffDetails.cutoffable.supplier'
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
