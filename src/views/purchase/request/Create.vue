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
              <div class="col-sm-6">
                <h4>{{ $t('purchase request') | uppercase }}</h4>
                <p-form-row
                  id="required-date"
                  name="required-date"
                  :is-horizontal="false"
                  :label="$t('required date')">
                  <div slot="body">
                    <p-date-picker
                      id="required-date"
                      name="required-date"
                      :label="$t('required date')"
                      v-model="form.required_date"
                      :errors="form.errors.get('required_date')"
                      @errors="form.errors.set('required_date', null)"/>
                  </div>
                </p-form-row>
              </div>
              <div class="col-sm-6 text-right">
                <div class="mb-30">
                  <h6 class="mb-0">{{ authUser.tenant_name | uppercase }}</h6>
                  <template v-if="authUser.branch">
                    {{ authUser.branch.address | uppercase }} <br v-if="authUser.branch.address">
                    {{ authUser.branch.phone | uppercase }} <br v-if="authUser.branch.phone">
                  </template>
                </div>
              </div>
            </div>
            <hr>
            <point-table class="mt-20">
              <tr slot="p-head">
                <th class="text-center">#</th>
                <th>Item</th>
                <th>Notes</th>
                <th>Quantity</th>
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
                    <span @click="$refs.item.open(index)" class="select-link">
                      {{ row.item_label || $t('select') | uppercase }}
                    </span>
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
                  <td colspan="3">
                    <p-form-row
                      id="allocation"
                      name="allocation"
                      :label="$t('allocation')">
                      <div slot="body" class="col-lg-9 mt-5">
                        <span @click="$refs.allocation.open(index)" class="select-link">
                          {{ row.allocation_name || $t('select') | uppercase }}
                        </span>
                      </div>
                    </p-form-row>
                  </td>
                  <td></td>
                </tr>
                </template>
              </template>
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
                <span @click="$refs.approver.open()" class="select-link">{{ form.approver_name || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
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
    <m-item ref="item" @choosen="chooseItem($event)"/>
    <m-user ref="approver" @choosen="chooseApprover($event)"/>
    <m-allocation ref="allocation" @choosen="chooseAllocation($event)"/>
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
      requestedBy: localStorage.getItem('fullName'),
      totalPrice: 0,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        required_date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        request_approval_to: null,
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
        allocation_id: null,
        allocation_name: null,
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
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    clearItem (row) {
      row.item_id = null
      row.item_name = null
      row.item_label = null
      row.unit = null
      row.converter = null
      row.quantity = null
      row.price = null
      row.allocation_id = null
      row.notes = null
      row.more = false
      row.units = []
      if (this.form.items.length > 1) {
        this.form.items = this.form.items.filter(item => item.item_id !== null)
        this.addItemRow()
      }
    },
    chooseAllocation (value) {
      let row = this.form.items[value.index]
      row.allocation_id = value.id
      row.allocation_name = value.name
    },
    chooseItem (item) {
      let row = this.form.items[item.index]
      if (item.id == null) {
        this.clearItem(row)
      } else {
        row.item_id = item.id
        row.item_name = item.name
        row.item_label = item.label
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
      }
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    onSubmit () {
      this.isSaving = true
      if (this.form.request_approval_to == null) {
        this.$notification.error('approval cannot be null')
        this.isSaving = false
        this.form.errors.record({
          request_approval_to: ['Approver should not empty']
        })
        return
      }
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
          this.isSaving = false
          let json = ''
          if (error.errors) {
            json = '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>'
          }
          this.$alert.error('Error Message', error.message + json)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
