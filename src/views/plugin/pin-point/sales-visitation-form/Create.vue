<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point/>
      <router-link
        to="/plugin/pin-point/sales-visitation-form"
        class="breadcrumb-item">{{ $t('sales visitation form') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('sales visitation form')"
        column="col-sm-12">

        <p-form-row
          id="date"
          name="date"
          :label="$t('date')">
          <div slot="body" class="col-lg-9">
            <p-date-picker
              id="date"
              name="date"
              label="date"
              v-model="form.date"
              :errors="form.errors.get('date')"
              @errors="form.errors.set('date', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="customer"
          name="customer"
          :label="$t('customer')"
          :disabled="loadingSaveButton"
          v-model="form.customer"
          :errors="form.errors.get('customer')"
          @errors="form.errors.set('customer', null)">
        </p-form-row>

        <p-form-row
          :label="'group'">
          <div slot="body" class="col-lg-9">
            <p-select
              id="group"
              name="group"
              :disabled="loadingSaveButton"
              v-model="form.group"
              :options="groupList"
              :errors="form.errors.get('group')"
              @errors="form.errors.set('group', null)"/>
          </div>
        </p-form-row>

        <p-form-row
          id="address"
          name="address"
          :label="$t('address')"
          :disabled="loadingSaveButton"
          v-model="form.address"
          :errors="form.errors.get('address')"
          @errors="form.errors.set('address', null)">
        </p-form-row>

        <p-form-row
          id="phone"
          name="phone"
          :label="$t('phone')"
          :disabled="loadingSaveButton"
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
              :disabled="loadingSaveButton"
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
          :disabled="loadingSaveButton"
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
              :disabled="loadingSaveButton"
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
          :disabled="loadingSaveButton"
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
              :disabled="loadingSaveButton"
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
          :disabled="loadingSaveButton"
          v-model="form.other_not_interest_reason"
          :errors="form.errors.get('other_not_interest_reason')"
          @errors="form.errors.set('other_not_interest_reason', null)">
        </p-form-row>

        <p-form-row
          id="notes"
          name="notes"
          :label="'notes'"
          :disabled="loadingSaveButton"
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
              <p-select
                id="item"
                :disabled="loadingSaveButton"
                v-model="form.item[index]"
                @input="updateItem(row)"
                :options="itemList"
                :errors="form.errors.get('item_id')"
                @errors="form.errors.set('item_id', null)"/>
            </td>
            <td>
              <p-form-number
                v-model="form.quantity[index]"
                @keyup.native="calculate()"
                :disabled="loadingSaveButton"
                :is-text-right="true"/>
            </td>
            <td>
              <p-form-number
                v-model="form.price[index]"
                @keyup.native="calculate()"
                :disabled="loadingSaveButton"
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
              :disabled="loadingSaveButton"
              :errors="form.errors.get('payment_received')"
              @errors="form.errors.set('payment_received', null)"
              :is-text-right="false"/>
          </div>
        </p-form-row>

        <hr/>

        <div class="form-group row">
          <div class="col-md-12">
            <button :disabled="loadingSaveButton" type="submit" class="btn btn-sm btn-primary">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
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
      loading: false,
      loadingSaveButton: false,
      rows: 1,
      form: new Form({
        date: new Date(),
        customer: this.$route.query.name || '',
        address: this.$route.query.address || '',
        latitude: this.$route.query.latitude || '',
        longitude: this.$route.query.longitude || '',
        group: null,
        phone: '',
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
      ]
    }
  },
  methods: {
    ...mapActions('SalesVisitationForm', ['create']),
    updateItem (row) {
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
      this.loadingSaveButton = true
      this.create(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.success('Pengisian form sukses')
          this.$router.push('/')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error)
          if (error.errors) {
            this.form.errors.record(error.errors)
          }
        })
    }
  }
}
</script>
