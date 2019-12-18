<template>
  <div>
    <breadcrumb>
      <breadcrumb-pos/>
      <router-link to="/pos/open-bill" class="breadcrumb-item">{{ $t('open bill') | titlecase }}</router-link>
      <router-link
        :to="{ name: 'pos.open-bill.show', params: { id: id }}"
        class="breadcrumb-item">{{ id }}</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <form class="row">
      <p-block
        :header="true"
        :title="$t('edit bill') + ' (' + bill.form.number + ')'"
        :is-fullscreen="true"
        :show-fullscreen-button="false"
        :show-hidden-button="false"
        column="col-sm-12">

        <template v-slot:header>
          |<router-link
            v-if="$permission.has('create pos')"
            to="/pos/open-bill/create"
            exact>
            <button
              type="button"
              class="btn-block-option">
              Add
            </button>
          </router-link>
          |<router-link
            v-if="$permission.has('read pos')"
            to="/pos/open-bill"
            exact>
            <button
              type="button"
              class="btn-block-option">
              List
            </button>
          </router-link>
        </template>

        <p-block-inner :is-loading="isGroupLoading">
          <div class="row">
            <div class="col-sm-8">
              <ul class="nav nav-tabs nav-tabs-alt mb-15" data-toggle="tabs" role="tablist">
                <li class="nav-item" v-for="(group, index) in groups" :key="index">
                  <a class="nav-link active" v-if="currentGroup && group.id === currentGroup.id">{{ group.name }}</a>
                  <a class="nav-link" style="cursor:pointer;" v-else @click="selectGroup(group)">{{ group.name }}</a>
                </li>
              </ul>

              <p-form-input
                id="search-text"
                name="search-text"
                placeholder="Search"
                v-model="searchText"
                :disabled="isSaving || isDeleting || isLoading || isGroupLoading"
                @input="filterSearch"/>

              <p-block-inner :is-loading="isLoading">
                <div class="row gutters-tiny">
                  <template v-for="(item, index) in itemList">
                    <p-box-item
                      v-if="groupItemList.includes(item.item_id)"
                      :id="'item-' + index"
                      :key="'item-' + index"
                      :name="item.item_name"
                      :price="item.price"
                      :unit="item.unit"
                      :clicked="chooseItem"
                      :item="item"/>
                  </template>
                  <template v-for="(service, index) in serviceList">
                    <p-box-item
                      v-if="groupServiceList.includes(service.service_id)"
                      :id="'service-' + index"
                      :key="'service-' + index"
                      :name="service.service_name"
                      :price="service.price"
                      :clicked="chooseService"
                      :item="service"/>
                  </template>
                </div>
                <p-pagination
                  v-if="itemList.length !== 0"
                  :current-page="currentPageItem"
                  :last-page="lastPageItem"
                  @updatePageItem="updatePageItem">
                </p-pagination>
                <p-pagination
                  v-if="serviceList.length !== 0"
                  :current-page="currentPageService"
                  :last-page="lastPageService"
                  @updatePageService="updatePageService">
                </p-pagination>
              </p-block-inner>
            </div>

            <div class="col-sm-4" style="background-color:LightGray;">
              <p-table style="margin-bottom:0px;">
                <tr slot="p-body">
                  <td>
                    {{ $t('customer') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <div slot="body" style="text-align:right;">
                      <m-customer id="customer" v-model="form.customer_id" @choosen="chooseCustomer"/>
                    </div>
                  </td>
                </tr>
                <tr slot="p-body" v-for="(row, index) in form.items" :key="'item-select-' + index" @click="showItem(index, row)" style="cursor:pointer;">
                  <td style="text-align:left;" width="75%">
                    <template>
                      <label style="cursor:pointer;color:blue;">{{ row.quantity | numberFormat }}x</label>
                      {{ row.price | numberFormat }}
                    </template>
                    <br/>
                    <b>{{ row.item_name }} ({{ row.unit }})</b>
                    <br/>
                    <template v-if="row.production_number && row.expiry_date">
                      {{ row.production_number | uppercase }}. Expires on {{ row.expiry_date | dateFormat('DD MMMM YYYY') }}
                    </template>
                    <template v-else-if="row.production_number && !row.expiry_date">
                      {{ row.production_number | uppercase }}
                    </template>
                    <template v-else-if="!row.production_number && row.expiry_date">
                      <b style="color:red">Production No. Not Available.</b> Expires on {{ row.expiry_date | dateFormat('DD MMMM YYYY') }}
                    </template>
                    <template v-else>
                      <b style="color:red">Production No. Not Available</b>
                    </template>
                    <template v-if="row.discount_percent > 0">
                      <br/>
                      <label style="cursor:pointer;color:orange;">{{ row.discount_percent | numberFormat }}% Discount</label>
                    </template>
                    <template v-if="row.error">
                      <br/>
                      <label style="cursor:pointer;color:red;">{{ row.error }}</label>
                    </template>
                    <template v-if="row.notes">
                      <br/>
                      <br/>
                      <label style="cursor:pinter;">Note: {{ row.notes }}</label>
                    </template>
                  </td>
                  <td style="text-align:right;" width="25%">
                    <b>{{ row.total | numberFormat }}</b>
                  </td>
                </tr>
                <tr slot="p-body" v-for="(row, index) in form.services" :key="'service-select-' + index" @click="showService(index, row)" style="cursor:pointer;">
                  <td style="text-align:left;" width="75%">
                    <template>
                      <label style="cursor:pointer;color:blue;">{{ row.quantity | numberFormat }}x</label>
                      {{ row.price | numberFormat }}
                    </template>
                    <br/>
                    <b>{{ row.service_name }}</b>
                    <template v-if="row.discount_percent > 0">
                      <br/>
                      <label style="cursor:pointer;color:orange;">{{ row.discount_percent | numberFormat }}% Discount</label>
                    </template>
                    <template v-if="row.error">
                      <br/>
                      <label style="cursor:pointer;color:red;">{{ row.error }}</label>
                    </template>
                    <template v-if="row.notes">
                      <br/>
                      <br/>
                      <label style="cursor:pinter;">Note: {{ row.notes }}</label>
                    </template>
                  </td>
                  <td style="text-align:right;" width="25%">
                    <b>{{ row.total | numberFormat }}</b>
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>
                    {{ $t('total items') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <b>{{ form.total_quantity | numberFormat }}</b>
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>
                    {{ $t('sub total') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <b>{{ form.subtotal | numberFormat }}</b>
                  </td>
                </tr>
                <tr slot="p-body" @click="showDiscount()" style="cursor:pointer;">
                  <td>
                    {{ $t('discount') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <template v-if="!form.discount_percent"><b>+</b></template>
                    <template v-else><b>{{ form.discount_percent | numberFormat }}%</b></template>
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>
                    {{ $t('total') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <b>{{ form.amount | numberFormat }}</b>
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>
                    {{ $t('money received') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <div slot="body" style="text-align:right;">
                      <p-form-number
                        id="paid"
                        name="paid"
                        :readonly="isSaving || isDeleting || isLoading || isGroupLoading"
                        v-model="form.paid"
                        @keyup.native="calculate()"/>
                    </div>
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>
                    {{ $t('money change') | titlecase }}
                  </td>
                  <td style="text-align:right;">
                    <b style="color:red;" v-if="form.change < 0">{{ form.change | numberFormat }}</b>
                    <b style="color:green;" v-else>{{ form.change | numberFormat }}</b>
                  </td>
                </tr>
              </p-table>

              <p-form-row
                id="notes"
                name="notes"
                :label="$t('notes')">
                <div slot="body" class="col-lg-12 mt-5">
                  <textarea rows="5" class="form-control" placeholder="Notes" v-model="form.notes" :readonly="isSaving"></textarea>
                </div>
              </p-form-row>
              <div class="form-group row">
                <div class="col-md-12">
                  <button v-if="form.items.length !== 0 || form.services.length !== 0" type="button" class="btn btn-block btn-success" :disabled="isSaving || isDeleting || isLoading || isGroupLoading" @click="charge">
                    <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Charge {{ form.amount | numberFormat }}
                  </button>
                  <button v-if="form.items.length !== 0 || form.services.length !== 0" type="button" class="btn btn-block btn-primary" :disabled="isSaving || isDeleting || isLoading || isGroupLoading" @click="save">
                    <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
                  </button>
                  <button type="button" class="btn btn-block btn-danger" :disabled="isSaving || isDeleting || isLoading || isGroupLoading" @click="onDelete" v-if="$permission.has('delete pos')">
                    <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>

    <discount-modal
      id="discount"
      ref="discount"
      @updateDiscount="updateDiscount"/>

    <item-modal
      id="item"
      ref="item"
      @updateItem="updateItem"
      @deleteItem="deleteItem"/>

    <service-modal
      id="service"
      ref="service"
      @updateService="updateService"
      @deleteService="deleteService"/>

    <inventory-modal
      id="inventory"
      ref="inventory"
      @updateInventory="updateInventory"/>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPos from '@/views/pos/Breadcrumb'
import Form from '@/utils/Form'
import DiscountModal from './DiscountModal'
import ItemModal from './ItemModal'
import ServiceModal from './ServiceModal'
import InventoryModal from './InventoryModal'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPos,
    DiscountModal,
    ItemModal,
    ServiceModal,
    InventoryModal
  },
  data () {
    return {
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      isGroupLoading: false,
      isDeleting: false,
      searchText: '',
      currentGroup: null,
      itemList: [],
      serviceList: [],
      groupItemList: [],
      groupServiceList: [],
      currentPageItem: this.$route.query.pageItem * 1 || 1,
      lastPageItem: 1,
      currentPageService: this.$route.query.pageService * 1 || 1,
      lastPageService: 1,
      form: new Form({
        id: this.$route.params.id,
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        customer_id: null,
        customer_name: null,
        pricing_group_id: -1,
        approver_id: null,
        notes: null,
        subtotal: 0,
        discount_percent: 0,
        discount_value: 0,
        tax_base: 0,
        tax: 0,
        type_of_tax: 'exclude',
        total_quantity: 0,
        amount: 0,
        paid: 0,
        change: 0,
        items: [],
        services: [],
        is_done: 0,
        warehouse_id: null
      })
    }
  },
  watch: {
    'currentGroup' () {
      if (this.currentGroup) {
        this.groupItemList = []
        this.groupServiceList = []

        this.currentGroup.items.forEach(item => {
          this.groupItemList.push(item.id)
        })

        this.currentGroup.services.forEach(service => {
          this.groupServiceList.push(service.id)
        })

        this.updateDisplayedData()
      }
    },
    'form.customer_id' () {
      if (this.form.customer_id && !this.isLoading) {
        this.isLoading = true
        this.findCustomer({
          id: this.form.customer_id
        }).then(response => {
          if (this.customer.pricing_group_id) {
            this.form.pricing_group_id = this.customer.pricing_group_id
          } else {
            this.form.pricing_group_id = -1
          }
          this.requestPriceListData()
        }).catch(error => {
          this.$notification.error(error.message)
        })
      }
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer']),
    ...mapGetters('masterGroup', ['groups']),
    ...mapGetters('masterPriceListItem', {
      items: 'items',
      paginationItem: 'pagination'
    }),
    ...mapGetters('masterPriceListService', {
      services: 'services',
      paginationService: 'pagination'
    }),
    ...mapGetters('posBill', ['bill'])
  },
  methods: {
    ...mapActions('masterCustomer', {
      findCustomer: 'find'
    }),
    ...mapActions('masterGroup', {
      getGroups: 'get'
    }),
    ...mapActions('masterPriceListItem', {
      getPriceListItem: 'get'
    }),
    ...mapActions('masterPriceListService', {
      getPriceListService: 'get'
    }),
    ...mapActions('posBill', {
      findBill: 'find',
      updateBill: 'update',
      deleteBill: 'delete'
    }),
    getGroupRequest () {
      return this.getGroups({
        params: {
          or_filter_equal: {
            'groups.class_reference': [
              'Item',
              'Service'
            ]
          },
          class_reference: [
            'Item',
            'Service'
          ],
          type: 'POS',
          includes: 'items;services'
        }
      })
    },
    getItemRequest () {
      return this.getPriceListItem({
        params: {
          filter_like: {
            name: this.searchText,
            'units.label': this.searchText
          },
          pricing_group_id: this.form.pricing_group_id,
          filter_has: 'units,units.prices',
          includes: 'units;units.prices',
          sort_by: 'items.name',
          page: this.currentPageItem
        }
      })
    },
    getServiceRequest () {
      return this.getPriceListService({
        params: {
          filter_like: {
            name: this.searchText
          },
          pricing_group_id: this.form.pricing_group_id,
          filter_has: 'prices',
          includes: 'prices',
          sort_by: 'services.name',
          page: this.currentPageService
        }
      })
    },
    requestAllData () {
      this.isGroupLoading = true
      Promise.all([this.getGroupRequest(), this.getItemRequest(), this.getServiceRequest()]).then(results => {
        if (!this.currentGroup) {
          this.groups.forEach(group => {
            if (!this.currentGroup) {
              this.currentGroup = group
            }
          })
        }
        this.updateDisplayedData()
        this.isGroupLoading = false
      }).catch(error => {
        this.isGroupLoading = false
        this.$notification.error(error.message)
      })
    },
    requestPriceListData () {
      this.isLoading = true
      Promise.all([this.getItemRequest(), this.getServiceRequest()]).then(results => {
        this.updateDisplayedData()
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    filterSearch: debounce(function (value) {
      this.currentPageItem = 1
      this.currentPageService = 1
      this.requestPriceListData()
    }, 300),
    updatePageItem (value) {
      this.currentPageItem = value
      this.requestPriceListData()
    },
    updatePageService (value) {
      this.currentPageService = value
      this.requestPriceListData()
    },
    selectGroup (group) {
      if (!this.isSaving && !this.isDeleting && !this.isLoading && !this.isGroupLoading) {
        this.currentGroup = group
      }
    },
    chooseCustomer (value) {
      this.form.customer_name = value
    },
    chooseItem (item) {
      this.$refs.inventory.show(item)
    },
    chooseService (service) {
      let serviceIndex = this.form.services.findIndex(o => o.service_id === service.service_id)
      if (serviceIndex >= 0) {
        var existingService = this.form.services[serviceIndex]
        existingService.quantity += 1
        this.$set(this.form.services, serviceIndex, existingService)
      } else {
        var newService = service
        newService.quantity = 1
        this.form.services.push(newService)
      }
      this.calculate()
    },
    showDiscount () {
      if (!this.isSaving && !this.isDeleting && !this.isLoading && !this.isGroupLoading) {
        this.$refs.discount.show(this.form.discount_percent)
      }
    },
    showItem (index, item) {
      if (!this.isSaving && !this.isDeleting && !this.isLoading && !this.isGroupLoading) {
        this.$refs.item.show(index, item)
      }
    },
    showService (index, service) {
      if (!this.isSaving && !this.isDeleting && !this.isLoading && !this.isGroupLoading) {
        this.$refs.service.show(index, service)
      }
    },
    updateDiscount (data) {
      this.form.discount_percent = data.discount_percent
      this.calculate()
    },
    updateItem (data) {
      let item = data.item
      var existingItem = this.form.items[item.index]
      if (existingItem) {
        if (item.quantity > 0) {
          existingItem.quantity = item.quantity
          existingItem.discount_percent = item.discount_percent || 0
          existingItem.notes = item.notes
          this.$set(this.form.items, item.index, existingItem)
        } else {
          this.form.items.splice(item.index, 1)
        }
        this.calculate()
      }
    },
    updateService (data) {
      let service = data.service
      var existingService = this.form.services[service.index]
      if (existingService) {
        if (service.quantity > 0) {
          existingService.quantity = service.quantity
          existingService.discount_percent = service.discount_percent || 0
          existingService.notes = service.notes
          this.$set(this.form.services, service.index, existingService)
        } else {
          this.form.services.splice(service.index, 1)
        }
        this.calculate()
      }
    },
    updateInventory (data) {
      let itemIndex = this.form.items.findIndex(o => o.item_id === data.item.item_id && o.unit === data.item.unit && o.production_number === data.item.production_number && o.expiry_date === data.item.expiry_date)
      if (itemIndex >= 0) {
        var existingItem = this.form.items[itemIndex]
        existingItem.quantity += 1
        this.$set(this.form.items, itemIndex, existingItem)
      } else {
        var newItem = JSON.parse(JSON.stringify(data.item))
        newItem.quantity = 1
        this.form.items.push(newItem)
      }
      this.calculate()
    },
    deleteItem (data) {
      let item = data.item
      let existingItem = this.form.items[item.index]
      if (existingItem) {
        this.form.items.splice(item.index, 1)
        this.calculate()
      }
    },
    deleteService (data) {
      let service = data.service
      let existingService = this.form.services[service.index]
      if (existingService) {
        this.form.services.splice(service.index, 1)
        this.calculate()
      }
    },
    updateDisplayedData () {
      this.itemList = []
      this.serviceList = []

      this.items.forEach(item => {
        item.units.forEach(unit => {
          unit.prices.forEach(price => {
            if (price.price !== 0) {
              if (this.form.pricing_group_id === -1 && price.pricing_group_id) {
                this.form.pricing_group_id = price.pricing_group_id
              }
              if (this.form.pricing_group_id && this.form.pricing_group_id === price.pricing_group_id) {
                let newItem = {
                  item_id: item.id,
                  item_name: item.name,
                  unit: unit.label,
                  converter: unit.converter,
                  quantity: 0,
                  price: price.price,
                  discount_value: 0,
                  discount_percent: 0,
                  total: 0,
                  pricing_group_id: price.pricing_group_id,
                  notes: null,
                  error: null
                }
                this.itemList.push(newItem)
              }
            }
          })
        })
      })

      this.services.forEach(service => {
        service.prices.forEach(price => {
          if (price.price !== 0) {
            if (this.form.pricing_group_id === -1 && price.pricing_group_id) {
              this.form.pricing_group_id = price.pricing_group_id
            }
            if (this.form.pricing_group_id && this.form.pricing_group_id === price.pricing_group_id) {
              let newService = {
                service_id: service.id,
                service_name: service.name,
                quantity: 0,
                price: price.price,
                discount_value: 0,
                discount_percent: 0,
                total: 0,
                pricing_group_id: price.pricing_group_id,
                notes: null,
                error: null
              }
              this.serviceList.push(newService)
            }
          }
        })
      })

      this.form.items.forEach(item => {
        item.pricing_group_id = this.form.pricing_group_id
      })

      this.form.services.forEach(service => {
        service.pricing_group_id = this.form.pricing_group_id
      })

      this.form.items.forEach(item => {
        let itemIndex = this.itemList.findIndex(o => o.item_id === item.item_id && o.unit === item.unit && o.pricing_group_id == item.pricing_group_id)
        if (itemIndex >= 0) {
          item.price = this.itemList[itemIndex].price
          item.error = null
        } else {
          item.error = 'Item not Available'
        }
      })

      this.form.services.forEach(service => {
        let serviceIndex = this.serviceList.findIndex(o => o.service_id === service.service_id && o.pricing_group_id == service.pricing_group_id)
        if (serviceIndex >= 0) {
          service.price = this.serviceList[serviceIndex].price
          service.error = null
        } else {
          service.error = 'Item not Available'
        }
      })

      this.calculate()
    },
    calculate: debounce(function (value) {
      this.form.subtotal = 0
      this.form.total_quantity = 0
      this.form.items.forEach(item => {
        item.discount_value = parseFloat(item.price) * parseFloat(item.discount_percent) / 100
        item.total = parseFloat(item.quantity) * parseFloat(item.converter) * (parseFloat(item.price) - parseFloat(item.discount_value))
        this.form.subtotal += parseFloat(item.total)
        this.form.total_quantity += parseFloat(item.quantity)
      })
      this.form.services.forEach(service => {
        service.discount_value = parseFloat(service.price) * parseFloat(service.discount_percent) / 100
        service.total = parseFloat(service.quantity) * (parseFloat(service.price) - parseFloat(service.discount_value))
        this.form.subtotal += parseFloat(service.total)
        this.form.total_quantity += parseFloat(service.quantity)
      })
      this.form.discount_value = this.form.subtotal * this.form.discount_percent / 100
      this.form.tax_base = this.form.subtotal - this.form.discount_value
      this.form.tax = this.form.tax_base * 10 / 100
      this.form.amount = this.form.tax_base + this.form.tax
      this.form.change = parseFloat(this.form.paid) - parseFloat(this.form.amount)
    }, 100),
    validate () {
      if (this.form.items.length === 0 && this.form.services.length === 0) {
        this.$notification.error('Please Add at least one Item or Service')
        return false
      }
      // check
      var itemValid = true

      this.form.items.forEach(item => {
        let itemIndex = this.itemList.findIndex(o => o.item_id === item.item_id && o.unit === item.unit && o.pricing_group_id == item.pricing_group_id)
        if (itemIndex < 0) {
          itemValid = false
        }
      })

      this.form.services.forEach(service => {
        let serviceIndex = this.serviceList.findIndex(o => o.service_id === service.service_id && o.pricing_group_id == service.pricing_group_id)
        if (serviceIndex < 0) {
          itemValid = false
        }
      })

      if (!itemValid) {
        this.$notification.error('Item not Available')
        return false
      }

      return true
    },
    save () {
      if (this.validate()) {
        this.isSaving = true
        this.form.is_done = 0
        this.updateBill(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('save success')
            this.id = response.data.id
            this.form.id = response.data.id
            this.$router.push('/pos/open-bill/' + response.data.id + '/edit')
          }).catch(error => {
            this.isSaving = false
            this.$notification.error(error.message)
            this.form.errors.record(error.errors)
          })
      }
    },
    charge () {
      if (this.validate()) {
        this.calculate()
        if (this.form.paid < this.form.amount) {
          this.$notification.error('Please Pay the Amount Correctly')
          return
        }
        this.isSaving = true
        this.form.is_done = 1
        this.updateBill(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('charge success')
            this.$router.push('/pos/closed-bill/' + response.data.id)
          }).catch(error => {
            this.isSaving = false
            this.$notification.error(error.message)
            this.form.errors.record(error.errors)
          })
      }
    },
    onDelete () {
      this.isDeleting = true
      this.deleteBill({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('delete success')
        this.$router.push('/pos/open-bill')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.isGroupLoading = true
    this.findBill({
      id: this.id,
      params: {
        filter_form: 'activePending',
        includes: 'form;customer;items.item;services.service;form.createdBy'
      }
    }).then(response => {
      if (!this.$formRules.allowedToUpdate(this.bill.form)) {
        this.$router.replace('/open-bill')
      }
      this.form.date = this.bill.form.date
      this.form.edited_form_number = this.bill.form.edited_form_number
      this.form.customer_id = this.bill.customer_id
      this.form.customer_name = this.bill.customer_name
      this.form.pricing_group_id = this.bill.customer ? this.bill.customer.pricing_group_id : -1
      this.form.notes = this.bill.notes
      this.form.discount_percent = parseFloat(this.bill.discount_percent)
      this.form.type_of_tax = this.bill.type_of_tax
      this.form.paid = parseFloat(this.bill.paid)
      this.form.warehouse_id = this.bill.warehouse_id
      this.bill.items.forEach((item, keyItem) => {
        this.form.items.push({
          item_id: item.item_id,
          item_name: item.item_name,
          unit: item.unit,
          converter: item.converter,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          discount_value: parseFloat(item.discount_value),
          discount_percent: parseFloat(item.discount_percent),
          total: 0,
          pricing_group_id: this.form.pricing_group_id,
          notes: item.notes,
          production_number: item.production_number,
          expiry_date: item.expiry_date
        })
      })
      this.bill.services.forEach((service, keyService) => {
        this.form.services.push({
          service_id: service.service_id,
          service_name: service.service_name,
          quantity: parseFloat(service.quantity),
          price: parseFloat(service.price),
          discount_value: parseFloat(service.discount_value),
          discount_percent: parseFloat(service.discount_percent),
          total: 0,
          pricing_group_id: this.form.pricing_group_id,
          notes: service.notes
        })
      })
      this.requestAllData()
    }).catch(error => {
      this.isGroupLoading = false
      this.$notification.error(error.message)
    })
  },
  updated () {
    if (this.itemList.length !== 0) {
      this.lastPageItem = this.paginationItem.last_page
    }
    if (this.serviceList.length !== 0) {
      this.lastPageService = this.paginationService.last_page
    }
  }
}
</script>
