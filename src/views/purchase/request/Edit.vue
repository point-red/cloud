<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link :to="{ name: 'purchase.request.index' }" class="breadcrumb-item">Purchase Request</router-link>
      <router-link :to="{ name: 'purchase.request.show', params: { id: id }}" class="breadcrumb-item">{{ purchaseRequest.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Purchase Request'" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="number"
            name="number"
            :label="$t('number')">
            <div slot="body" class="col-lg-9">
              <template v-if="purchaseRequest.form.number">
                {{ purchaseRequest.form.number }}
              </template>
              <template v-else>
                <span class="badge badge-danger">{{ $t('archived') }}</span>
                {{ purchaseRequest.form.edited_number }}
              </template>
            </div>
          </p-form-row>
          <p-form-row
            id="date"
            name="date"
            :label="$t('date')">
            <div slot="body" class="col-lg-9">
              <p-date-picker
                id="date"
                name="date"
                label="date"
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
                    :unit="form.items[index].unit"/>
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
        </p-block-inner>
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
        date: null,
        required_date: null,
        supplier_id: null,
        employee_id: null,
        approver_id: null,
        notes: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequest'])
  },
  watch: {
    'form.required_date': function () {
      this.form.date = this.form.required_date
    }
  },
  created () {
    this.isLoading = true    
    this.find({
      id: this.id,
      params: {
        includes: 'employee;supplier;items.item;items.allocation;services.service;services.allocation;approvers.requestedBy;approvers.requestedTo'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/purchase/request/' + response.data.id)
      }
      this.isLoading = false
      this.form.date = response.data.form.date
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.required_date = response.data.required_date
      this.form.supplier_id = response.data.supplier_id
      this.form.employee_id = response.data.employee_id
      this.form.notes = response.data.form.notes
      response.data.items.forEach((item, keyItem) => {
        this.form.items.push({
          item_id: item.item_id,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          converter: item.converter,
          allocation_id: item.allocation_id,
          notes: item.notes
        })
      })
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('purchaseRequest', ['find', 'update']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        unit: '',
        converter: null,
        units: [{
          label: '',
          name: '',
          converter: ''
        }],
        quantity: 0,
        price: 0,
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
        .then(response => {
          this.loadingSaveButton = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/purchase/request/' + response.data.id)
        }).catch(error => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
