<template>
  <div>
    <breadcrumb>
      <breadcrumb-pos />
      <router-link
        to="/pos/closed-bill"
        class="breadcrumb-item"
      >
        {{ $t('closed bill') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ id }}</span>
    </breadcrumb>

    <p-block
      :header="true"
      :title="$t('bill') + ' (' + bill.form.number + ')'"
      :is-fullscreen="true"
      :show-fullscreen-button="false"
      :show-hidden-button="false"
      column="col-sm-12"
    >
      <template v-slot:header>
        |<router-link
          v-if="$permission.has('create pos')"
          to="/pos/open-bill/create"
          exact
        >
          <button
            type="button"
            class="btn-block-option"
          >
            Add
          </button>
        </router-link>|
        <router-link
          v-if="$permission.has('read pos')"
          to="/pos/closed-bill"
          exact
        >
          <button
            type="button"
            class="btn-block-option"
          >
            List
          </button>
        </router-link>|
      </template>

      <p-block-inner :is-loading="isLoading">
        <div class="row">
          <div class="col-md-3 col-lg-3" />
          <div
            class="col-sm-12 col-md-6 col-lg6"
            style="background-color:LightGray;"
          >
            <p-table style="margin-top:30px;margin-bottom:10px;">
              <tr slot="p-body">
                <td
                  style="border:0px;"
                  width="50%"
                >
                  <b>{{ bill.form.number }}</b>
                </td>
                <td
                  style="border:0px;text-align:right;"
                  width="50%"
                >
                  <b>{{ bill.date | dateFormat('DD MMMM YYYY HH:mm') }}</b>
                </td>
              </tr>
              <tr
                v-if="bill.customer"
                slot="p-body"
              >
                <td
                  style="border:0px;"
                  colspan="2"
                >
                  Customer: <b>{{ bill.customer.name }}</b>
                </td>
              </tr>
              <tr slot="p-body">
                <td
                  style="border:0px;"
                  colspan="2"
                >
                  <br>
                </td>
              </tr>
              <template v-for="(row, index) in items_temporary">
                <tr
                  v-if="row.require_expiry_date === 1 || row.require_production_number === 1"
                  slot="p-body"
                  :key="'item-' + index"
                  style="cursor:pointer;"
                  @click="showItem(index, row)"
                >
                  <td
                    style="border:0px;text-align:left;"
                    width="75%"
                  >
                    <template>
                      <label style="color:blue;">{{ row.quantity | numberFormat }}x</label>
                      {{ row.price | numberFormat }}
                    </template>
                    <br>
                    <b>{{ row.item_name }} ({{ row.unit }})</b>
                    <template v-if="row.discount_percent > 0">
                      <br>
                      <label style="color:orange;">{{ row.discount_percent | numberFormat }}% Discount</label>
                    </template>
                    <template v-if="row.error">
                      <br>
                      <label style="color:red;">{{ row.error }}</label>
                    </template>
                    <template v-if="row.notes">
                      <br>
                      <br>
                      <label>Note: {{ row.notes }}</label>
                    </template>
                  </td>
                  <td
                    style="border:0px;text-align:right;"
                    width="25%"
                  >
                    <b>{{ row.total | numberFormat }}</b>
                  </td>
                </tr>
                <tr
                  v-else
                  slot="p-body"
                  :key="'item-' + index"
                >
                  <td
                    style="border:0px;text-align:left;"
                    width="75%"
                  >
                    <template>
                      <label style="color:blue;">{{ row.quantity | numberFormat }}x</label>
                      {{ row.price | numberFormat }}
                    </template>
                    <br>
                    <b>{{ row.item_name }} ({{ row.unit }})</b>
                    <template v-if="row.discount_percent > 0">
                      <br>
                      <label style="color:orange;">{{ row.discount_percent | numberFormat }}% Discount</label>
                    </template>
                    <template v-if="row.error">
                      <br>
                      <label style="color:red;">{{ row.error }}</label>
                    </template>
                    <template v-if="row.notes">
                      <br>
                      <br>
                      <label>Note: {{ row.notes }}</label>
                    </template>
                  </td>
                  <td
                    style="border:0px;text-align:right;"
                    width="25%"
                  >
                    <b>{{ row.total | numberFormat }}</b>
                  </td>
                </tr>
              </template>
              <tr
                v-for="(row, index) in bill.services"
                slot="p-body"
                :key="'service-' + index"
              >
                <td
                  style="border:0px;text-align:left;"
                  width="75%"
                >
                  <template>
                    <label style="color:blue;">{{ row.quantity | numberFormat }}x</label>
                    {{ row.price | numberFormat }}
                  </template>
                  <br>
                  <b>{{ row.service_name }}</b>
                  <template v-if="row.discount_percent > 0">
                    <br>
                    <label style="color:orange;">{{ row.discount_percent | numberFormat }}% Discount</label>
                  </template>
                  <template v-if="row.error">
                    <br>
                    <label style="color:red;">{{ row.error }}</label>
                  </template>
                  <template v-if="row.notes">
                    <br>
                    <br>
                    <label>Note: {{ row.notes }}</label>
                  </template>
                </td>
                <td
                  style="border:0px;text-align:right;"
                  width="25%"
                >
                  <b>{{ row.total | numberFormat }}</b>
                </td>
              </tr>
              <tr slot="p-body">
                <td
                  style="border:0px;"
                  colspan="2"
                >
                  <br>
                </td>
              </tr>
              <tr slot="p-body">
                <td style="border:0px;">
                  <b>{{ $t('total items') | titlecase }}</b>
                </td>
                <td style="border:0px;text-align:right;">
                  <b>{{ bill.total_quantity | numberFormat }}</b>
                </td>
              </tr>
              <tr slot="p-body">
                <td style="border:0px;">
                  <b>{{ $t('sub total') | titlecase }}</b>
                </td>
                <td style="border:0px;text-align:right;">
                  <b>{{ bill.subtotal | numberFormat }}</b>
                </td>
              </tr>
              <tr
                v-if="bill.discount_percent"
                slot="p-body"
              >
                <td style="border:0px;">
                  <b>{{ $t('discount') | titlecase }}</b>
                </td>
                <td style="border:0px;text-align:right;">
                  <b>{{ bill.discount_percent | numberFormat }}%</b>
                </td>
              </tr>
              <tr slot="p-body">
                <td style="border:0px;">
                  <b>{{ $t('total') | titlecase }}</b>
                </td>
                <td style="border:0px;text-align:right;">
                  <b>{{ bill.amount | numberFormat }}</b>
                </td>
              </tr>
              <tr
                v-if="bill.paid"
                slot="p-body"
              >
                <td style="border:0px;">
                  <b>{{ $t('money received') | titlecase }}</b>
                </td>
                <td style="border:0px;text-align:right;">
                  <b>{{ bill.paid | numberFormat }}</b>
                </td>
              </tr>
              <tr slot="p-body">
                <td style="border:0px;">
                  <b>{{ $t('money change') | titlecase }}</b>
                </td>
                <td style="border:0px;text-align:right;">
                  <b
                    v-if="bill.change < 0"
                    style="color:red;"
                  >{{ bill.change | numberFormat }}</b>
                  <b
                    v-else
                    style="color:green;"
                  >{{ bill.change | numberFormat }}</b>
                </td>
              </tr>
              <tr
                v-if="bill.notes"
                slot="p-body"
              >
                <td
                  style="border:0px;"
                  colspan="2"
                >
                  <b>{{ $t('notes') | titlecase }}:</b>
                  <br>
                  {{ bill.notes }}
                </td>
              </tr>
              <tr slot="p-body">
                <td
                  v-if="bill.form.created_by"
                  style="border:0px;"
                  colspan="2"
                >
                  Billed by <b>{{ bill.form.created_by.name }}</b>
                </td>
              </tr>
            </p-table>
            <button
              v-if="$permission.has('delete pos')"
              type="button"
              class="btn btn-block btn-danger"
              :disabled="isDeleting"
              style="margin-bottom:30px;"
              @click="onDelete"
            >
              <i
                v-show="isDeleting"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('delete') | uppercase }}
            </button>
          </div>
        </div>
      </p-block-inner>
    </p-block>

    <m-inventory
      :id="'inventory'"
      ref="inventory"
      :key="'inventory'"
      :is-pos="true"
      :item-unit="selectedItem.unit"
      :inventories="selectedItem.inventories"
      :require-expiry-date="selectedItem.require_expiry_date"
      :require-production-number="selectedItem.require_production_number"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPos from '@/views/pos/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPos
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      items_temporary: [],
      selectedItem: {
        unit: null,
        inventories: [],
        require_expiry_date: 0,
        require_production_number: 0
      }
    }
  },
  computed: {
    ...mapGetters('posBill', ['bill'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.posBillRequest()
      }
    }
  },
  created () {
    this.isLoading = true
    this.posBillRequest()
  },
  methods: {
    ...mapActions('posBill', {
      findBill: 'find',
      deleteBill: 'delete'
    }),
    posBillRequest () {
      this.isLoading = true
      this.findBill({
        id: this.id,
        params: {
          filter_form: 'activeDone',
          includes: 'form;customer;items.item;services.service;form.createdBy'
        }
      }).then(response => {
        this.items_temporary = []
        for (const index in this.bill.items) {
          const item = this.bill.items[index]
          const itemTemporaryIndex = this.items_temporary.findIndex(o => o.item_id === item.item_id && o.unit === item.unit)
          if (itemTemporaryIndex < 0) {
            var newItem = Object.assign({}, item)
            newItem.inventories = []
            newItem.require_expiry_date = item.item.require_expiry_date
            newItem.require_production_number = item.item.require_production_number
            newItem.inventories.push({
              quantity: item.quantity,
              expiry_date: item.expiry_date,
              production_number: item.production_number
            })
            this.items_temporary.push(newItem)
          } else {
            var existing = this.items_temporary[itemTemporaryIndex]
            existing.quantity += item.quantity
            existing.inventories.push({
              quantity: item.quantity,
              expiry_date: item.expiry_date,
              production_number: item.production_number
            })
            this.items_temporary[itemTemporaryIndex] = existing
          }
        }
        this.isLoading = false
        this.calculate()
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    calculate () {
      this.bill.subtotal = 0
      this.bill.total_quantity = 0
      this.items_temporary.forEach(item => {
        item.discount_value = parseFloat(item.price) * parseFloat(item.discount_percent) / 100
        item.total = parseFloat(item.quantity) * (parseFloat(item.price) - parseFloat(item.discount_value))
        this.bill.subtotal += parseFloat(item.total)
        this.bill.total_quantity += parseFloat(item.quantity)
      })
      this.bill.services.forEach(service => {
        service.discount_value = parseFloat(service.price) * parseFloat(service.discount_percent) / 100
        service.total = parseFloat(service.quantity) * (parseFloat(service.price) - parseFloat(service.discount_value))
        this.bill.subtotal += parseFloat(service.total)
        this.bill.total_quantity += parseFloat(service.quantity)
      })
      this.bill.change = parseFloat(this.bill.paid) - parseFloat(this.bill.amount)
    },
    showItem (index, item) {
      if (!this.isLoading && !this.isDeleting) {
        this.selectedItem = Object.assign({}, item)
        if (item.require_expiry_date || item.require_production_number) {
          this.$refs.inventory.show(this.selectedItem)
        }
      }
    },
    onDelete () {
      this.isDeleting = true
      this.deleteBill({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('delete success')
        this.$router.push('/pos/closed-bill')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
