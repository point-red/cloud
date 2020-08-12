<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        :to="{ name: 'purchase.request.index' }"
        class="breadcrumb-item"
      >
        {{ $t('inventory usage') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'purchase.request.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ purchaseRequest.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block :header="false">
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-12">
                <h4 class="text-center">
                  {{ $t('inventory usage') | uppercase }}
                </h4>
                <hr>
                <div class="float-sm-right text-right">
                  <h6 class="mb-0">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  {{ authUser.tenant_address | uppercase }} <br v-if="authUser.tenant_address">
                  {{ authUser.tenant_phone | uppercase }} <br v-if="authUser.tenant_phone">
                </div>
                <div class="float-sm-left">
                  <h6 class="mb-0 ">
                    {{ $t('supplier') | uppercase }}
                  </h6>
                  <m-supplier
                    id="supplier"
                    v-model="form.supplier_id"
                    :label="form.supplier_name"
                    @choosen="chooseSupplier"
                  />
                  <div
                    v-if="form.supplier_phone"
                    style="font-size:12px"
                  >
                    {{ form.supplier_address | uppercase }} <br v-if="form.supplier_email">
                    {{ form.supplier_phone }} <br v-if="form.supplier_phone">
                    {{ form.supplier_email | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <p-form-row
              id="form-number"
              name="form-number"
              :label="$t('form number')"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                {{ purchaseRequest.form.number }}
              </div>
            </p-form-row>
            <p-form-row
              id="required-date"
              name="required-date"
              :label="$t('required date')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="required-date"
                  v-model="form.required_date"
                  name="required-date"
                  :label="$t('required date')"
                  :errors="form.errors.get('required_date')"
                  @errors="form.errors.set('required_date', null)"
                />
              </div>
            </p-form-row>
            <hr>
            <point-table class="mt-20">
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th>Item</th>
                <th>Notes</th>
                <th>Quantity</th>
                <th>Estimated Price</th>
                <th />
              </tr>
              <template v-for="(row, index) in form.items">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>
                    <m-item
                      :id="'item-' + index"
                      v-model="row.item_id"
                      @choosen="chooseItem($event, row)"
                    />
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                    />
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity-' + index"
                      v-model="row.quantity"
                      :name="'quantity-' + index"
                      :item-id="row.item_id"
                      :units="row.units"
                      :unit="{
                        name: row.unit,
                        label: row.unit,
                        converter: row.converter
                      }"
                      @choosen="chooseUnit($event, row)"
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'price-' + index"
                      v-model="row.price"
                      :name="'price-' + index"
                      @keyup.native="calculate"
                    />
                  </td>
                  <td>
                    <button
                      v-if="isSaving"
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="row.more = !row.more"
                    >
                      <i class="fa fa-ellipsis-h" />
                    </button>
                  </td>
                </tr>
                <template v-if="row.more">
                  <tr
                    slot="p-body"
                    :key="'ext-'+index"
                    class="bg-gray-light"
                  >
                    <th class="bg-gray-light" />
                    <td colspan="4">
                      <p-form-row
                        id="allocation"
                        name="allocation"
                        :label="$t('allocation')"
                      >
                        <m-allocation
                          :id="'allocation-' + index"
                          slot="body"
                          v-model="row.allocation_id"
                          class="mt-5"
                        />
                      </p-form-row>
                    </td>
                    <td />
                  </tr>
                </template>
              </template>
              <tr slot="p-body">
                <th class="text-center" />
                <td />
                <td />
                <td />
                <td>
                  <p-form-number
                    :id="'total-price'"
                    v-model="totalPrice"
                    :name="'total-price'"
                    :readonly="true"
                  />
                </td>
              </tr>
            </point-table>
            <div class="row mt-50">
              <div class="col-sm-6">
                <textarea
                  v-model="form.notes"
                  rows="5"
                  class="form-control"
                  placeholder="Notes"
                />
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('requested by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  {{ form.date | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ requestedBy | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col-sm-3 text-center">
                <h6 class="mb-0">
                  {{ $t('approved by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  _______________
                </div>
                <m-user
                  :id="'user'"
                  v-model="form.approver_id"
                  :label="form.approver_name"
                  :errors="form.errors.get('approver_id')"
                  @errors="form.errors.set('approver_id', null)"
                  @choosen="chooseApprover"
                />
                {{ form.approver_email }} <br v-if="form.approver_email">
              </div>

              <div class="col-sm-12">
                <hr>
                <button
                  v-if="!isLoading"
                  type="submit"
                  class="btn btn-sm btn-primary"
                  :disabled="isSaving"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/inventory/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: true,
      isSaving: false,
      totalPrice: 0,
      requestedBy: null,
      form: new Form({
        id: this.$route.params.id,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        required_date: null,
        supplier_id: null,
        supplier_name: null,
        supplier_address: null,
        supplier_phone: null,
        approver_id: null,
        approver_name: null,
        approver_email: null,
        notes: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('purchaseRequest', ['purchaseRequest'])
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'supplier;form.createdBy;items.item.units;items.allocation;services.service;services.allocation;approvers.requestedBy;approvers.requestedTo'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/inventory/usage/' + response.data.id)
      }
      this.isLoading = false
      this.requestedBy = response.data.form.created_by.first_name + ' ' + response.data.form.created_by.last_name
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.required_date = response.data.required_date
      this.form.supplier_id = response.data.supplier_id
      this.form.supplier_name = response.data.supplier_name
      this.form.supplier_address = response.data.supplier_address
      this.form.supplier_phone = response.data.supplier_phone
      this.form.notes = response.data.form.notes
      response.data.approvers.forEach((approval) => {
        this.form.approver_id = approval.requested_to.id
        this.form.approver_name = approval.requested_to.first_name + ' ' + approval.requested_to.last_name
        this.form.approver_email = approval.requested_to.email
      })
      response.data.items.forEach((item, keyItem) => {
        this.form.items.push({
          item_id: item.item_id,
          item_name: item.item.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          converter: item.converter,
          units: item.item.units,
          allocation_id: item.allocation_id,
          notes: item.notes,
          more: false
        })
      })
      this.addItemRow()
      this.calculate()
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
        item_name: null,
        unit: null,
        converter: null,
        units: [{
          label: '',
          name: '',
          converter: null
        }],
        choosenUnit: {
          label: '',
          name: '',
          converter: null
        },
        quantity: null,
        price: null,
        allocation: null,
        notes: null,
        more: false
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
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.items.length > 1) {
        this.form.items = this.form.items.filter(item => item.item_id !== null)
      }
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/inventory/usage/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.form.errors.record(error.errors)
          this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
        })
    }
  }
}
</script>
