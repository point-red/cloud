<template>
  <div>
    <p-loading-block
      v-show="isLoading"
      :message="loadingMessage"
    />

    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-pin-point />
      <router-link
        to="/plugin/pin-point/sales-visitation-form"
        class="breadcrumb-item"
      >
        {{ $t('sales visitation') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :is-loading="isLoading"
        :header="false"
        :title="$t('sales visitation')"
        column="col-sm-12"
      >
        <h5>{{ $t('sales visitation') | uppercase }}</h5>

        <hr>

        <p-form-row :label="$t('photo')">
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-camera
              :image="form.image"
              @onCaptured="onCaptured($event)"
            />
          </div>
        </p-form-row>

        <p-form-row
          id="customer"
          v-model="form.customer"
          name="customer"
          :label="$t('customer')"
          :disabled="isSaving"
          :errors="form.errors.get('customer')"
          @errors="form.errors.set('customer', null)"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <span
              class="select-link"
              @click="$refs.customer.open()"
            >{{ form.customer_name || $t('select') | uppercase }}</span>
          </div>
        </p-form-row>

        <p-form-row :label="'customer group'">
          <div
            slot="body"
            class="col-lg-9"
          >
            <span
              class="select-link"
              @click="$refs.group.open()"
            >{{ form.group_name || $t('select') | uppercase }}</span>
          </div>
        </p-form-row>

        <p-form-row
          id="gmap"
          name="gmap"
          :label="'Google Map - ' + $t('address')"
          :placeholder="'' + $t('address')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <iframe
              width="100%"
              height="250"
              :src="`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${center.lng},${center.lat},16,0,0/800x250?access_token=${mapboxApiKey}`"
              title="Streets"
              style="border:none;"
            />
          </div>
        </p-form-row>

        <p-form-row
          id="address"
          v-model="form.address"
          name="address"
          :label="$t('address')"
          :placeholder="$t('address')"
          :disabled="isSaving"
          :errors="form.errors.get('address')"
          @errors="form.errors.set('address', null)"
        />

        <p-form-row
          id="district"
          v-model="form.district"
          name="district"
          :placeholder="$t('district')"
          :disabled="isSaving"
          :errors="form.errors.get('district')"
          @errors="form.errors.set('district', null)"
        />

        <p-form-row
          id="sub_district"
          v-model="form.sub_district"
          name="sub_district"
          :placeholder="$t('sub district')"
          :disabled="isSaving"
          :errors="form.errors.get('sub_district')"
          @errors="form.errors.set('sub_district', null)"
        />

        <p-form-row
          id="phone"
          v-model="form.phone"
          name="phone"
          :label="$t('phone')"
          :disabled="isSaving"
          :errors="form.errors.get('phone')"
          @errors="form.errors.set('phone', null)"
        />

        <p-form-row
          id="similar-product"
          name="similar_product"
          :label="$t('similar product') | titlecase"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <span
              class="select-link"
              @click="$refs.similarProduct.open(form.similar_products)"
            >
              <template v-if="form.similar_products.length == 0">{{ $t('select') | uppercase }}</template>
              <template v-for="(similarProduct, index) in form.similar_products">
                {{ similarProduct.name | uppercase }}<template v-if="index + 1 != form.similar_products.length">,</template>
              </template>
            </span>
          </div>
        </p-form-row>

        <p-form-row
          id="interest"
          name="interest"
          :label="$t('interest reason') | titlecase"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <span
              class="select-link"
              @click="$refs.interestReason.open(form.interest_reasons)"
            >
              <template v-if="form.interest_reasons.length == 0">{{ $t('select') | uppercase }}</template>
              <template v-for="(interestReason, index) in form.interest_reasons">
                {{ interestReason.name | uppercase }}<template v-if="index + 1 != form.interest_reasons.length">,</template>
              </template>
            </span>
          </div>
        </p-form-row>

        <p-form-row
          id="no-interest"
          name="no_interest"
          :label="$t('no interest reason')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <span
              class="select-link"
              @click="$refs.noInterestReason.open(form.no_interest_reasons)"
            >
              <template v-if="form.no_interest_reasons.length == 0">{{ $t('select') | uppercase }}</template>
              <template v-for="(noInterestReason, index) in form.no_interest_reasons">
                {{ noInterestReason.name | uppercase }}<template v-if="index + 1 != form.no_interest_reasons.length">,</template>
              </template>
            </span>
          </div>
        </p-form-row>

        <p-form-row
          id="notes"
          v-model="form.notes"
          name="notes"
          :label="'notes'"
          :disabled="isSaving"
          :errors="form.errors.get('notes')"
          @errors="form.errors.set('notes', null)"
        />

        <p-separator />

        <h5>{{ $t('form sales') | uppercase }}</h5>

        <hr>

        <p-form-row :label="$t('date')">
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              id="date"
              v-model="form.date"
              name="date"
              label="date"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"
            />
          </div>
        </p-form-row>

        <hr>

        <p-form-row :label="$t('payment method') | titlecase">
          <div
            slot="body"
            class="col-lg-9"
          >
            <label class="css-control css-control-primary css-radio">
              <input
                v-model="form.payment_method"
                type="radio"
                class="css-control-input"
                name="radio-group2"
                :value="'cash'"
              >
              <span class="css-control-indicator" /> Tunai
            </label>
            <label class="css-control css-control-primary css-radio">
              <input
                v-model="form.payment_method"
                type="radio"
                class="css-control-input"
                name="radio-group2"
                :value="'credit'"
              >
              <span class="css-control-indicator" /> Tempo
            </label>
            <label class="css-control css-control-primary css-radio">
              <input
                v-model="form.payment_method"
                type="radio"
                class="css-control-input"
                name="radio-group2"
                :value="'taking-order'"
              >
              <span class="css-control-indicator" /> Taking Order
            </label>
            <label class="css-control css-control-primary css-radio">
              <input
                v-model="form.payment_method"
                type="radio"
                class="css-control-input"
                name="radio-group2"
                :value="'sell-out'"
              >
              <span class="css-control-indicator" /> Sell Out
            </label>
          </div>
        </p-form-row>

        <p-form-row
          v-show="form.payment_method === 'credit'"
          id="date"
          name="date"
          :label="$t('due date')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-date-picker
              id="date"
              v-model="form.due_date"
              name="date"
              label="date"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"
            />
          </div>
        </p-form-row>

        <p-form-row
          v-show="form.payment_method === 'credit'"
          :label="$t('payment received') | titlecase"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-form-number
              id="payment-received"
              v-model="form.payment_received"
              name="payment_received"
              :disabled="isSaving"
              :errors="form.errors.get('payment_received')"
              :is-text-right="false"
              @errors="form.errors.set('payment_received', null)"
            />
          </div>
        </p-form-row>

        <p-table>
          <tr slot="p-head">
            <th>Item</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Total</th>
          </tr>
          <tr
            v-for="(row, index) in form.items"
            slot="p-body"
            :key="'row-' + index"
          >
            <td>
              <span
                class="select-link"
                @click="$refs.item.open(index)"
              >
                {{ row.item_label || $t('select') | uppercase }}
              </span>
            </td>
            <td>
              <p-quantity
                :id="'quantity' + index"
                v-model="row.quantity"
                :name="'quantity' + index"
                :item-id="row.item_id"
                :units="row.units"
                :unit="{
                  name: row.unit,
                  label: row.unit,
                  converter: row.converter
                }"
                :max="row.quantity_pending * 1"
                :readonly="onClickUnit(row)"
                @choosen="chooseUnit($event, row)"
                @click.native="onClickQuantity(row, index)"
                @keyup.native="calculate"
              />
            </td>
            <td>
              <p-form-number
                :id="'price' + index"
                v-model="row.price"
                :name="'price' + index"
                :disabled="row.item_id == null"
                @keyup.native="calculate"
              />
            </td>
            <td>
              <p-form-number
                :id="'total' + index"
                v-model="row.total"
                :name="'total' + index"
                :disabled="true"
              />
            </td>
          </tr>
          <tr slot="p-body">
            <td />
            <td />
            <td>Total</td>
            <td>
              <p-form-number
                v-model="form.total_price"
                :readonly="true"
                :is-text-right="true"
              />
            </td>
          </tr>
        </p-table>

        <hr>

        <div class="form-group row">
          <div class="col-md-12">
            <button
              :disabled="isSaving"
              type="submit"
              class="btn btn-sm btn-primary"
            >
              <i
                v-show="isSaving"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('save') | uppercase }}
            </button>
          </div>
        </div>
      </p-block>
    </form>
    <m-inventory-out
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @updated="updateDna($event)"
    />
    <m-warehouse
      id="warehouse_id"
      ref="warehouse"
      @choosen="chooseWarehouse($event)"
    />
    <m-customer
      ref="customer"
      @choosen="chooseCustomer"
    />
    <m-customer-group
      ref="group"
      @choosen="chooseGroup"
    />
    <m-item
      ref="item"
      @choosen="chooseItem($event)"
    />
    <m-m-interest-reason
      ref="interestReason"
      @choosen="chooseInterestReason($event)"
    />
    <m-m-no-interest-reason
      ref="noInterestReason"
      @choosen="chooseNoInterestReason($event)"
    />
    <m-m-similar-product
      ref="similarProduct"
      @choosen="chooseSimilarProduct($event)"
    />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import Form from '@/utils/Form'
