<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/inventory/usage"
        class="breadcrumb-item"
      >
        {{ $t('inventory usage') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner>
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
              </div>
            </div>
            <!-- <p-form-row
              id="date"
              name="date"
              :label="$t('date')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="date"
                  name="date"
                  :label="$t('date')"
                  v-model="form.date"
                  :errors="form.errors.get('date')"
                  @errors="form.errors.set('date', null)"/>
              </div>
            </p-form-row> -->
            <p-form-row
              id="warehouse"
              name="warehouse"
              :label="$t('warehouse')"
              :is-horizontal="false"
            >
              <div slot="body">
                <m-warehouse
                  id="warehouse_id"
                  v-model="form.warehouse_id"
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
                <th>Account</th>
                <th>Notes</th>
                <th>Quantity Usage</th>
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
                    <m-item
                      :id="'item-' + index"
                      v-model="row.item_id"
                      @choosen="chooseItem($event, row)"
                    />
                  </td>
                  <td>
                    <m-chart-of-account
                      :id="'chart-of-account-' + index"
                      v-model="row.chart_of_account_id"
                      type="direct expense;other expense;factory overhead cost"
                    />
                  </td>
                  <td>
                    <p-form-input
                      :id="'notes-' + index"
                      v-model="row.notes"
                      :name="'item-' + index"
                      :disabled="row.item_id == null"
                    />
                  </td>
                  <td>
                    <p-quantity
                      :id="'quantity' + index"
                      v-model="row.quantity"
                      :name="'quantity' + index"
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
                <template v-if="row.more">
                  <tr
                    slot="p-body"
                    :key="'ext-'+index"
                    class="bg-gray-light"
                  >
                    <th class="bg-gray-light" />
                    <td colspan="3">
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
                          :v-if="row.item_id == null"
                        />
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
                  {{ Date.now() | dateFormat('DD MMMM YYYY') }}
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
                  :errors="form.errors.get('request_approval_to')"
                  @errors="form.errors.set('request_approval_to', null)"
                  @choosen="chooseApprover"
                />
                {{ form.approver_email }} <br v-if="form.approver_email">
              </div>

              <div class="col-sm-12">
                <hr>
                <button
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
        warehouse_id: null,
        request_approval_to: null,
        notes: null,
        items: []
      })
    }
  },
  computed: {
    ...mapGetters('inventoryUsage', ['inventoryUsage']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.addItemRow()
  },
  methods: {
    ...mapActions('inventoryUsage', ['create']),
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        unit: null,
        converter: null,
        quantity: null,
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
      const isMoreActive = this.form.items.some(function (el, index) {
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
      this.form.items = this.form.items.filter(item => item.item_id !== null)
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/inventory/usage/' + response.data.id)
        }).catch(error => {
          console.log(error.errors)
          this.isSaving = false
          this.addItemRow()
          this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
