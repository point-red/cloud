<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link :to="{ name: 'purchase.request.index' }" class="breadcrumb-item">{{ $t('purchase request') | titlecase }}</router-link>
      <router-link :to="{ name: 'purchase.request.show', params: { id: id }}" class="breadcrumb-item">{{ purchaseRequest.form.number | uppercase }}</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <purchase-menu/>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('purchase request')" :header="true">
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

          <h5 class="">Item</h5>

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
                  :unit="row.unit"/>
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

          <p-separator></p-separator>

          <div class="row">
            <div class="col-sm-6">
              <textarea rows="10" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
            </div>
            <div class="col-sm-6">
              <h5 class="">Approver</h5>
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

            <div class="col-sm-12">
              <hr>
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
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
      isLoading: true,
      isSaving: false,
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
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/purchase/request/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
