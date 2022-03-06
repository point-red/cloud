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
              <th>{{ $t('item group') }}</th>
              <th>{{ $t('warehouse') }}</th>
              <th>{{ $t('item') }}</th>
              <th>{{ $t('production number') }}</th>
              <th>{{ $t('expiry date') }}</th>
              <th>{{ $t('quantity') }}</th>
              <th>{{ $t('amount') }}</th>
            </tr>
            <template slot="p-body">
              <template
                v-for="(row, i) in cutOff.cut_off_details"
              >
                <template v-if="row.cutoffable && row.cutoffable.dna && row.cutoffable.dna.length > 0">
                  <tr
                    v-for="(dna, ii) in row.cutoffable.dna"
                    :key="ii"
                  >
                    <td>
                      {{ row.cutoffable && row.cutoffable.item && row.cutoffable.item.groups && row.cutoffable.item.groups[0] && row.cutoffable.item.groups[0].name }}
                    </td>
                    <td>
                      {{ row.cutoffable && row.cutoffable.warehouse && row.cutoffable.warehouse.name }}
                    </td>
                    <td>
                      {{ row.cutoffable && row.cutoffable.item && row.cutoffable.item.name }}
                    </td>
                    <td>
                      {{ dna.production_number }}
                    </td>
                    <td>
                      {{ dna.expiry_date }}
                    </td>
                    <td>
                      {{ dna.quantity | numberFormat }} {{ row.cutoffable.unit }}
                    </td>
                    <td>
                      {{ row.cutoffable.total | numberFormat }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr
                    :key="i"
                  >
                    <td>
                      {{ row.cutoffable && row.cutoffable.item && row.cutoffable.item.groups && row.cutoffable.item.groups[0] && row.cutoffable.item.groups[0].name }}
                    </td>
                    <td>
                      {{ row.cutoffable && row.cutoffable.warehouse && row.cutoffable.warehouse.name }}
                    </td>
                    <td>
                      {{ row.cutoffable && row.cutoffable.item && row.cutoffable.item.name }}
                    </td>
                    <td>
                      -
                    </td>
                    <td>
                      {{ row.cutoffable && row.cutoffable.dna && row.cutoffable.dna.expiry_date || "-" }}
                    </td>
                    <td>
                      {{ row.cutoffable.quantity | numberFormat }} {{ row.cutoffable.unit }}
                    </td>
                    <td>
                      {{ row.cutoffable.total | numberFormat }}
                    </td>
                  </tr>
                </template>
              </template>
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
          includes: 'cutOffDetails.cutoffable.item.groups;cutOffDetails.cutoffable.warehouse;cutOffDetails.cutoffable.dna'
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
