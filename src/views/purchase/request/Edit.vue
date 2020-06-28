<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        :to="{ name: 'purchase.request.index' }"
        class="breadcrumb-item"
      >
        {{ $t('purchase request') | uppercase }}
      </router-link>
      <router-link
        :to="{ name: 'purchase.request.show', params: { id: id }}"
        class="breadcrumb-item"
      >
        {{ purchaseRequest.form.number | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block :header="false">
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('purchase request') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td
                      width="150px"
                      class="font-weight-bold"
                    >
                      {{ $t('form number') | uppercase }}
                    </td>
                    <td>{{ purchaseRequest.form.number }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('required date') | uppercase }}
                    </td>
                    <td>
                      <p-date-picker
                        id="required-date"
                        v-model="form.required_date"
                        name="required-date"
                        :label="$t('required date')"
                        :errors="form.errors.get('required_date')"
                        @errors="form.errors.set('required_date', null)"
                      />
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-sm-6 text-right">
                <h6 class="mb-0">
                  {{ authUser.tenant_name | uppercase }}
                </h6>
                <template v-if="form.branch">
                  {{ form.branch.address | uppercase }}<br v-if="form.branch.address">
                  {{ form.branch.phone | uppercase }}<br v-if="form.branch.phone">
                </template>
              </div>
            </div>
            <hr>
            <point-table class="mt-20">
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th>Item</th>
                <th>Notes</th>
                <th>Quantity</th>
                <th>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="toggleMore()"
                  >
                    <i class="fa fa-ellipsis-h" />
                  </button>
                </th>
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
                    <span
                      class="select-link"
                      @click="$refs.item.open(index)"
                    >
                      {{ row.item_name || $t('select') | uppercase }}
                    </span>
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'notes-' + index"
                      :disabled="row.item_id == null"
                    />
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity-' + index"
                      v-model="row.quantity"
                      :name="'quantity-' + index"
                      :disabled="row.item_id == null"
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
                    <button
                      v-if="!isSaving"
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="row.more = !row.more"
                    >
                      <i class="fa fa-ellipsis-h" />
                    </button>
                  </td>
                </tr>
                <template v-if="row.more && row.item_id">
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
                        <div
                          slot="body"
                          class="mt-5"
                        >
                          <span
                            class="select-link"
                            @click="$refs.allocation.open(index)"
                          >
                            {{ row.allocation_name || $t('select') | uppercase }}
                          </span>
                        </div>
                      </p-form-row>
                    </td>
                    <td />
                  </tr>
                </template>
              </template>
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
                  v-model="form.request_approval_to"
                  :label="form.approver_name"
                  :errors="form.errors.get('request_approval_to')"
                  @errors="form.errors.set('request_approval_to', null)"
                  @choosen="chooseApprover"
                />
                {{ form.approver_name | uppercase }}
                <br v-if="form.approver_email"> <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
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
    <m-item
      ref="item"
      @choosen="chooseItem($event)"
    />
    <m-user
      ref="approver"
      @choosen="chooseApprover($event)"
    />
    <m-allocation
      ref="allocation"
      @choosen="chooseAllocation($event)"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PurchaseMenu from '../Menu'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
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
      totalPrice: 0,
      requestedBy: null,
      form: new Form({
        id: this.$route.params.id,
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        required_date: null,
        request_approval_to: null,
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
        join: 'form,items,item',
        fields: 'purchase_request.*',
        includes: 'items.item.units;' +
          'items.allocation;' +
          'form.branch;' +
          'form.createdBy;' +
          'form.requestApprovalTo'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(response.data.form)) {
        this.$router.replace('/purchase/request/' + response.data.id)
      }
      this.isLoading = false
      this.requestedBy = response.data.form.created_by.full_name
      this.form.edited_form_number = response.data.form.edited_form_number
      this.form.required_date = response.data.required_date
      this.form.notes = response.data.form.notes
      this.form.request_approval_to = response.data.form.request_approval_to.id
      this.form.approver_name = response.data.form.request_approval_to.full_name
      this.form.approver_email = response.data.form.request_approval_to.email
      this.form.branch = response.data.form.branch
      response.data.items.forEach((item, keyItem) => {
        this.form.items.push({
          item_id: item.item_id,
          item_name: item.item.label,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          converter: item.converter,
          units: item.item.units,
          allocation_id: item.allocation_id,
          allocation_name: item.allocation ? item.allocation.name : null,
          notes: item.notes,
          more: false
        })
      })
      this.addItemRow()
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
    chooseAllocation (value) {
      const row = this.form.items[value.index]
      row.allocation_id = value.id
      row.allocation_name = value.name
    },
    chooseApprover (value) {
      this.form.approver_name = value.label
      this.form.approver_email = value.email
    },
    chooseItem (item) {
      const row = this.form.items[item.index]
      if (item.id == null) {
        this.clearItem(row)
      } else {
        row.item_id = item.id
        row.item_name = item.label
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
    toggleMore () {
      const isMoreActive = this.form.items.some(function (el, index) {
        return el.more === false
      })
      this.form.items.forEach(element => {
        element.more = isMoreActive
      })
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
      this.form.increment_group = this.$moment(this.form.date).format('YYYYMM')
      if (this.form.items.length > 1) {
        this.form.items = this.form.items.filter(item => item.item_id !== null)
      }
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/purchase/request/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.form.errors.record(error.errors)
          let json = ''
          if (error.errors) {
            json = '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>'
          }
          this.$alert.error('Error Message', error.message + json)
        })
    }
  }
}
</script>
