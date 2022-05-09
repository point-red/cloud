<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <breadcrumb-inventory-transfer />
      <router-link
        to="/inventory/transfer/receive"
        class="breadcrumb-item"
      >
        {{ $t('receive') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'inventory.transfer.receive.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ inventoryReceiveItem.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('Transfer Item') | uppercase }}</h4>
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
                      {{ $t('reference') | uppercase }}
                    </td>
                    <td>
                      {{ form.transfer_item_form_number | uppercase }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('from warehouse') | uppercase }}
                    </td>
                    <td>
                      {{ form.from_warehouse_name | uppercase }}
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
              </div>
            </div>
            <hr>
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th style="min-width: 120px">
                  Item
                </th>
                <th>Stock Warehouse</th>
                <th>Quantity Receive</th>
                <th>Balance</th>
                <th>Notes</th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th>{{ index + 1 }}</th>
                  <td>
                    {{ row.item.label }}
                    <template v-if="row.production_number">
                      (PID: {{ row.production_number }})
                    </template>
                    <template v-if="row.item.require_expiry_date">
                      (E/D: {{ row.expiry_date | dateFormat('DD MMMM YYYY') }})
                    </template>
                  </td>
                  <td>
                    <p-quantity
                      :id="'stock' + index"
                      v-model="row.stock"
                      :name="'stock' + index"
                      :disabled="true"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      @choosen="chooseUnit($event, row)"
                    />
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      v-model="row.quantity"
                      :name="'quantity' + index"
                      :disabled="row.item_id == null"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      :max="row.quantity_pending * 1"
                      :disable-unit-selection="true"
                      :readonly="onClickUnit(row)"
                      :change="ComputeDna(row)"
                      @input="onQtyChange($event, row)"
                      @choosen="chooseUnit($event, row)"
                      @click.native="onClickQuantity(row, index)"
                    />
                  </td>
                  <td>
                    <p-quantity
                      :id="'balance' + index"
                      :name="'balance' + index"
                      :disabled="true"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      :value="ComputeBalance(row)"
                      @choosen="chooseUnit($event, row)"
                    />
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </template>
            </point-table>

            <div class="row">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
              </div>
              <div class="col-sm-6 text-center">
                <h6 class="mb-0">
                  {{ $t('created by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  {{ Date.now() | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ form.created_by | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>

              <div class="col-sm-12">
                <hr>
                <button
                  type="submit"
                  class="btn btn-block btn-sm btn-primary"
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
    <m-inventory-out
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @updated="updateDna($event)"
    />
    <m-item
      ref="item"
      @choosen="chooseItem"
    />
    <m-user
      ref="approver"
      :permission="'approve transfer item'"
      @choosen="chooseApprover"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import BreadcrumbInventoryTransfer from '@/views/inventory/transfer/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable,
    Breadcrumb,
    BreadcrumbInventory,
    BreadcrumbInventoryTransfer
  },
  data () {
    return {
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      warehouseId: null,
      form: new Form({
        id: this.$route.params.id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        warehouse_id: null,
        from_warehouse_id: null,
        from_warehouse_name: null,
        driver: null,
        notes: null,
        items: [],
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      })
    }
  },
  computed: {
    ...mapGetters('inventoryReceiveItem', ['inventoryReceiveItem']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.$route.params.id,
      params: {
        includes: 'from_warehouse;' +
            'warehouse;' +
            'items.item;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch;' +
            'transfer_item.form;' +
            'transfer_item.items;'
      }
    }).then(response => {
      this.isLoading = false
      this.form.date = response.data.form.date
      this.form.warehouse_id = response.data.warehouse_id
      this.form.from_warehouse_id = response.data.from_warehouse_id
      this.form.from_warehouse_name = response.data.from_warehouse.name
      this.form.driver = response.data.driver
      this.form.transfer_item_id = response.data.transfer_item_id
      this.form.transfer_item_form_number = response.data.transfer_item.form.number
      this.form.items = response.data.items
      this.form.notes = response.data.form.notes
      this.form.request_approval_to = response.data.form.request_approval_to.id
      this.form.approver_name = response.data.form.request_approval_to.full_name
      this.form.approver_email = response.data.form.request_approval_to.email
      this.form.created_by = response.data.form.created_by.full_name
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('inventoryReceiveItem', ['find', 'update', 'addHistories', 'sendEmail']),
    ...mapActions('inventoryInventoryWarehouseCurrentstock', ['get']),
    ...mapActions('inventoryInventoryDna', { getDna: 'get' }),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        unit: null,
        converter: null,
        quantity: 0,
        require_production_number: 0,
        require_expiry_date: 0,
        stock: 0,
        balance: 0,
        notes: null
      })
    },
    clearItem (index) {
      this.form.items.splice(index, 1)
      if (this.form.items.length === 0) {
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
      if (row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }
      return false
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    updateDna (e) {
      console.log(e)
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].quantity = e.quantity
      this.form.items[e.index].unit = e.unit
      this.form.items[e.index].converter = e.converter
    },
    chooseWarehouse (warehouse) {
      this.warehouseId = warehouse.id
      this.form.warehouse_id = warehouse.id
      this.form.warehouse_name = warehouse.name
      if (this.form.items) {
        this.form.items.forEach(item => {
          if (item.item_id) {
            this.get({
              params: {
                item_id: item.item_id,
                warehouse_id: warehouse.id,
                expiry_date: item.expiry_date,
                production_number: item.production_number
              }
            }).then(response => {
              item.stock = response
              this.isLoading = false
            }).catch(error => {
              this.isLoading = false
              this.$notification.error(error.message)
            })
          }
        })
      }
    },
    chooseToWarehouse (warehouse) {
      this.form.to_warehouse_id = warehouse.id
      this.form.to_warehouse_name = warehouse.name
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
      row.notes = item.notes
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id == item.unit_default) {
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
      this.find({
        id: item.id
      })
      if (this.form.warehouse_id) {
        this.get({
          params: {
            item_id: item.id,
            warehouse_id: this.form.warehouse_id
          }
        }).then(response => {
          row.stock = response
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }
    },
    ComputeBalance (row) {
      row.balance = parseInt(row.stock) + parseInt(row.quantity)
      return row.balance
    },
    ComputeDna (row) {
      if (row.id != undefined && row.dna != undefined) {
        row.dna[0].quantity = row.quantity
        console.log(row)
      }
    },
    onQtyChange (value, row) {
      this.inventoryReceiveItem.transfer_item.items.forEach(itemTransfer => {
        if (row.item_id == itemTransfer.item_id && row.production_number == itemTransfer.production_number && row.expiry_date == itemTransfer.expiry_date) {
          if (value > itemTransfer.quantity) {
            this.$notification.error('Quantity exceeds the stock limit sent!')
            row.quantity = itemTransfer.quantity
          }
        }
      })
    },
    onSubmit () {
      this.isSaving = true
      if (this.authUser.warehouse == null || this.authUser.warehouse.id != this.form.warehouse_id) {
        this.$notification.error('please set as default warehouse')
        this.isSaving = false
        return
      }
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
      let formSendDone = 1
      this.inventoryReceiveItem.items.forEach(itemReceive => {
        this.inventoryReceiveItem.transfer_item.items.forEach(itemTransfer => {
          if (itemReceive.item_id == itemTransfer.item_id && itemReceive.production_number == itemTransfer.production_number && itemReceive.expiry_date == itemTransfer.expiry_date) {
            if (itemReceive.quantity < itemTransfer.quantity) {
              formSendDone = 0
            }
          }
        })
      })
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      this.form.items = this.form.items.filter(item => item.item_id)
      this.update(this.form).then(response => {
        this.isSaving = false
        this.$notification.success('update success')
        this.isLoading = false
        Object.assign(this.$data, this.$options.data.call(this))
        this.$router.push('/inventory/transfer/receive/' + response.data.id)
        this.addHistories({ id: this.id, activity: 'Update' })
          .catch(error => {
            this.$notification.error(error.message)
            this.form.errors.record(error.errors)
          })
        this.sendEmail({ id: response.data.id, form_send_done: formSendDone, crud_type: 'update' })
          .then(response => {
            console.log(response)
          }).catch(error => {
            this.isLoading = false
            this.$notification.error(error.message)
          })
      }).catch(error => {
        this.isSaving = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
