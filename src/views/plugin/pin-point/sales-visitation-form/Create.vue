<template>
  <div>
    <p-loading-block v-show="isLoading" :message="loadingMessage"/>

    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point/>
      <router-link
        to="/plugin/pin-point/sales-visitation-form"
        class="breadcrumb-item">{{ $t('sales visitation') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="isLoading"
        :header="true"
        :title="$t('sales visitation')"
        column="col-sm-12">

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

        <p-form-row
          id="customer"
          name="customer"
          :label="$t('customer')"
          :disabled="isSaving"
          v-model="form.customer"
          :errors="form.errors.get('customer')"
          @errors="form.errors.set('customer', null)">
          <div class="col-lg-9" slot="body">
            <m-customer id="customer" v-model="form.customer_id" @choosen="chooseCustomer" :label="form.customer_name"/>
          </div>
        </p-form-row>

        <p-form-row :label="'group'">
          <div class="col-lg-9" slot="body">
            <m-group id="group" v-model="form.group_id" @choosen="chooseGroup" :label="form.group_name" class-reference="Customer"/>
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
            <p-select
              id="similar-product"
              name="similar_product"
              :multiple="true"
              :key-field="'label'"
              :disabled="isSaving"
              v-model="form.similar_product"
              :options="similarProductList"
              :errors="form.errors.get('similar_product')"
              @errors="form.errors.set('similar_product', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="other-similar-product"
          name="other_similar_product"
          :label="$t('')"
          placeholder="..."
          :disabled="isSaving"
          v-model="form.other_similar_product"
          :errors="form.errors.get('other_similar_product')"
          @errors="form.errors.set('other_similar_product', null)">
        </p-form-row>

        <p-form-row
          id="interest"
          name="interest"
          :label="$t('interest reason') | titlecase">
          <div slot="body" class="col-lg-9">
            <p-select
              id="interest"
              name="interest"
              :multiple="true"
              :key-field="'label'"
              :disabled="isSaving"
              v-model="form.interest_reason"
              :options="interestedList"
              :errors="form.errors.get('interest')"
              @errors="form.errors.set('interest', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="other-interest-reason"
          name="other_interest_reason"
          :label="$t('')"
          placeholder="..."
          :disabled="isSaving"
          v-model="form.other_interest_reason"
          :errors="form.errors.get('other_interest_reason')"
          @errors="form.errors.set('other_interest_reason', null)">
        </p-form-row>

        <p-form-row
          id="not-interest"
          name="not_interest"
          :label="$t('no interest reason')">
          <div slot="body" class="col-lg-9">
            <p-select
              id="not-interest"
              name="not_interest"
              :multiple="true"
              :disabled="isSaving"
              v-model="form.not_interest_reason"
              :options="notInterestedList"
              :errors="form.errors.get('not_interest')"
              @errors="form.errors.set('not_interest', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="other-not-interest-reason"
          name="other_not_interest_reason"
          :label="$t('')"
          placeholder="..."
          :disabled="isSaving"
          v-model="form.other_not_interest_reason"
          :errors="form.errors.get('other_not_interest_reason')"
          @errors="form.errors.set('other_not_interest_reason', null)">
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

        <hr/>

        <p-table>
          <tr slot="p-head">
            <th>Item</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Total</th>
          </tr>
          <tr slot="p-body" v-for="(row, index) in rows" :key="row">
            <td>
              <!-- <p-select
                id="item"
                :disabled="isSaving"
                v-model="form.item[index]"
                @input="updateItem(row)"
                :options="itemList"
                :errors="form.errors.get('item_id')"
                @errors="form.errors.set('item_id', null)"/> -->
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
            <button :disabled="isSaving" type="submit" class="btn btn-sm btn-primary">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPinPoint
  },
  data () {
    return {
      isLoading: false,
      loadingMessage: 'Loading...',
      isSaving: false,
      rows: 1,
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
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
        similar_product: '',
        interest_reason: '',
        other_interest_reason: '',
        not_interest_reason: '',
        other_not_interest_reason: '',
        item: [''],
        quantity: [0],
        price: [0],
        total: [0],
        grandTotal: 0,
        payment_method: 'cash',
        due_date: '',
        received_payment: 0
      }),
      notInterestedList: [
        { id: 'Harga terlalu mahal', label: 'Harga terlalu mahal' },
        { id: 'Belum Bertemu dengan Pemilik Toko / Istri (Suami)', label: 'Belum Bertemu dengan Pemilik Toko / Istri (Suami)' },
        { id: 'Masih ada stok kopi lain', label: 'Masih ada stok kopi lain' },
        { id: 'Masih ada stok kopi bara', label: 'Masih ada stok kopi bara' },
        { id: 'Belum berminat (lain kali)', label: 'Belum berminat (lain kali)' },
        { id: 'Memiliki racikan kopi sendiri', label: 'Memiliki racikan kopi sendiri' },
        { id: 'Memakai biji kopi', label: 'Memakai biji kopi' },
        { id: 'Minta mix dengan gula', label: 'Minta mix dengan gula' },
        { id: 'Masih baru / belum dikenal', label: 'Masih baru / belum dikenal' },
        { id: 'Lain Lain', label: 'Lain Lain' }
      ],
      interestedList: [
        { id: 'Kemasan bagus', label: 'Kemasan bagus' },
        { id: 'Cocok dengan rasanya', label: 'Cocok dengan rasanya' },
        { id: 'Dicari oleh pembeli', label: 'Dicari oleh pembeli' },
        { id: 'Tertarik dengan promosi', label: 'Tertarik dengan promosi' },
        { id: 'Mudah dipakai untuk resep', label: 'Mudah dipakai untuk resep' },
        { id: 'Lain Lain', label: 'Lain Lain' }
      ],
      similarProductList: [
        { id: 'Kapal Api', label: 'Kapal Api' },
        { id: 'Torabika', label: 'Torabika' },
        { id: 'Top Coffee', label: 'Top Coffee' },
        { id: 'Luwak White Coffee', label: 'Luwak White Coffee' },
        { id: 'Good Day', label: 'Good Day' },
        { id: 'Kopi ABC', label: 'Kopi ABC' },
        { id: 'Kopi Ya', label: 'Kopi Ya' },
        { id: 'Nescafe', label: 'Nescafe' },
        { id: 'Kopi Bara', label: 'Kopi Bara' },
        { id: 'Kopi Racikan Sendiri', label: 'Kopi Racikan Sendiri' },
        { id: 'Lain Lain', label: 'Lain Lain' }
      ],
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
      center: {lat: 23.8103, lng: 90.4125},
      markers: [
          {position: {lat: 10.0, lng: 10.0}}
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
      name:'geolocation'
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
            this.geocodeLatLng(new google.maps.Geocoder, pos, google.maps.InfoWindow)
          }).catch(error => {
            this.isLoading = false
          })
        }.bind(this))
      } else {
        this.loadingMessage = 'Geolocation not available, please update your browser or using another browser'
      }
    },
    chooseCustomer (value) {
      this.form.customer_name = value
    },
    chooseGroup (value) {
      this.form.group_name = value
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
    geocodeLatLng (geocoder, map, infowindow){
      var self = this
      geocoder.geocode({'location':this.center}, function (results, status) {
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
      this.form.item[row-1] = event.name
      if (this.rows === row) {
        this.rows++
      }
      this.calculate()
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
          this.$notification.error(error)
          if (error.errors) {
            this.form.errors.record(error.errors)
          }
        })
    }
  }
}
</script>
