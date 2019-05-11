<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/request" class="breadcrumb-item">{{ $t('purchase request') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('purchase request')" :header="true">
        <p-form-row
          id="date"
          name="date"
          :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date"
              name="date"
              label="Date"
              v-model="form.required_date"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="supplier"
          name="supplier"
          :label="$t('supplier')">
          <div slot="body" class="col-lg-9 mt-5">
            <m-supplier id="supplier" v-model="form.supplier_id" @choosen="chooseSupplier"/>
          </div>
        </p-form-row>

        <p-form-row
          id="employee"
          name="employee"
          :label="$t('employee')">
          <div slot="body" class="col-lg-9 mt-5">
            <m-employee id="employee" v-model="form.employee_id" @choosen="chooseEmployee"/>
          </div>
        </p-form-row>

        <p-separator></p-separator>

        <h3 class="">Item</h3>

        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Item</th>
              <th>Allocation</th>
              <th>Quantity</th>
              <th>Estimated Price</th>
              <th>Notes</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-' + index"
                  :data-index="index"
                  v-model="row.item_id"
                  @choosen="chooseItem($event, row)"/>
              </td>
              <td>
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="row.allocation_id"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="row.quantity"
                  :unit="row.units[0].label"/>
              </td>
              <td>
                <p-form-number
                  :id="'price' + index"
                  :name="'price' + index"
                  v-model="row.price"/>
              </td>
              <td>
                <p-form-input
                  id="notes"
                  name="notes"
                  v-model="row.notes"/>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addItemRow">
            <i class="fa fa-plus"/> Add
          </button>
        </p-block-inner>

        <p-separator></p-separator>

        <div class="row">
          <div class="col-sm-6">
            <textarea rows="10" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
          </div>
          <div class="col-sm-6">
            <h3 class="">Approver</h3>
            <p-form-row
              id="approver"
              name="approver"
              :label="$t('approver')">
              <div slot="body" class="col-lg-9">
                <m-user
                  :id="'user'"
                  v-model="form.approver_id"
                  :errors="form.errors.get('approver_id')"
                  @errors="form.errors.set('approver_id', null)"/>
              </div>
            </p-form-row>
          </div>
        </div>

        <p-separator></p-separator>

        <div class="form-group">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      isSaving: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        required_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        employee_id: null,
        employee_name: null,
        approver_id: null,
        notes: null,
        items: [
          {
            item_id: null,
            item_name: null,
            unit: null,
            converter: null,
            units: [{
              label: '',
              name: '',
              converter: null
            }],
            quantity: null,
            price: null,
            allocation_id: null,
            notes: null
          }
        ]
      })
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequest'])
  },
  methods: {
    ...mapActions('purchaseRequest', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        unit: null,
        converter: null,
        units: [
          {
            label: '',
            name: '',
            converter: null
          }
        ],
        quantity: null,
        price: null,
        allocation: null,
        notes: null
      })
    },
    chooseEmployee (value) {
      this.form.employee_name = value
    },
    chooseSupplier (value) {
      this.form.supplier_name = value
    },
    chooseItem (item, row) {
      row.item_name = item.name
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    onSubmit () {
      this.isSaving = true
      this.form.date = this.form.required_date
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.approver_id == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          approver_id: ['Approver should not empty']
        })
        return
      }
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/purchase/request/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
  }
}
</script>
