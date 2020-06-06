<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link to="/purchase/invoice" class="breadcrumb-item">{{ $t('purchase invoice') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <purchase-menu/>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="row">
              <div class="col-sm-6">
                <h4>{{ $t('purchase invoice') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">{{ $t('date') | uppercase }}</td>
                    <td>
                      <p-date-picker
                        id="date"
                        name="date"
                        :label="$t('date')"
                        v-model="form.date"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">{{ $t('purchase order') | uppercase }}</td>
                    <td>
                      <span @click="$refs.selectPurchaseOrder.open()" class="select-link">
                        <template v-if="purchaseOrder && purchaseOrder.form.number != null">
                          {{ purchaseOrder.form.number }}
                        </template>
                        <template v-else>
                          {{ $t('select') | uppercase }}
                        </template>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-sm-6 text-right">
                <div class="mb-30">
                  <h6 class="mb-0">{{ authUser.tenant_name | uppercase }}</h6>
                  <template v-if="authUser.branch">
                    {{ authUser.branch.address | uppercase }} <br v-if="authUser.branch.address">
                    {{ authUser.branch.phone | uppercase }} <br v-if="authUser.branch.phone">
                  </template>
                </div>
                <div>
                  <h6 class="mb-0 ">{{ $t('to') | uppercase }}:</h6>
                  <span @click="$refs.supplier.open()" class="select-link">{{ form.supplier_label || $t('select') | uppercase }}</span>
                  <div style="font-size:12px" v-if="form.supplier_phone">
                    <br v-if="form.supplier_address">{{ form.supplier_address | uppercase }}
                    <br v-if="form.supplier_phone">{{ form.supplier_phone }}
                    <br v-if="form.supplier_email">{{ form.supplier_email | uppercase }}
                  </div>
                </div>
              </div>
            </div>
            <hr>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
    <m-user ref="approver" @choosen="chooseApprover"/>
    <select-purchase-request ref="selectPurchaseRequest" @choosen="choosePurchaseRequest"></select-purchase-request>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import SelectPurchaseOrder from './SelectPurchaseOrder'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    PurchaseMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbPurchase,
    SelectPurchaseOrder
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName')
    }
  },
  computed: {
    ...mapGetters('purchaseOrder', ['purchaseOrder']),
    ...mapGetters('purchaseReceive', ['purchaseReceives']),
    ...mapGetters('auth', ['authUser'])
    // subtotal () {
    //   return this.form.items.reduce((carry, item) => {
    //     return carry + item.quantity * (item.price - item.discount_value)
    //   }, 0)
    // }
  },
  methods: {
    ...mapActions('purchaseInvoice', ['create']),
    toggleMore () {
      let isMoreActive = this.form.items.some(function (el, index) {
        return el.more === false
      })
      this.form.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    choosePurchaseOrder (purchaseOrder) {
      //
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
      this.create(this.form)
        .then(response => {
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/purchase/order/' + response.data.id)
        }).catch(error => {
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        }).finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
