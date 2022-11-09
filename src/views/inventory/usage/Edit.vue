<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/inventory/usage"
        class="breadcrumb-item"
      >
        {{ $t('inventory usage') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'inventory.usage.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ inventoryUsage.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>
                  {{ $t('inventory usage') | uppercase }}
                </h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('date') | uppercase }}
                    </td>
                    <td>
                      <p-date-picker
                        id="date"
                        v-model="form.date"
                        name="date"
                        :label="$t('date')"
                        :disabled-date-rule="disabledDateRule"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('warehouse') | uppercase }}
                    </td>
                    <td>
                      <span
                        class="select-link"
                        @click="$refs.warehouse.open()"
                      >{{ form.warehouse_name || $t('select') | uppercase }}</span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-sm-6 text-right">
                <div class="mb-30">
                  <h6 class="mb-0">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  <template v-if="authUser.branch">
                    {{ authUser.branch.address | uppercase }} <br v-if="authUser.branch.address">
                    {{ authUser.branch.phone | uppercase }} <br v-if="authUser.branch.phone">
                  </template>
                </div>
                <div>
                  <h6 class="mb-5 mt-30">
                    {{ $t('employee') | uppercase }}:
                  </h6>
                  <span
                    class="select-link"
                    @click="$refs.employee.open()"
                  >
                    {{ form.employee_name || $t('select') | uppercase }}
                  </span>
                  <div
                    :v-show="!!form.errors.get('employee_id')"
                    class="invalid-feedback d-block"
                  >
                    {{ form.errors.get('employee_id') }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <point-table class="mt-20">
              <tr slot="p-head">
                <th>Item</th>
                <th>Account</th>
                <th>Quantity Usage</th>
                <th>Notes</th>
                <th>Allocation</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.item.open(index)"
                    >
                      {{ row.item_label || $t('select') | uppercase }}
                    </span>
                    <div
                      :v-show="!!form.errors.get(`items.${index}.item_id`)"
                      class="invalid-feedback d-block"
                    >
                      {{ form.errors.get(`items.${index}.item_id`) }}
                    </div>
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.itemChartOfAccountRef.open(index)"
                    >
                      {{ row.chart_of_account_name || $t('select') | uppercase }}
                    </span>
                    <div
                      :v-show="!!form.errors.get(`items.${index}.chart_of_account_id`)"
                      class="invalid-feedback d-block"
                    >
                      {{ form.errors.get(`items.${index}.chart_of_account_id`) }}
                    </div>
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity-' + index"
                      v-model="row.quantity"
                      :name="'quantity-' + index"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      @choosen="chooseUnit($event, row)"
                      @click.native="onClickQuantity(row, index)"
                    />
                    <div
                      :v-show="!!form.errors.get(`items.${index}.quantity`) || !!form.errors.get(`items.${index}.unit`)"
                      class="invalid-feedback d-block"
                    >
                      {{ form.errors.get(`items.${index}.quantity`) || form.errors.get(`items.${index}.unit`) }}
                    </div>
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                    />
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.allocation.open(index)"
                    >
                      {{ row.allocation_name || $t('select') | uppercase }}
                    </span>
                    <div
                      :v-show="!!form.errors.get(`items.${index}.allocation_id`)"
                      class="invalid-feedback d-block"
                    >
                      {{ form.errors.get(`items.${index}.allocation_id`) }}
                    </div>
                  </td>
                  <td>
                    <button
                      v-if="isSaving"
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="row.more = !row.more"
                    >
                      <i class="fa fa-ellipsis-h" />
                    </button>
                  </td>
                </tr>
              </template>
            </point-table>
            <div class="row mt-50">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('requested by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  {{ form.date | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ requestedBy | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('approved by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  _______________
                </div>
                <span
                  class="select-link"
                  @click="$refs.approver.open()"
                >{{ form.approver_name || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
                <div
                  :v-show="!!form.errors.get('request_approval_to')"
                  class="invalid-feedback d-block"
                >
                  {{ form.errors.get('request_approval_to') }}
                </div>
              </div>

              <div class="col-sm-12">
                <hr>
                <button
                  v-if="!isLoading"
                  type="submit"
                  class="btn btn-sm btn-block btn-primary"
                  :disabled="isSaving"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-item
      ref="item"
      @choosen="chooseItem"
    />
    <m-inventory-out
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @updated="updateDna($event)"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
    <m-chart-of-account
      ref="itemChartOfAccountRef"
      :type-in="['BEBAN OPERASIONAL', 'BEBAN NON OPERASIONAL']"
      @choosen="onChoosenAccount"
    />
    <m-warehouse
      id="warehouse_id"
      ref="warehouse"
      default-only
      @choosen="chooseWarehouse($event)"
    />
    <m-user
      ref="approver"
      :permission="'approve inventory usage'"
      @choosen="chooseApprover"
    />
    <m-employee
      id="employee"
      ref="employee"
      @choosen="chooseEmployee"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/inventory/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    const id = this.$route.params.id
    return {
      id,
      isSaving: false,
      isLoading: true,
      requestedBy: localStorage.getItem('userName'),
      items: [],
      form: new Form({
        id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        warehouse_id: null,
        warehouse_name: null,
        employee_id: null,
        employee_name: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        notes: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('inventoryUsage', ['inventoryUsage'])
  },
  async created () {
    this.isLoading = true

    try {
      const { data } = await this.find({
        id: this.id,
        params: {
          includes: 'warehouse;' +
            'items.account;' +
            'items.item;' +
            'items.item.units;' +
            'items.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.requestCancellationTo;' +
            'employee'
        }
      })

      this.items = data.items

      this.isLoading = false

      this.chooseWarehouse(data.warehouse)
      this.chooseEmployee(data.employee)
      this.chooseApprover(data.form.request_approval_to)

      this.form.date = data.form.date
      this.form.notes = data.notes

      const usageItems = []
      for (let idx = 0; idx < data.items.length; idx++) {
        const usageItem = data.items[idx]
        const sameItem = usageItems.find(({ item_id: itemId }) => itemId === usageItem.item_id)
        if (sameItem) continue

        let dna = []
        if (usageItem.item.require_production_number === 1 || usageItem.item.require_expiry_date === 1) {
          dna = await this.fetchDna({
            ...usageItem,
            index: idx,
            warehouse_id: this.form.warehouse_id
          })
        }

        const defaultUnitId = usageItem.item.unit_default_purchase
        const defaultUnit = usageItem.item.units.find(({ id: unitId }) => unitId === defaultUnitId)
        usageItems.push({
          ...usageItem,
          item_label: usageItem.item.name,
          chart_of_account_name: usageItem.account.name,
          quantity: data.items
            .filter((item) => item.item_id === usageItem.item_id)
            .reduce((totalQty, { quantity: usageItemQty }) => totalQty + usageItemQty, 0),
          allocation_name: usageItem.allocation.name,
          units: usageItem.item.units,
          item: {
            ...usageItem.item,
            unit: defaultUnit.label,
            converter: defaultUnit.converter
          },
          dna
        })
      }

      this.form.items = usageItems

      this.addItemRow()
    } catch (error) {
      this.isLoading = false
      this.$notification.error(error.message)
    }
  },
  methods: {
    ...mapActions('inventoryUsage', ['find', 'update']),
    ...mapActions('inventoryInventoryDna', { getInvDna: 'get' }),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        unit: null,
        converter: null,
        units: [{
          label: '',
          name: '',
          converter: null
        }],
        choosenUnit: {
          label: '',
          name: '',
          converter: null
        },
        quantity: null,
        price: null,
        allocation: null,
        notes: null,
        more: false
      })
    },
    onChoosenAccount (account) {
      const row = this.form.items[account.index]
      row.chart_of_account_id = account.id
      row.chart_of_account_name = account.label
    },
    updateDna (e) {
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].quantity = e.quantity
      this.form.items[e.index].unit = e.unit
      this.form.items[e.index].converter = e.converter
    },
    disabledDateRule (date) {
      const dateOptionFormatted = this.$options.filters.dateFormat(date, 'YYYY-MM-DD')
      const dateFormFormatted = this.$options.filters.dateFormat(this.form.date, 'YYYY-MM-DD')

      return dateOptionFormatted < dateFormFormatted
    },
    chooseWarehouse (option) {
      this.form.warehouse_id = option.id
      this.form.warehouse_name = option.name
    },
    chooseEmployee (value) {
      this.form.employee_id = value.id
      this.form.employee_name = value.name
    },
    chooseAllocation (allocation) {
      const row = this.form.items[allocation.index]
      row.allocation_id = allocation.id
      row.allocation_name = allocation.name
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.full_name
      this.form.approver_email = value.email
    },
    chooseItem (item, row) {
      row.item_name = item.name
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id == item.unit_default_purchase) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
      let isNeedNewRow = true
      this.form.items.forEach(element => {
        if (element.item_id == null) {
          isNeedNewRow = false
        }
      })
      if (isNeedNewRow) {
        this.addItemRow()
      }
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    async fetchDna (row) {
      const { data: dataInvDna } = await this.getInvDna({
        itemId: row.item_id,
        params: { warehouse_id: row.warehouse_id }
      })

      const dna = dataInvDna.map((invDna) => {
        let quantity = 0
        const matchedInvItem = this.items.find(({ production_number: prodNumberUsage }) => {
          return prodNumberUsage === invDna.production_number
        })

        if (matchedInvItem) {
          quantity = matchedInvItem?.quantity
        }

        return { ...invDna, quantity }
      })

      return dna
    },
    async onClickQuantity (row, index) {
      if (row.item.require_expiry_date === 1 || row.item.require_production_number === 1) {
        row.index = index
        row.warehouse_id = this.form.warehouse_id
        row.item.unit = row.units.find(unit => unit.name === row.unit)

        this.$refs.inventory.open(row, row.quantity)
      }
    },
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.items.length > 1) {
        this.form.items = this.form.items.filter(item => item.item_id !== null)
      }
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/inventory/usage/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.form.errors.record(error.errors)

          let errorDesc = ''
          if (error.errors) {
            errorDesc = '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>'
          }

          this.$alert.error(error.message, errorDesc)
        })
    }
  }
}
</script>
