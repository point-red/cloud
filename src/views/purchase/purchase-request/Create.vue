<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/purchase-request" class="breadcrumb-item">Purchase Request</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <br>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Purchase Request'" :header="true">
        <p-form-row
          id="date"
          name="date"
          :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date"
              name="date"
              label="Date"
              v-model="form.date"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="supplier"
          name="supplier"
          :label="$t('supplier')">
          <div slot="body" class="col-lg-9">
            <m-supplier id="supplier" v-model="form.supplier_id"/>
          </div>
        </p-form-row>

        <p-form-row
          id="employee"
          name="employee"
          :label="$t('employee')">
          <div slot="body" class="col-lg-9">
            <m-employee id="employee" v-model="form.employee_id"/>
          </div>
        </p-form-row>

        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="loadingSaveButton"
          :label="$t('notes')"
          name="name"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <p-separator></p-separator>

        <h3 class="">Item</h3>

        <p-block-inner>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Estimated Price</th>
              <th>Allocation</th>
              <th>Notes</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.items" :key="index">
              <th>{{ index + 1 }}</th>
              <td>
                <m-item
                  :id="'item-' + index"
                  :data-index="index"
                  v-model="form.items[index].item_id"
                  @units="updateUnits"/>
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.items[index].quantity"
                  :unit="form.items[index].units[0].label"/>
              </td>
              <td>
                <p-form-number
                  :id="'price' + index"
                  :name="'price' + index"
                  v-model="form.items[index].price"/>
              </td>
              <td>
                <m-allocation :id="'allocation-' + index" v-model="form.items[index].allocation_id"/>
              </td>
              <td>
                <p-form-input
                  id="notes"
                  name="notes"
                  v-model="form.items[index].notes"/>
              </td>
            </tr>
          </point-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addItemRow">
            <i class="fa fa-plus"/> Add
          </button>
        </p-block-inner>

        <p-separator></p-separator>

        <h3 class="">Approver</h3>

        <p-form-row
          id="approver"
          name="approver"
          :label="$t('approver')">
          <div slot="body" class="col-lg-9">
            <m-user :id="'user'" v-model="form.approver_id"/>
          </div>
        </p-form-row>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
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
      loadingSaveButton: false,
      form: new Form({
        date: null,
        supplier_id: null,
        employee_id: null,
        approver_id: null,
        items: [
          {
            item_id: null,
            units: [
              {
                label: '',
                name: '',
                converter: null
              }
            ],
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
    ...mapGetters('PurchaseRequest', ['purchaseRequest'])
  },
  methods: {
    ...mapActions('PurchaseRequest', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
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
    updateUnits (itemUnits) {
      this.form.items.forEach((element, key) => {
        if (element.item_id == itemUnits.item_id) {
          this.form.items[key].units = itemUnits.units
        }
      })
    },
    onSubmit () {
      this.loadingSaveButton = true
      
      this.create(this.form)
        .then(response => {
          this.loadingSaveButton = false
          this.$notification.success('create success')          
          Object.assign(this.$data, this.$options.data.call(this));
        }).catch(error => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
  }
}
</script>