import MMInterestReason from './MMInterestReason'
import MMNoInterestReason from './MMNoInterestReason'
import MMSimilarProduct from './MMSimilarProduct'
import { mapActions, mapGetters } from 'vuex'
import axios from '@/axios'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPinPoint,
    MMInterestReason,
    MMNoInterestReason,
    MMSimilarProduct
  },
  data () {
    return {
      mapboxApiKey: process.env.VUE_APP_MAPBOX_APIKEY,
      mapboxResult: {},
      isLoading: false,
      loadingMessage: 'Loading...',
      isSaving: false,
      warehouseId: null,
      warehouseName: null,
      form: new Form({
        date: this.serverDateTime(),
        image: null,
        customer_id: null,
        branch_id: null,
        warehouse_id: null,
        customer_name: this.$route.query.name || '',
        address: this.$route.query.address || '',
        district: this.$route.query.district || '',
        sub_district: this.$route.query.sub_district || '',
        latitude: this.$route.query.latitude || '',
        longitude: this.$route.query.longitude || '',
        group_id: null,
        group_name: null,
        phone: '',
        notes: '',
        interest_reasons: [],
        no_interest_reasons: [],
        similar_products: [],
        items: [],
        total_price: 0,
        payment_method: 'cash',
        due_date: null,
        received_payment: 0
      }),
      // Google Map
      center: { lat: 23.8103, lng: 90.4125 },
      markers: [
        { position: { lat: 10.0, lng: 10.0 } }
      ],
      addressComponent: {},
      getMap: this.$root.mapping,
      description: '',
      latLng: {},
      place: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  async mounted () {
    this.isLoading = false
    this.loadingMessage = 'Searching current location'
    await this.getLocation()
  },
  created () {
    this.addItemRow()
    this.form.branch_id = this.authUser.branch.id
    this.form.warehouse_id = this.authUser.warehouse.id
    this.warehouseId = this.authUser.warehouse.id
    this.warehouseName = this.authUser.warehouse.name
  },
  methods: {
    ...mapActions('pluginPinPointSalesVisitationForm', ['create']),
    chooseWarehouse (option) {
      this.warehouseId = option.id
      this.warehouseName = option.name
      this.form.warehouse_id = option.id
    },
    onClickQuantity (row, index) {
      if (this.form.payment_method == 'sell-out' || this.form.payment_method == 'taking-order') {
        return
      }
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        row.warehouse_id = this.warehouseId
        row.index = index
        this.$refs.inventory.open(row, row.quantity)
      }
    },
    onClickUnit (row) {
      if (this.form.payment_method == 'sell-out' || this.form.payment_method == 'taking-order') {
        return false
      }

      if (row.item || row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }
      return false
    },
    chooseUnit (unit, row) {
      row.unit = unit.label
      row.converter = unit.converter
    },
    updateDna (e) {
      console.log(e)
      this.form.items[e.index].dna = e.dna
      this.form.items[e.index].quantity = e.quantity
      this.form.items[e.index].unit = e.unit
      this.form.items[e.index].converter = e.converter
    },
    onCaptured (value) {
      this.form.image = value
    },
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.center.lat = pos.lat
          this.center.lng = pos.lng
          this.mapboxResult = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.center.lng},${this.center.lat}.json?access_token=${this.mapboxApiKey}`)
          this.setDescription(this.mapboxResult.data.features[0].place_name)
          this.form.address = this.mapboxResult.data.features[0].place_name
          this.mapboxResult.data.features[0].context.forEach(el => {
            if (el.id.includes('locality')) {
              this.form.district = el.text
            }
            if (el.id.includes('neighborhood')) {
              this.form.sub_district = el.text
            }
          })
          this.form.latitude = pos.lat
          this.form.longitude = pos.lng
          this.markers[0].position.lat = pos.lat
          this.markers[0].position.lng = pos.lng
          this.$refs.map.$mapPromise.then(() => {
            this.isLoading = false
            // eslint-disable-next-line no-undef
            this.geocodeLatLng(new google.maps.Geocoder(), pos, google.maps.InfoWindow)
          }).catch(error => {
            this.isLoading = false
          })
        }.bind(this))
      } else {
        this.loadingMessage = 'Geolocation not available, please update your browser or using another browser'
      }
    },
    addMoreSimilarProduct () {
      this.form.similar_products.push({
        id: null,
        name: null
      })
    },
    chooseCustomer (option) {
      if (option.groups.length >= 1) {
        this.form.group_id = option.groups[0].id
        this.form.group_name = option.groups[0].name
      }
      this.form.customer_id = option.id
      this.form.customer_name = option.name
    },
    chooseGroup (option) {
      this.form.group_id = option.id
      this.form.group_name = option.name
    },
    // [Start] Google Map
    setDescription (description) {
      this.description = description
    },
    setPlace (place) {
      this.center.lat = place.geometry.location.lat()
      this.center.lng = place.geometry.location.lng()
      this.markers[0].position.lat = place.geometry.location.lat()
      this.markers[0].position.lng = place.geometry.location.lng()
      this.addressComponent = place
      this.setDescription(this.addressComponent.formatted_address)
      this.form.address = this.addressComponent.formatted_address
      this.form.district = ''
      this.form.sub_district = ''
      this.addressComponent.address_components.forEach(component => {
        if (component.types) {
          component.types.forEach(types => {
            if (types == 'administrative_area_level_3') {
              this.form.district = component.long_name
            } else if (types == 'administrative_area_level_4') {
              this.form.sub_district = component.long_name
            }
          })
        }
      })
    },
    geocodeLatLng (geocoder, map, infowindow) {
      var self = this
      geocoder.geocode({ location: this.center }, function (results, status) {
        if (status == 'OK') {
          self.addressComponent = results[0]
          self.setDescription(self.addressComponent.formatted_address)
          self.form.address = self.addressComponent.formatted_address
          self.addressComponent.address_components.forEach(component => {
            if (component.types) {
              component.types.forEach(types => {
                if (types == 'administrative_area_level_3') {
                  self.form.district = component.long_name
                } else if (types == 'administrative_area_level_4') {
                  self.form.sub_district = component.long_name
                }
              })
            }
          })
        }
      })
    },
    // [End] Google Map
    addItemRow () {
      this.form.items.push({
        item_id: null,
        item_name: null,
        item_label: null,
        chart_of_account_id: null,
        chart_of_account_name: null,
        require_expiry_date: null,
        require_production_number: null,
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
    chooseItem (item) {
      if (item.id == null) {
        this.clearItem(item.index)
        return
      }

      const row = this.form.items[item.index]
      row.item = item
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.require_production_number = item.require_production_number
      row.require_expiry_date = item.require_expiry_date
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.id == item.unit_default_sales) {
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
      this.calculate()
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
    chooseInterestReason (interestReasons) {
      this.form.interest_reasons = interestReasons
    },
    chooseNoInterestReason (noInterestReasons) {
      this.form.no_interest_reasons = noInterestReasons
    },
    chooseSimilarProduct (similarProducts) {
      this.form.similar_products = similarProducts
    },
    calculate: debounce(function (value) {
      this.form.total_price = 0
      this.form.items.forEach((item) => {
        if (item.price > 0 && item.quantity > 0) {
          item.total = item.quantity * item.price
          this.form.total_price += parseFloat(item.total)
        }
      })
    }, 100),
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Create success')
          this.$store.dispatch('accountRewardPoint/get')
          this.$router.push('/plugin/pin-point/sales-visitation-form')
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          if (error.errors) {
            this.form.errors.record(error.errors)
          }
        })
    }
  }
}
</script>
