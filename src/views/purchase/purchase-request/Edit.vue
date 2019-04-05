<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link :to="{ name: 'purchase.request.index' }" class="breadcrumb-item">Purchase Request</router-link>
      <router-link :to="{ name: 'purchase.request.show', params: { id: purchaseRequest.id }}" class="breadcrumb-item">{{ purchaseRequest.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    {{ form }}

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
              v-model="form.required_date"
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
          id="notes"
          v-model="form.notes"
          :disabled="loadingSaveButton"
          :label="$t('notes')"
          name="notes"
          :errors="form.errors.get('notes')"
          @errors="form.errors.set('notes', null)"/>

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
                <m-allocation
                  :id="'allocation-' + index"
                  v-model="form.items[index].allocation_id"/>
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
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PurchaseMenu from '../Menu'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable,
    PurchaseMenu
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: true,
      loadingSaveButton: false,
      form: new Form({
        id: this.$route.params.id,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        required_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        employee_id: null,
        approver_id: null,
        notes: null,
        items: [
          {
            item_id: null,
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
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        this.form.date = this.purchaseRequest.date
        this.form.required_date = this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        this.form.supplier_id = null,
        this.form.employee_id = null,
        this.form.approver_id = null,
        this.form.notes = null,
        this.form.items = [{
          item_id: null,
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
        }]
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('purchaseRequest', ['find', 'update']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
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
    updateUnits (itemUnits) {
      this.form.items.forEach((item, keyItem) => {
        if (item.item_id == itemUnits.item_id) {
          this.form.items[keyItem].units = itemUnits.units
        }
        item.units.forEach((unit, keyUnit) => {
          if (unit.converter == 1) {
            this.form.items[keyItem].unit = unit.label
            this.form.items[keyItem].converter = unit.converter
          }
        })
      })
    },
    onSubmit () {
      this.update(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/master/allocation/' + this.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Update failed')
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
