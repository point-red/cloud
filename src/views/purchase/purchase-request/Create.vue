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
            <p-select-modal
              :title="'select supplier'"
              :options="supplierOptions"
              @choosen="chooseSupplier"
              @search="searchSupplier"/>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    TabMenu,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      loadingSaveButton: false,
      form: new Form({
        date: null
      }),
      supplier: {
        id: null,
        label: null
      },
      supplierOptions: []
    }
  },
  computed: {
    ...mapGetters('Supplier', ['suppliers']),
    ...mapGetters('PurchaseRequest', ['purchaseRequest'])
  },
  methods: {
    ...mapActions('Customer', {
      getSupplier: 'get'
    }),
    ...mapActions('PurchaseRequest', ['create']),
    searchSupplier (value) {
      this.getSupplier({
        params: {
          sort_by: 'name',
          filter_like: {
            name: value  
          },
          limit: 50
        }
      }).then(response => {
        this.supplierOptions = []
        response.data.map((key, value) => {
          this.supplierOptions.push({
            'id': key['id'],
            'label': key['name']
          })
        })
      })
    },
    chooseSupplier (supplier) {
      this.supplier = supplier
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
    this.searchSupplier().then(response => {
      response.data.map((key, value) => {
        this.supplierOptions.push({
          'id': key['id'],
          'label': key['name']
        })
      })
    })
  }
}
</script>
