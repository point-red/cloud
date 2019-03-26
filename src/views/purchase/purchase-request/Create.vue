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
            <m-supplier id="supplier"/>
          </div>
        </p-form-row>

        <p-form-row
          id="employee"
          name="employee"
          :label="$t('employee')">
          <div slot="body" class="col-lg-9">
            <m-employee id="employee"/>
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
                <m-item :id="'item-' + index"/>
              </td>
              <td>
                <p-form-number
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="form.items[index].quantity"/>
              </td>
              <td>
                <p-form-number
                  :id="'price' + index"
                  :name="'price' + index"
                  v-model="form.items[index].price"/>
              </td>
              <td>
                <p-select-modal
                  :id="'allocation' + index"
                  :title="'select allocation'"
                  :options="allocationOptions"
                  @choosen="chooseAllocation(index, $event)"
                  @search="searchAllocation"/>
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
            <p-select-modal
              id="approver"
              :title="'select approver'"
              :options="approverOptions"
              @choosen="chooseApprover"
              @search="searchApprover"/>
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
        items: [
          {
            item: null,
            quantity: null,
            price: null,
            allocation: null,
            notes: null
          }
        ]        
      }),
      supplier: {
        id: null,
        label: null
      },
      supplierOptions: [],
      item: {
        id: null,
        label: null
      },
      itemOptions: [],
      allocation: {
        id: null,
        label: null
      },
      allocationOptions: [],
      approver: {
        id: null,
        label: null
      },
      approverOptions: []
    }
  },
  computed: {
    ...mapGetters('PurchaseRequest', ['purchaseRequest'])
  },
  methods: {
    ...mapActions('Employee', {
      getEmployee: 'get'
    }),
    ...mapActions('Allocation', {
      getAllocation: 'get'
    }),
    ...mapActions('Item', {
      getItem: 'get'
    }),
    ...mapActions('User', {
      getUser: 'get'
    }),
    ...mapActions('PurchaseRequest', ['create']),
    ...mapActions('Employee', {
      createEmployee: 'create' 
    }),
    addItemRow () {
      this.form.items.push({
        item: null,
        quantity: null,
        price: null,
        allocation: null,
        notes: null
      })
    },
    addEmployee (value) {
      this.createEmployee({
        name: value
      }).then(response => {
      }).catch(error => {
        this.$notification.error(error.message)
      })
      this.searchEmployee(value)
    },
    searchItem (value) {
      this.getItem({
        params: {
          filter_like: {
            name: value  
          },
          limit: 50,
          sort_by: 'name'
        }
      }).then(response => {
        this.itemOptions = []
        response.data.map((key, value) => {
          this.itemOptions.push({
            'id': key['id'],
            'label': key['name']
          })
        })
      })
    },
    searchAllocation (value) {
      this.getAllocation({
        params: {
          filter_like: {
            name: value  
          },
          limit: 50,
          sort_by: 'name'
        }
      }).then(response => {
        this.allocationOptions = []
        response.data.map((key, value) => {
          this.allocationOptions.push({
            'id': key['id'],
            'label': key['name']
          })
        })
      })
    },
    searchApprover (value) {
      this.getUser({
        params: {
          filter_like: {
            name: value  
          },
          limit: 50,
          sort_by: 'name'
        }
      }).then(response => {
        this.approverOptions = []
        response.data.map((key, value) => {
          this.approverOptions.push({
            'id': key['id'],
            'label': key['name']
          })
        })
      })
    },
    chooseSupplier (supplier) {
      this.form.supplier_id = supplier.id
    },
    chooseEmployee (employee) {
      this.form.employee_id = employee.id
    },
    chooseItem (index, item) {
      this.form.items[index].item_id = item.id
    },
    chooseAllocation (index, allocation) {
      this.form.items[index].allocation_id = allocation.id
    },
    chooseApprover (approver) {
      this.form.approver = approver
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
    this.searchEmployee()
    this.searchItem()
    this.searchAllocation()
    this.searchApprover()
  }
}
</script>
