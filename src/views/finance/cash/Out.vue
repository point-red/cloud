<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance/>
      <router-link to="/purchase/order" class="breadcrumb-item">{{ $t('cash') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        approver_id: null,
        need_down_payment: 0,
        cash_only: false,
        notes: null,
        subtotal: 0,
        discount_percent: 0,
        discount_value: 0,
        tax_base: 0,
        tax: 0,
        type_of_tax: 'exclude',
        total_quantity: 0,
        amount: 0,
        items: [{
          item_id: null,
          item_name: null,
          item: {
            units: [{
              label: '',
              name: '',
              converter: null
            }],
          },
          unit: null,
          converter: null,
          quantity: null,
          price: null,
          total: null,
          allocation_id: null,
          allocation_name: null,
          notes: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequest']),
    ...mapGetters('purchaseOrder', ['purchaseOrder'])
  },
  methods: {
    ...mapActions('purchaseRequest', ['find']),
    ...mapActions('purchaseOrder', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        item: {
          units: [{
            label: '',
            name: '',
            converter: null
          }],
        },
        unit: null,
        converter: null,
        quantity: null,
        price: null,
        allocation_id: null,
        allocation_name: null,
        notes: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.items, index)
    },
    chooseSupplier (value) {
      this.form.supplier_name = value
    },
    chooseItem (item, row) {
      row.item_name = item.name
      row.item.units = item.units
      row.item.units.forEach((unit, keyUnit) => {
        if (unit.converter == 1) {
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
    },
    chooseAllocation (allocation, row) {
      row.allocation_name = allocation
    },
    chooseTax (taxType) {
      if (taxType == this.form.type_of_tax) {
        this.form.type_of_tax = null
      } else {
        this.form.type_of_tax = taxType
      }
      this.calculate()
    },
    calculate: debounce (function () {
      var subtotal = 0
      var totalQuantity = 0
      this.form.items.forEach(function (element) {
        element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        element.discount_value = element.discount_percent * element.price / 100
        subtotal += parseFloat(element.total)
        totalQuantity += parseFloat(element.quantity)
      })
      this.form.subtotal = subtotal
      this.form.discount_value = this.form.discount_percent * subtotal / 100
      this.form.total_quantity = totalQuantity
      this.form.tax_base = this.form.subtotal - (this.form.subtotal * this.form.discount_percent / 100)
      if (this.form.type_of_tax == 'include') {
        this.form.tax = this.form.tax_base * 10 / 100
        this.form.amount = this.form.tax_base
      } else if (this.form.type_of_tax == 'exclude') {
        this.form.tax = this.form.tax_base * 10 / 100
        this.form.amount = this.form.tax_base + this.form.tax
      } else {
        this.form.tax = 0
        this.form.amount = this.form.tax_base
      }
    }, 300),
    onSubmit () {
      this.isSaving = true
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
          this.$router.push('/purchase/order/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    if (this.$route.query.id) {
      this.isLoading = true
      this.find({
        id: this.$route.query.id,
        params: {
          includes: 'form;supplier;items.item.units;services.service'
        }
      }).then(response => {
        this.isLoading = false
        this.form.purchase_request_id = response.data.id
        this.form.date = response.data.form.date
        this.form.supplier_id = response.data.supplier_id
        this.form.supplier_name = response.data.supplier_name
        this.form.notes = response.data.form.notes
        this.form.amount = response.data.amount
        this.form.items = response.data.items
        this.form.items.forEach(function (element) {
          element.purchase_request_item_id = element.id
        })
        this.calculate()
      }).catch(error => {
        this.isLoading = false
      })
    }
  }
}
</script>
