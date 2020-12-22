<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/inventory/audit"
        class="breadcrumb-item"
      >
        {{ $t('inventory audit') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner>
            <div class="row">
              <div class="col-sm-12">
                <h4 class="text-center">
                  {{ $t('inventory audit') | uppercase }}
                </h4>
                <hr>
                <div class="float-sm-right text-right">
                  <h6 class="mb-0">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  {{ authUser.tenant_address | uppercase }} <br v-if="authUser.tenant_address">
                  {{ authUser.tenant_phone | uppercase }} <br v-if="authUser.tenant_phone">
                </div>
              </div>
            </div>
            <!-- <p-form-row
              id="date"
              name="date"
              :label="$t('date')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="date"
                  name="date"
                  :label="$t('date')"
                  v-model="form.date"
                  :errors="form.errors.get('date')"
                  @errors="form.errors.set('date', null)"/>
              </div>
            </p-form-row> -->
            <p-form-row
              id="warehouse"
              name="warehouse"
              :label="$t('warehouse')"
              :is-horizontal="false"
            >
              <div slot="body">
                <span
                  class="select-link"
                  @click="$refs.warehouse.open()"
                >{{ warehouseName || $t('select') | uppercase }}</span>
              </div>
            </p-form-row>
            <hr>
            <p-table>
              <tr slot="p-head">
                <th>Item</th>
                <th>Jumlah</th>
                <th>Notes</th>
              </tr>
              <tr
                v-for="(row, index) in form.items"
                slot="p-body"
                :key="'row-' + index"
              >
                <td>
                  <span
                    class="select-link"
                    @click="$refs.item.open(index)"
                  >
                    {{ row.item_label || $t('select') | uppercase }}
                    {{ row.production_number }}
                  </span>
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
                    :readonly="onClickUnit(row)"
                    @choosen="chooseUnit($event, row)"
                    @click.native="onClickQuantity(row, index)"
                    @keyup.native="calculate"
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
              </tr>
            </p-table>
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
                  class="btn btn-sm btn-primary"
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
      @choosen="chooseItem($event)"
    />
    <m-inventory-io
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @updated="updateDna($event)"
    />
    <m-warehouse
      id="warehouse_id"
      ref="warehouse"
      @choosen="chooseWarehouse($event)"
    />
    <m-user
      ref="approver"
      :permission="'approve inventory audit'"
      @choosen="chooseApprover"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/inventory/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      isSaving: false,
      requestedBy: localStorage.getItem('userName'),
      totalPrice: 0,
      warehouseId: null,
      warehouseName: null,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        warehouse_id: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null,
        notes: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('inventoryAudit', ['inventoryAudit']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.addItemRow()
  },
  methods: {
    ...mapActions('inventoryAudit', ['create']),
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
    chooseWarehouse (option) {
      this.warehouseId = option.id
      this.warehouseName = option.name
      this.form.warehouse_id = option.id
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
    toggleMore () {
      const isMoreActive = this.form.items.some(function (el, index) {
        return el.more === false
      })
      this.form.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    calculate () {
      this.totalPrice = 0
      this.form.items.forEach((item) => {
        if (item.price) {
          this.totalPrice += parseFloat(item.price)
        }
      })
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
    onClickQuantity (row, index) {
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        row.warehouse_id = this.warehouseId
        row.index = index
        this.$refs.inventory.open(row, row.quantity)
      }
    },
    onClickUnit (row) {
      if (row.item || row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }
      return false
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
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
          this.$router.push('/inventory/audit/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.addItemRow()
          this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
