<template>
  <div>
    <p-loading-block v-show="isLoading" :message="loadingMessage"/>

    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point/>
      <router-link to="/plugin/pin-point/sales-visitation-form" class="breadcrumb-item">{{ $t('sales visitation') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div v-if="isPermissionCameraGranted == false || isPermissionGeolocationGranted == false">
      <h2><i class="fa fa-warning"></i> {{ $t('permission required') | uppercase }}</h2>
      <p>{{ $t('browser permission warning - sales visitation form') }}</p>
      <hr>
      <b>REFERENCE:</b>
      <br>
      <a href="https://support.google.com/chrome/answer/114662?hl=en">https://support.google.com/chrome/answer/114662</a>
      <br>
      <a href="https://support.google.com/chrome/answer/2693767?hl=en">https://support.google.com/chrome/answer/2693767</a>
    </div>

    <hr>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="isLoading"
        :header="false"
        :title="$t('sales visitation')"
        column="col-sm-12">

        <h5>{{ $t('sales visitation') | uppercase }}</h5>

        <hr>

        <p-form-row :label="$t('photo')">
          <div slot="body" class="col-lg-9">
            <p-camera :image="form.image" @onCaptured="onCaptured($event)"></p-camera>
          </div>
        </p-form-row>

        <p-form-row
          id="customer"
          name="customer"
          :label="$t('customer')"
          :disabled="isSaving"
          v-model="form.customer"
          :errors="form.errors.get('customer')"
          @errors="form.errors.set('customer', null)">
          <div class="col-lg-9" slot="body">
            <span @click="$refs.customer.open()" class="select-link">{{ form.customer_name || $t('select') | uppercase }}</span>
          </div>
        </p-form-row>

        <p-form-row :label="'group'">
          <div class="col-lg-9" slot="body">
            <span @click="$refs.group.open()" class="select-link">{{ form.group_name || $t('select') | uppercase }}</span>
          </div>
        </p-form-row>

        <p-form-row
          id="gmap"
          name="gmap"
          :label="'Google Map - ' + $t('address')"
          :placeholder="'' + $t('address')">
          <div slot="body" class="col-lg-9">
            <gmap-autocomplete :value="description"
              @place_changed="setPlace"
              v-on:keypress.enter.prevent
              :disabled="true"
              class="form-control">
            </gmap-autocomplete>
            <gmap-map
              id="map"
              ref="map"
              :center="center"
              :zoom="15"
              :options="{
                disableDefaultUI: true,
                styles: [
                  {
                    featureType: 'poi.business',
                    stylers: [
                      {
                        visibility: 'off'
                      }
                    ]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'labels.text',
                    stylers: [
                      {
                        visibility: 'off'
                      }
                    ]
                  }
                ]
              }"
              style="width: 100%; height: 200px">
                <gmap-marker
                  :key="index"
                  v-for="(m, index) in markers"
                  :position="center = m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center=m.position"></gmap-marker>
            </gmap-map>
          </div>
        </p-form-row>

        <p-form-row
          id="address"
          name="address"
          :label="$t('address')"
          :placeholder="$t('address')"
          :disabled="isSaving"
          v-model="form.address"
          :errors="form.errors.get('address')"
          @errors="form.errors.set('address', null)">
        </p-form-row>

        <p-form-row
          id="district"
          name="district"
          :placeholder="$t('district')"
          :disabled="isSaving"
          v-model="form.district"
          :errors="form.errors.get('district')"
          @errors="form.errors.set('district', null)">
        </p-form-row>

        <p-form-row
          id="sub_district"
          name="sub_district"
          :placeholder="$t('sub district')"
          :disabled="isSaving"
          v-model="form.sub_district"
          :errors="form.errors.get('sub_district')"
          @errors="form.errors.set('sub_district', null)">
        </p-form-row>

        <p-form-row
          id="phone"
          name="phone"
          :label="$t('phone')"
          :disabled="isSaving"
          v-model="form.phone"
          :errors="form.errors.get('phone')"
          @errors="form.errors.set('phone', null)">
        </p-form-row>

        <p-form-row
          id="similar-product"
          name="similar_product"
          :label="$t('similar product') | titlecase">
          <div slot="body" class="col-lg-9">
            <template v-for="({}, index) in form.similar_products">
              <m-similar-product
                :key="'similar-product-' + index"
                :id="'similar-product-' + index"
                style="float:left"
                class="mr-10"
                :input="form.similar_products[index]"
                @choosen="chooseSimilarProduct($event, index)"
                @clear="clearSimilarProduct($event, index)"/>
            </template>
            <a href="javascript:void(0)" @click="addMoreSimilarProduct"><i class="fa fa-plus"></i></a>
          </div>
        </p-form-row>

        <p-form-row
          id="interest"
          name="interest"
          :label="$t('interest reason') | titlecase">
          <div slot="body" class="col-lg-9">
            <template v-for="({}, index) in form.interest_reasons">
              <m-interest-reason
                :key="'interest-reason-' + index"
                :id="'interest-reason-' + index"
                style="float:left"
                class="mr-10"
                :input="form.interest_reasons[index]"
                @choosen="chooseInterestReason($event, index)"
                @clear="clearInterestReason($event, index)"/>
            </template>
            <a href="javascript:void(0)" @click="addMoreInterestReason"><i class="fa fa-plus"></i></a>
          </div>
        </p-form-row>

        <p-form-row
          id="no-interest"
          name="no_interest"
          :label="$t('no interest reason')">
          <div slot="body" class="col-lg-9">
            <template v-for="({}, index) in form.no_interest_reasons">
              <m-no-interest-reason
                :key="'no-interest-reason-' + index"
                :id="'no-interest-reason-' + index"
                style="float:left"
                class="mr-10"
                :input="form.no_interest_reasons[index]"
                @choosen="chooseNoInterestReason($event, index)"
                @clear="clearNoInterestReason($event, index)"/>
            </template>
            <a href="javascript:void(0)" @click="addMoreNoInterestReason"><i class="fa fa-plus"></i></a>
          </div>
        </p-form-row>

        <p-form-row
          id="notes"
          name="notes"
          :label="'notes'"
          :disabled="isSaving"
          v-model="form.notes"
          :errors="form.errors.get('notes')"
          @errors="form.errors.set('notes', null)">
        </p-form-row>

        <p-separator></p-separator>

        <h5>{{ $t('form sales') | uppercase }}</h5>

        <hr>

        <p-form-row :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date"
              name="date"
              label="date"
              v-model="form.date"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"/>
          </div>
        </p-form-row>

        <p-table>
          <tr slot="p-head">
            <th>Item</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Total</th>
          </tr>
          <tr slot="p-body" v-for="(row, index) in rows" :key="row">
            <td>
              <m-item
                :id="'item-' + index"
                :data-index="index"
                v-model="form.item[index]"
                @choosen="chooseItem($event, row)"/>
            </td>
            <td>
              <p-form-number
                v-model="form.quantity[index]"
                @keyup.native="calculate()"
                :disabled="isSaving"
                :is-text-right="true"/>
            </td>
            <td>
              <p-form-number
                v-model="form.price[index]"
                @keyup.native="calculate()"
                :disabled="isSaving"
                :is-text-right="true"/>
            </td>
            <td>
              <p-form-number
                v-model="form.total[index]"
                :disabled="true"
                :readonly="true"
                :is-text-right="true"/>
            </td>
          </tr>
          <tr slot="p-body">
            <td></td>
            <td></td>
            <td>Total</td>
            <td>
              <p-form-number
                v-model="form.grandTotal"
                :readonly="true"
                :is-text-right="true"/>
            </td>
          </tr>
        </p-table>

        <hr/>

        <p-form-row :label="$t('payment method') | titlecase">
          <div slot="body" class="col-lg-9">
            <label class="css-control css-control-primary css-radio">
              <input type="radio" class="css-control-input" name="radio-group2" v-model="form.payment_method" :value="'cash'">
              <span class="css-control-indicator"></span> Tunai
            </label>
            <label class="css-control css-control-primary css-radio">
              <input type="radio" class="css-control-input" name="radio-group2" v-model="form.payment_method" :value="'credit'">
              <span class="css-control-indicator"></span> Tempo
            </label>
            <label class="css-control css-control-primary css-radio">
              <input type="radio" class="css-control-input" name="radio-group2" v-model="form.payment_method" :value="'taking-order'">
              <span class="css-control-indicator"></span> Taking Order
            </label>
            <label class="css-control css-control-primary css-radio">
              <input type="radio" class="css-control-input" name="radio-group2" v-model="form.payment_method" :value="'sell-out'">
              <span class="css-control-indicator"></span> Sell Out
            </label>
          </div>
        </p-form-row>

        <p-form-row
          id="date"
          name="date"
          v-show="form.payment_method === 'credit'"
          :label="$t('due date')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date"
              name="date"
              label="date"
              v-model="form.due_date"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"/>
          </div>
        </p-form-row>

        <p-form-row :label="$t('payment received') | titlecase" v-show="form.payment_method === 'credit'">
          <div slot="body" class="col-lg-9">
            <p-form-number
              id="payment-received"
              name="payment_received"
              v-model="form.payment_received"
              :disabled="isSaving"
              :errors="form.errors.get('payment_received')"
              @errors="form.errors.set('payment_received', null)"
              :is-text-right="false"/>
          </div>
        </p-form-row>

        <hr/>

        <div class="form-group row">
          <div class="col-md-12">
            <button :disabled="isSaving" type="submit" class="btn btn-sm btn-primary" v-if="isPermissionCameraGranted && isPermissionGeolocationGranted">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
            </button>
            <button :disabled="isSaving" type="button" class="btn btn-sm btn-danger" v-else>
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Required to access your location and camera to use this feature
            </button>
          </div>
        </div>
      </p-block>
    </form>
    <m-customer ref="customer" @choosen="chooseCustomer"/>
    <m-customer-group ref="group" @choosen="chooseGroup"/>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import Form from '@/utils/Form'
import MInterestReason from './MInterestReason'
import MNoInterestReason from './MNoInterestReason'
import MSimilarProduct from './MSimilarProduct'
import { mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPinPoint,
    MInterestReason,
    MNoInterestReason,
    MSimilarProduct
  },
  data () {
    return {
      isLoading: false,
      loadingMessage: 'Loading...',
      isSaving: false,
      isPermissionCameraGranted: true,
      isPermissionGeolocationGranted: true,
      rows: 1,
      form: new Form({
        date: this.serverDateTime(),
        image: null,
        customer_id: null,
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
        interest_reasons: [{
          id: null,
          name: null
        }],
        no_interest_reasons: [{
          id: null,
          name: null
        }],
        similar_products: [{
          id: null,
          name: null
        }],
        item: [''],
        quantity: [0],
        price: [0],
        total: [0],
        grandTotal: 0,
        payment_method: 'cash',
        due_date: null,
        received_payment: 0
      }),
      groupList: [
        { id: 'Hotel', label: 'Hotel' },
        { id: 'Resto', label: 'Resto' },
        { id: 'Cafe', label: 'Cafe' },
        { id: 'Toko', label: 'Toko' },
        { id: 'Warung', label: 'Warung' },
        { id: 'Agen', label: 'Agen' },
        { id: 'Grosir', label: 'Grosir' },
        { id: 'Mini Market', label: 'Mini Market' }
      ],
      itemList: [
        { id: 'B001 REGULER BUBUK 250GR', label: 'B001 REGULER BUBUK 250GR' },
        { id: 'B005 REGULER KOPI GULA 20GR', label: 'B005 REGULER KOPI GULA 20GR' },
        { id: 'B008 REGULER CUP HOREKA 1KG', label: 'B008 REGULER CUP HOREKA 1KG' },
        { id: 'B011 REGULER 3 IN 1 BULK 1KG', label: 'B011 REGULER 3 IN 1 BULK 1KG' },
        { id: 'R001 PREMIUM PACK 70GR', label: 'R001 PREMIUM PACK 70GR' },
        { id: 'R002 PREMIUM PACK 5GR', label: 'R002 PREMIUM PACK 5GR' },
        { id: 'R003 PREMIUM CUP KOPI GULA', label: 'R003 PREMIUM CUP KOPI GULA' },
        { id: 'R008 PREMIUM BIJI SEAL PACK 1KG', label: 'R008 PREMIUM BIJI SEAL PACK 1KG' },
        { id: 'R012 PREMIUM PACK HOREKA 1KG', label: 'R012 PREMIUM PACK HOREKA 1KG' },
        { id: 'Y007 NEW GEN BULK PACK 1KG', label: 'Y007 NEW GEN BULK PACK 1KG' }
      ],
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
  mounted () {
    this.isLoading = false
    this.loadingMessage = 'Searching current location'
    // Check for Geolocation API permissions
    navigator.permissions.query({
      name: 'geolocation'
    }).then(permissionStatus => {
      console.log('geolocation permission state is ', permissionStatus.state)
      if (permissionStatus.state == 'granted') {
        this.getLocation()
      } else if (permissionStatus.state == 'prompt') {
        this.loadingMessage = 'Please allow location permission request'
        this.getLocation()
      } else if (permissionStatus.state == 'denied') {
        this.loadingMessage = 'Permission denied'
        this.isLoading = false
        this.$alert.error('Permissions Denied', 'Requesting location permissions denied, If you using google chrome you can refer this guide to allow permission request <a href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank">https://support.google.com/chrome/answer/142065</a>')
      }

      permissionStatus.onchange = () => {
        console.log('geolocation permission state has changed to ', this.state)
        if (permissionStatus.state == 'denied') {
          this.isLoading = false
          this.loadingMessage = 'Permission denied'
          this.$alert.error('Permissions Denied', 'Requesting location permissions denied, If you using google chrome you can refer this guide to allow permission request <a href="https://support.google.com/chrome/answer/142065?hl=en" target="_blank">https://support.google.com/chrome/answer/142065</a>')
        }
      }
    })
  },
  methods: {
    ...mapActions('pluginPinPointSalesVisitationForm', ['create']),
    onCaptured (value) {
      this.form.image = value
    },
    getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.center.lat = pos.lat
          this.center.lng = pos.lng
          this.markers[0].position.lat = pos.lat
          this.markers[0].position.lng = pos.lng
          this.$refs.map.$mapPromise.then(() => {
            this.isLoading = false
            this.geocodeLatLng(new google.maps.Geocoder(), pos, google.maps.InfoWindow)
          }).catch(error => {
            this.isLoading = false
          })
        }.bind(this))
      } else {
        this.loadingMessage = 'Geolocation not available, please update your browser or using another browser'
      }
    },
    addMoreInterestReason () {
      this.form.interest_reasons.push({
        id: null,
        name: null
      })
    },
    addMoreNoInterestReason () {
      this.form.no_interest_reasons.push({
        id: null,
        name: null
      })
    },
    addMoreSimilarProduct () {
      this.form.similar_products.push({
        id: null,
        name: null
      })
    },
    chooseCustomer (option) {
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
      console.log(place)
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
      geocoder.geocode({ 'location': this.center }, function (results, status) {
        console.log(results)
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
    chooseItem (event, row) {
      this.form.item[row - 1] = event.name
      if (this.rows === row) {
        this.rows++
      }
      this.calculate()
    },
    chooseInterestReason (event, index) {
      this.form.interest_reasons[index].id = event.id
      this.form.interest_reasons[index].name = event.name
    },
    clearInterestReason (event, index) {
      this.form.interest_reasons[index].id = null
      this.form.interest_reasons[index].name = null
    },
    chooseNoInterestReason (event, index) {
      this.form.no_interest_reasons[index].id = event.id
      this.form.no_interest_reasons[index].name = event.name
    },
    clearNoInterestReason (event, index) {
      this.form.no_interest_reasons[index].id = null
      this.form.no_interest_reasons[index].name = null
    },
    chooseSimilarProduct (event, index) {
      this.form.similar_products[index].id = event.id
      this.form.similar_products[index].name = event.name
    },
    clearSimilarProduct (event, index) {
      this.form.similar_products[index].id = null
      this.form.similar_products[index].name = null
    },
    calculate: debounce(function () {
      this.form.grandTotal = 0
      for (var i = 0; i < this.form.item.length; i++) {
        if (this.form.item[i] && this.form.quantity[i] && this.form.price[i]) {
          this.$set(this.form.total, i, parseFloat(this.form.quantity[i]) * parseFloat(this.form.price[i]))
          this.form.grandTotal += parseFloat(this.form.total[i])
        } else {
          this.$set(this.form.total, i, parseFloat(0))
        }
      }
    }, 500),
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
  },
  created () {
    let self = this
    navigator.permissions.query({ name: 'camera' })
      .then(function (result) {
        if (result.state == 'granted') {
          self.isPermissionCameraGranted = true
        } else if (result.state == 'prompt') {
          self.isPermissionCameraGranted = false
        } else {
          self.isPermissionCameraGranted = false
        }
      })

    navigator.permissions.query({ name: 'geolocation' })
      .then(function (result) {
        if (result.state == 'granted') {
          self.isPermissionGeolocationGranted = true
        } else if (result.state == 'prompt') {
          self.isPermissionCameraGranted = false
        } else {
          self.isPermissionGeolocationGranted = false
        }
      })
  }
}
</script>
