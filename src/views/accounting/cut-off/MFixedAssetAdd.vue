<template>
  <div>
    <sweet-modal
      ref="modal"
      width="100%"
      :title="$t('add asset') | uppercase"
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
              v-for="(row, i) in items"
              slot="p-body"
              :key="i"
            >
              <td class="align-top">
                <span
                  class="select-link"
                  @click="$refs.fixedAssetRef.open(i, {
                    chartOfAccountId,
                    accumulationChartOfAccountId: chartOfAccountId,
                    depreciationChartOfAccountId: chartOfAccountId
                  })"
                >
                  {{ row.name || $t('select') | uppercase }}
                </span>
              </td>
              <td class="align-top">
                <span
                  class="select-link"
                  :disabled="!row.object_id"
                  @click="$refs.supplierRef.open(i)"
                >{{ row.supplier_name || $t('select') | uppercase }}</span>
              </td>
              <td class="align-top">
                <p-form-input
                  :id="'location-' + i"
                  v-model="row.location"
                  :name="'location-' + i"
                  :disabled="!row.object_id"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.location']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-date-picker
                  :id="'purchase_date-' + i"
                  v-model="row.purchase_date"
                  :name="'purchase_date-' + i"
                  :disabled="!row.object_id"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.purchase_date']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'quantity-' + i"
                  v-model="row.quantity"
                  :name="'quantity-' + i"
                  :disabled="!row.object_id"
                  @keyup.native="calculate(row, i)"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.quantity']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'price-' + i"
                  v-model="row.price"
                  :name="'price-' + i"
                  :disabled="!row.object_id"
                  @keyup.native="calculate(row, i)"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.price']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'total-' + i"
                  v-model="row.total"
                  :name="'total-' + i"
                  :disabled="true"
                />
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'accumulation-' + i"
                  v-model="row.accumulation"
                  :name="'accumulation-' + i"
                  :disabled="!row.object_id || row.depreciation_method !== 'STRAIGHT_LINE'"
                  @keyup.native="calculate(row, i)"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.accumulation']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'book_value-' + i"
                  v-model="row.book_value"
                  :name="'book_value-' + i"
                  :disabled="true"
                  @keyup.native="calculate(row, i)"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.book_value']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
            </tr>
          </template>
        </point-table>

        <div class="col-sm-12">
          <hr>
          <button
            type="submit"
            class="btn btn-block btn-sm btn-primary"
            :disabled="items.length === 1 || items.find((item) => item.object_id !== null && (!item.book_value || !item.accumulation || !item.total || !item.price || !item.quantity || !item.purchase_date || !item.location || !item.supplier_id))"
            @click="choose"
          >
            {{ $t('submit') | uppercase }}
          </button>
        </div>
      </div>
    </sweet-modal>
    <m-fixed-asset
      id="fixed-asset-id"
      ref="fixedAssetRef"
      @choosen="chooseFixedAsset"
    />

    <m-supplier
      id="supplier-id"
      ref="supplierRef"
      @choosen="onChoosenSupplier"
    />
  </div>
</template>

<script>
import PointTable from 'point-table-vue'

export default {
  components: {
    PointTable
  },
  data () {
    return {
      errors: [],
      chartOfAccountId: null,
      index: null,
      items: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false,
      position: null,
      type: null
    }
  },
  computed: {
  },
  watch: {
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    this.addItemRow()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    addItemRow () {
      let isNeedNewRow = true
      this.items.forEach(element => {
        if (element.object_id == null) {
          isNeedNewRow = false
        }
      })
      if (!isNeedNewRow) return true
      this.items.push({
        object_id: null,
        name: null,
        supplier_name: null,
        location: null,
        purchase_date: null,
        price: null,
        quantity: null,
        total: null,
        accumulation: null,
        book_value: null
      })
    },
    calculate (row, index) {
      this.items[index].total = (parseInt(row.quantity, 10) * parseInt(row.price, 10))
      this.items[index].book_value = (parseInt(row.total, 10) - parseInt(row.accumulation || 0, 10))
    },
    chooseFixedAsset (fixedAsset) {
      if (fixedAsset.id == null) {
        return
      }

      this.items[fixedAsset.index].fixedAsset = fixedAsset
      this.items[fixedAsset.index].object_id = fixedAsset.id
      this.items[fixedAsset.index].name = fixedAsset.name
      this.items[fixedAsset.index].depreciation_method = fixedAsset.depreciation_method
      if (fixedAsset.depreciation_method !== 'STRAIGHT_LINE') {
        this.items[fixedAsset.index].accumulation = 0
      }
      this.addItemRow()
    },
    onChoosenSupplier (supplier) {
      this.items[supplier.index].supplier_id = supplier.id
      this.items[supplier.index].supplier_name = supplier.name
    },
    choose (option) {
      option.index = this.index
      option.items = this.items.filter(item => item.object_id !== null)
      this.mutableId = option.id
      this.mutableLabel = option.label

      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    open (index, row) {
      this.index = index
      this.position = row.chart_of_account_position
      this.type = row.chart_of_account_sub_ledger.trim().toLowerCase()
      this.items = row.items
      this.chartOfAccountId = row.chart_of_account_id
      this.addItemRow()
      this.$refs.modal.open()
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
