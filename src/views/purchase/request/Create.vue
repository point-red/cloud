<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/request" class="breadcrumb-item">{{ $t('purchase request') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner>
            <div class="row">
              <div class="col-sm-12">
                <h4 class="text-center">{{ $t('purchase request') | uppercase }}</h4>
                <hr>
                <div class="float-sm-right text-right">
                  <h6 class="mb-0">{{ authUser.tenant_name | uppercase }}</h6>
                  {{ authUser.tenant_address | uppercase }} <br v-if="authUser.tenant_address">
                  {{ authUser.tenant_phone | uppercase }} <br v-if="authUser.tenant_phone">
                </div>
                <div class="float-sm-left">
                  <h6 class="mb-0 ">{{ $t('supplier') | uppercase }}</h6>
                  <m-supplier id="supplier" v-model="form.supplier_id" @choosen="chooseSupplier"/>
                  <div style="font-size:12px" v-if="form.supplier_phone">
                    {{ form.supplier_address | uppercase }} <br v-if="form.supplier_email">
                    {{ form.supplier_phone }} <br v-if="form.supplier_phone">
                    {{ form.supplier_email | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <p-form-row
              id="required-date"
              name="required-date"
              :label="$t('required date')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="required-date"
                  name="required-date"
                  :label="$t('required date')"
                  v-model="form.required_date"
                  :errors="form.errors.get('required_date')"
                  @errors="form.errors.set('required_date', null)"/>
              </div>
            </p-form-row>
            <hr>
            <point-table class="mt-20">
              <tr slot="p-head">
                <th class="text-center">#</th>
                <th>Item</th>
                <th>Notes</th>
                <th>Quantity</th>
                <th>Estimated Price</th>
                <th>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="toggleMore()">
                    <i class="fa fa-ellipsis-h"/>
                  </button>
                </th>
              </tr>
              <template v-for="(row, index) in form.items">
                <tr slot="p-body" :key="index">
                  <th class="text-center">{{ index + 1 }}</th>
                  <td>
                    <m-item
                      :id="'item-' + index"
                      v-model="row.item_id"
                      @clear="clearItem(row)"
                      @choosen="chooseItem($event, row)"/>
                  </td>
                  <td>
                    <p-form-input
                      id="notes"
                      name="notes"
                      :disabled="row.item_id == null"
                      v-model="row.notes"/>
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      :name="'quantity' + index"
                      :disabled="row.item_id == null"
                      v-model="row.quantity"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      @choosen="chooseUnit($event, row)"/>
                  </td>
                  <td>
                    <p-form-number
                      :id="'price' + index"
                      :name="'price' + index"
                      :disabled="row.item_id == null"
                      @keyup.native="calculate"
                      v-model="row.price"/>
                  </td>
                  <td>
                    <button type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="row.more = !row.more"
                      v-if="!isSaving">
                      <i class="fa fa-ellipsis-h"/>
                    </button>
                  </td>
                </tr>
                <template v-if="row.more && row.item_id">
                <tr slot="p-body" :key="'ext-'+index" class="bg-gray-light">
                  <th class="bg-gray-light"></th>
                  <td colspan="4">
                    <p-form-row
                      id="allocation"
                      name="allocation"
                      :label="$t('allocation')">
                      <m-allocation
                        slot="body"
                        class="mt-5"
                        :id="'allocation-' + index"
                        v-model="row.allocation_id"/>
                    </p-form-row>
                  </td>
                  <td></td>
                </tr>
                </template>
              </template>
              <tr slot="p-body">
                <th class="text-center"></th>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <p-form-number
                    :id="'total-price'"
                    :name="'total-price'"
                    :readonly="true"
                    v-model="totalPrice"/>
                </td>
              </tr>
            </point-table>
            <div class="row mt-50">
              <div class="col-sm-6">
                <textarea rows="5" class="form-control" placeholder="Notes" v-model="form.notes"></textarea>
                <div class="d-sm-block d-md-none mt-10"></div>
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
                <div class="mb-50" style="font-size:11px">{{ Date.now() | dateFormat('DD MMMM YYYY') }}</div>
                {{ requestedBy | uppercase }}
                <div class="d-sm-block d-md-none mt-10"></div>
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
                <div class="mb-50" style="font-size:11px">_______________</div>
                <m-user
                  :id="'user'"
                  v-model="form.approver_id"
                  :errors="form.errors.get('approver_id')"
                  @errors="form.errors.set('approver_id', null)"
                  @choosen="chooseApprover"/>
                  {{ form.approver_email }} <br v-if="form.approver_email">
              </div>

              <div class="col-sm-12">
                <hr>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                  <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      isSaving: false,
      requestedBy: localStorage.getItem('userName'),
      totalPrice: 0,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        required_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        supplier_address: null,
        supplier_phone: null,
        supplier_email: null,
        approver_id: null,
        approver_name: null,
        approver_email: null,
        notes: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('purchaseRequest', ['purchaseRequest']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.addItemRow()
  },
  methods: {
    ...mapActions('purchaseRequest', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        unit: null,
        converter: null,
        quantity: null,
        price: null,
        allocation_id: null,
        notes: null,
        more: false,
        units: [{
          label: '',
          name: '',
          converter: null
        }]
      })
    },
    toggleMore () {
      let isMoreActive = this.form.items.some(function (el, index) {
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
    chooseApprover (value) {
      this.form.approver_name = value.label
      this.form.approver_email = value.email
    },
    clearItem (row) {
      row.item_id = null
      row.item_name = null
      row.unit = null
      row.converter = null
      row.quantity = null
      row.price = null
      row.allocation_id = null
      row.notes = null
      row.more = false
      row.units = []
    },
    chooseSupplier (value) {
      this.form.supplier_name = value.label
      this.form.supplier_address = value.address
      this.form.supplier_phone = value.phone
      this.form.supplier_email = value.email
    },
    chooseItem (item, row) {
      row.item_name = item.name
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
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    onSubmit () {
      this.isSaving = true
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.items.length > 1) {
        this.form.items = this.form.items.filter(item => item.item_id !== null)
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
          this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
