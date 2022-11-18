<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/print"
        class="breadcrumb-item"
      >
        {{ $t('purchase print') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('print') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row p-10">
              <div
                class="col-6 border-black-op  p-15 my-border-black"
              >
                <div class="row">
                  <div class="col-9">
                    <table class="table table-sm table-bordered">
                      <tr>
                        <td class="font-weight-bold">
                          {{ $t('Form') | uppercase }}
                        </td>
                        <td class="text-center">
                          <span>{{ form.form.number }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">
                          {{ $t('Date') | uppercase }}
                        </td>
                        <td class="text-center">
                          <span>{{ form.form.date | dateFormat("DD MMMM YYYY") }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">
                          {{ $t('Purchase Order') | uppercase }}
                        </td>
                        <td class="text-center text-primary">
                          <span>{{ form.purchase_order.form.number }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">
                          {{ $t('Warehouse') | uppercase }}
                        </td>
                        <td class="text-center text-primary">
                          <span>{{ form.warehouse_name }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">
                          {{ $t('Driver') | uppercase }}
                        </td>
                        <td class="text-center">
                          <span>{{ form.driver }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">
                          {{ $t('License Plate') | uppercase }}
                        </td>
                        <td class="text-center">
                          <span>{{ form.license_plate }}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <table class="table table-sm table-bordered">
                      <tr class="fc-state-down text-center">
                        <td class="font-weight-bold">
                          {{ $t('No')| uppercase }}
                        </td>
                        <td class="font-weight-bold">
                          {{ $t('ITEM') | uppercase }}
                        </td>
                        <td class="font-weight-bold">
                          {{ $t('QUANTITY RECEIVED')| uppercase }}
                        </td>
                      </tr>

                      <tr
                        v-for="(item, index) in form.item"
                        :key="item.id"
                        class="text-center"
                      >
                        <td>
                          {{ index +1 }}
                        </td>
                        <td>
                          {{ item.item_name }}
                        </td>
                        <td>
                          {{ item.quantity + " PCS" }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="row mt-50 p-15">
                  <div class="col-8 border-black-op my-border-black p-10">
                    <h6 class="mb-0">
                      {{ $t("notes") | uppercase }}
                    </h6>
                    <div style="white-space: pre-wrap">
                      {{ form.form.notes }}
                    </div>
                    <div class="d-sm-block d-md-none mt-10" />
                  </div>
                  <div class="col-4 text-center p-10">
                    <h6 class="mb-0">
                      {{ $t("created by") | uppercase }}
                    </h6>
                    <div
                      class="mb-50"
                      style="font-size: 11px"
                    >
                      {{ form.form.date | dateFormat("DD MMMM YYYY") }}
                    </div>
                    {{ form.form.created_by.full_name | uppercase }}
                    <div class="d-sm-block d-md-none mt-10" />
                  </div>
                </div>
              </div>
              <div class="col-6 ">
                <h4>{{ $t('print setting') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td>
                      {{ $t('destination') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('pages') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('copy') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('color') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                </table>
                <h4>{{ $t('print setting  ') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td>
                      {{ $t('paper size') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('pages per sheet') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('scale') | uppercase }}
                    </td>
                    <td>
                      <span>{{ null }}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Print',
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      purchaseOrder: {
        form: {
          number: null
        },
        purchase_receives: []
      },
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        supplier_label: null,
        supplier_address: null,
        supplier_phone: null,
        supplier_email: null,

        // asdasd
        form: {},
        purchase_order: {},
        warehouse_name: null,
        items: [],
        driver: null,
        license_plate: null
      })
    }
  },
  computed: {
    ...mapGetters('purchaseReceive', ['purchaseReceive']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    $route (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseReceiveRequest()
      }
    }
  },
  created () {
    this.purchaseReceiveRequest()
  },
  methods: {
    ...mapActions('purchaseReceive', {
      find: 'find',
      delete: 'delete',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    purchaseReceiveRequest () {
      this.isLoading = true
      this.find({
        id: this.$route.params.id,
        params: {
          with_archives: true,
          includes:
            'supplier;' +
            'warehouse;' +
            'items.item.units;' +
            'purchaseOrder.form;' +
            'form.createdBy;' +
            'form.branch'
        }
      })
        .then((response) => {
          console.log(response)
          this.form.form = response.data.form
          this.form.purchase_order = response.data.purchase_order
          this.form.warehouse_name = response.data.warehouse_name
          this.form.item = response.data.items
          this.form.driver = response.data.driver
          this.form.license_plate = response.data.license_plate
          this.isLoading = false
        })
        .catch((error) => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    }
  }
}
</script>

<style>
.my-border-black {
  border-color:black !important
}
</style>
