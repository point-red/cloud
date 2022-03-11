<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('add ' + type) | uppercase"
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
            <th>{{ $t(type) }}</th>
            <th>{{ $t(getTypeLabel()) }}</th>
            <th>{{ $t('amount') }}</th>
            <th>{{ $t('notes') }}</th>
          </tr>
          <template slot="p-body">
            <tr
              v-for="(row, i) in items"
              slot="p-body"
              :key="i"
            >
              <td
                width="150"
                class="align-top"
              >
                <span
                  class="select-link"
                  @click="add(i)"
                >
                  {{ row.name || $t('select') | uppercase }}
                </span>
              </td>
              <td class="align-top">
                <p-date-picker
                  id="date"
                  v-model="row.date"
                  name="date"
                  :disabled="!row.object_id"
                  :label="$t('date')"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.date']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'amount-' + i"
                  v-model="row.amount"
                  :disabled="isDisabled(row)"
                  :name="'amount-' + i"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.amount']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-input
                  :id="'notes-' + i"
                  v-model="row.notes"
                  :disabled="isDisabled(row)"
                  :name="'notes-' + i"
                />
              </td>
            </tr>
          </template>
        </point-table>

        <div class="col-sm-12">
          <hr>
          <button
            type="submit"
            class="btn btn-block btn-sm btn-primary"
            :disabled="items.length === 1 || items.find((item) => item.object_id !== null && (!item.date || item.amount <= 0))"
            @click="choose"
          >
            {{ $t('submit') | uppercase }}
          </button>
        </div>
      </div>
    </sweet-modal>
    <m-customer
      ref="customerRef"
      @choosen="onChoose"
    />
    <m-supplier
      id="id"
      ref="supplierRef"
      @choosen="onChoose"
    />
    <m-expedition
      id="id"
      ref="expeditionRef"
      @choosen="onChoose"
    />
    <m-employee
      id="id"
      ref="employeeRef"
      @choosen="onChoose"
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
        date: null,
        amount: 0,
        notes: null
      })
    },
    isDisabled (row) {
      return !row || !row.object_id
    },
    onChoose (value) {
      console.log('value', value)
      this.items[value.index].object_id = value.id
      this.items[value.index].name = value.name
      this.addItemRow()
    },
    getTypeLabel () {
      if (this.position === 'CREDIT') return 'date payable'

      return 'date receivable / invoice date'
    },
    add (index) {
      if (this.type === 'customer') {
        this.$refs.customerRef.open(index)
      } else if (this.type === 'supplier') {
        this.$refs.supplierRef.open(index)
      } else if (this.type === 'expedition') {
        this.$refs.expeditionRef.open(index)
      } else if (this.type === 'employee') {
        console.log(`${this.type}1`)
        this.$refs.employeeRef.open(index)
      }
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
