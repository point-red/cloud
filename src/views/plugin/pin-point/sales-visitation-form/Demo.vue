<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <breadcrumb-pin-point/>
      <router-link to="/plugin/pin-point/sales-visitation-form" class="breadcrumb-item">{{ $t('sales visitation form') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Demo</span>
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
          v-model="form.customer"
          :errors="form.errors.get('customer')"
          @errors="form.errors.set('customer', null)">
        </p-form-row>

        <p-form-row
          id="address"
          name="address"
          :label="$t('address')"
          v-model="form.address"
          :errors="form.errors.get('address')"
          @errors="form.errors.set('address', null)">
        </p-form-row>

        <p-form-row
          id="phone"
          name="phone"
          :label="$t('phone')"
          v-model="form.phone"
          :errors="form.errors.get('phone')"
          @errors="form.errors.set('phone', null)">
        </p-form-row>

        <p-form-row
          id="no-interest"
          name="no-interest"
          :label="$t('no interest reason') | titlecase">
          <div slot="body" class="col-lg-9">
            <p-suggest
              ref="noInterestReasonRef"
              @keyup.native="onSuggestNoInterestReason($event.target.value)"
              :suggestions="noInterestReasonList"
              :loading="loadSuggestions"
              @selected="onSelectedNoInterestReason"
              :errors="form.errors.get('form.similar_product')"
              @errors="form.errors.set('form.similar_product', null)">
            </p-suggest>
          </div>
        </p-form-row>

        <hr class="mt-100"/>

        <div class="form-group row">
          <div class="col-md-12">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPinPoint from '@/views/plugin/pin-point/Breadcrumb'
import Form from '@/utils/Form'
import { debounce } from 'lodash'
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
      isSaving: false,
      loadSuggestions: false,
      suggestions: [],
      rows: 1,
      form: new Form({
        date: new Date(),
        customer: this.$route.query.name || 'customer',
        address: this.$route.query.address || 'Event Location',
        latitude: this.$route.query.latitude || '',
        longitude: this.$route.query.longitude || '',
        group: 'Hotel',
        phone: '08123456789',
        similar_product: '-',
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
      noInterestReasonList: []
    }
  },
  methods: {
    ...mapActions('SalesVisitationForm', ['create', 'get']),
    onSelectedNoInterestReason (selected) {
      this.form.not_interest_reason = selected
      this.loadSuggestions = false
    },
    onSuggestNoInterestReason: debounce(function (text) {
      this.form.not_interest_reason = text
      this.loadSuggestions = true
      this.noInterestReasonList = [{
        data: [
          { name: 'Harga mahal / Tidak ada diskon' },
          { name: 'Tidak ada merchandise' },
          { name: 'Perlu kopi biji' },
          { name: 'Perlu kopi bubuk kiloan' },
          { name: 'Perlu kopi cup yang bisa dibawa kemana mana' }
        ]
      }]
    }, 200),
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
      this.isSaving = true
      this.create(this.form)
        .then((response) => {
          this.isSaving = false
          this.$refs.noInterestReasonRef.clear()
          this.$notification.success('Pengisian form sukses')
          this.$router.push('/plugin/pin-point/sales-visitation-form/demo')
        }, (error) => {
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
