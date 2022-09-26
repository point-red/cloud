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
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner>
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('inventory usage') | uppercase }}</h4>
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
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.chartOfAccountRef.open(index)"
                    >
                      {{ row.chart_of_account_name || $t('select') | uppercase }}
                    </span>
                    <m-chart-of-account
                      :id="'item-' + index"
                      v-model="row.item_id"
                      :data-index="index"
                      :label="row.item_name"
                      @choosen="chooseAccount($event, row)"
                    />
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      v-model="row.quantity"
                      :name="'quantity' + index"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      :max="row.quantity_pending * 1"
                      :readonly="false"
                      @choosen="chooseUnit($event, row)"
                      @click.native="onClickQuantity(row, index)"
                    />
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'item-' + index"
                      :disabled="row.item_id == null"
                    />
                  </td>
                  <td>
                    <span
                      class="select-link"
                      @click="$refs.allocation.open(index)"
                    >
                      {{ row.allocation_name || $t('select') | uppercase }}
                    </span>
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
                  {{ Date.now() | dateFormat('DD MMMM YYYY') }}
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
              </div>

              <div class="col-sm-12">
                <hr>
                <button
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
      ref="chartOfAccountRef"
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
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      isSaving: false,
      requestedBy: localStorage.getItem('userName'),
      form: new Form({
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
    ...mapGetters('inventoryUsage', ['inventoryUsage']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.addItemRow()
  },
  methods: {
    ...mapActions('inventoryUsage', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        item_label: null,
        chart_of_account_id: null,
        chart_of_account_name: null,
        require_expiry_date: null,
        require_production_number: null,
        unit: null,
        converter: null,
        quantity: null,
        allocation_id: null,
        allocation_name: null,
        notes: null,
        more: false,
        units: [{
          label: '',
          name: '',
          converter: null
        }]
      })
    },
    onChoosenAccount (account) {
      const row = this.form.items[account.index]
      row.chart_of_account_id = account.id
      row.chart_of_account_name = account.label
    },
    updateDna (e) {
      console.log(e)
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].quantity = e.quantity
      this.form.items[e.index].unit = e.unit
      this.form.items[e.index].converter = e.converter
    },
    chooseWarehouse (option) {
      this.form.warehouse_id = option.id
      this.form.warehouse_name = option.name
    },
    chooseEmployee (value) {
      console.log(value)
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
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    chooseItem (item) {
      if (item.id == null) {
        this.clearItem(item.index)
        return
      }

      const row = this.form.items[item.index]
      row.item = item
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.require_production_number = item.require_production_number
      row.require_expiry_date = item.require_expiry_date
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id === item.unit_default_purchase) {
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
    onClickQuantity (row, index) {
      if (row.require_expiry_date === 1 || row.require_production_number === 1) {
        row.warehouse_id = this.warehouseId
        row.index = index
        this.$refs.inventory.open(row, row.quantity)
      }
    },
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.items = this.form.items.filter(item => item.item_id !== null)
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/inventory/usage/' + response.data.id)
        }).catch(error => {
          let formErrors = ''
          if (error?.errors) {
            formErrors = '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>'
            this.form.errors.record(error.errors)
          }

          this.isSaving = false
          this.addItemRow()
          this.$alert.error(error.message, formErrors)
        })
    }
  }
}
</script>
