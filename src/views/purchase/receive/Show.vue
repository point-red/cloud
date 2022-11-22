<template>
  <div>
    <breadcrumb v-if="purchaseReceive">
      <breadcrumb-purchase />
      <router-link
        to="/purchase/receive"
        class="breadcrumb-item"
      >
        {{ $t("purchase receive") | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{
        purchaseReceive.form.number | uppercase
      }}</span>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchaseReceive.form.cancellation_status"
      :cancellation-approval-reason="
        purchaseReceive.form.cancellation_approval_reason
      "
      :request-cancellation-reason="
        purchaseReceive.form.request_cancellation_reason
      "
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="purchaseReceive"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <button
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="print()"
                >
                  {{ $t("print") | uppercase }}
                </button>
                <router-link
                  :to="{ name: 'purchase.receive.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t("create") | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'purchase.receive.edit', params: { id: purchaseReceive.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="
                    purchaseReceive.form.cancellation_status == null ||
                      purchaseReceive.form.cancellation_status == -1
                  "
                  class="btn btn-sm btn-outline-secondary mr-5"
                  @click="$refs.formRequestDelete.open()"
                >
                  {{ $t("delete") | uppercase }}
                </button>
                <m-form-request-delete
                  ref="formRequestDelete"
                  @delete="onDelete($event)"
                />
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t("purchase receive") | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t("form number") | uppercase }}
                  </td>
                  <td>{{ purchaseReceive.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t("date") | uppercase }}
                  </td>
                  <td>
                    {{ purchaseReceive.date | dateFormat("DD MMMM YYYY") }}
                  </td>
                </tr>
                <tr v-if="purchaseReceive.purchase_order">
                  <td class="font-weight-bold">
                    {{ $t("reference") | uppercase }}
                  </td>
                  <td>{{ purchaseReceive.purchase_order.form.number }}</td>
                </tr>
                <tr v-if="purchaseReceive.driver">
                  <td class="font-weight-bold">
                    {{ $t("warehouse") | uppercase }}
                  </td>
                  <td>{{ purchaseReceive.warehouse.name }}</td>
                </tr>
                <tr v-if="purchaseReceive.driver">
                  <td class="font-weight-bold">
                    {{ $t("driver") | uppercase }}
                  </td>
                  <td>{{ purchaseReceive.driver }}</td>
                </tr>
                <tr v-if="purchaseReceive.license_plate">
                  <td class="font-weight-bold">
                    {{ $t("license plate") | uppercase }}
                  </td>
                  <td>{{ purchaseReceive.license_plate }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="purchaseReceive.form.branch">
                {{ purchaseReceive.form.branch.address | uppercase }}
                <br v-if="purchaseReceive.form.branch.phone">{{
                  purchaseReceive.form.branch.phone | uppercase
                }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t("supplier") | uppercase }}
              </h6>
              {{ purchaseReceive.supplier_name | uppercase }}
              <div style="font-size: 12px">
                {{ purchaseReceive.supplier_address | uppercase }}
                <br v-if="purchaseReceive.supplier_phone">{{
                  purchaseReceive.supplier_phone
                }}
                <br v-if="purchaseReceive.supplier_email">{{
                  purchaseReceive.supplier_email | uppercase
                }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                #
              </th>
              <th>{{ $t("item") | uppercase }}</th>
              <th class="text-right">
                {{ $t("quantity") | uppercase }}
              </th>
              <th width="50px" />
            </tr>
            <template v-for="(row, index) in purchaseReceive.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>
                  {{ row.item.label }}
                  <template v-if="row.production_number">
                    (PID: {{ row.production_number }})
                  </template>
                  <template v-if="row.item.require_expiry_date">
                    (E/D: {{ row.expiry_date | dateFormat("DD MMMM YYYY") }})
                  </template>
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td />
              </tr>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-9">
              <h6 class="mb-0">
                {{ $t("notes") | uppercase }}
              </h6>
              <div style="white-space: pre-wrap">
                {{ purchaseReceive.form.notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t("created by") | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size: 11px"
              >
                {{ purchaseReceive.form.date | dateFormat("DD MMMM YYYY") }}
              </div>
              {{ purchaseReceive.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <div
      v-show="false"
      id="printMe"
      class="row"
    >
      <p-block>
        <p-block-inner style="position: relative">
          <div
            v-if="purchaseReceive.form.cancellationStatus === 1"
            style="position: absolute;color: red; z-index:100; bottom:0; right:0;top:0;left:0;display:flex;justify-content: center;align-items: center;"
          >
            <div style="font-size: 8em;transform: rotate(-45deg);letter-spacing: 15px;font-weight: 700;opacity: .5;">
              {{ $t('canceled') | uppercase }}
            </div>
          </div>
          <div class="col-12">
            <div class="row">
              <div
                class="col-4"
                style="display:flex; justify-content: center;align-items: center;"
              >
                logo
              </div>
              <div
                class="col-8"
                style="display:flex; justify-content: center;flex-direction: column;"
              >
                <h1
                  class="font-weight-bold text-primary"
                >
                  {{ $t('purchase down payment') | uppercase }}
                </h1>
                <h1 class="text-primary">
                  {{ authUser.tenant_name | uppercase }}
                </h1>
                <h4>
                  {{ "Address : "+authUser.tenant_address }}
                </h4>
                <h4>
                  {{ "Phone : "+authUser.tenant_phone }}
                </h4>
              </div>
            </div>
          </div>
          <div
            class="row p-10"
            style="margin-top:30px;"
          >
            <div
              class="col-12"
              style="padding:15px!important"
            >
              <div class="row">
                <div class="col-9">
                  <table class="table table-sm table-bordered">
                    <tr>
                      <td class="font-weight-bold">
                        {{ $t('Form') | uppercase }}
                      </td>
                      <td class="text-center">
                        <span>{{ purchaseReceive.form.number }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">
                        {{ $t('Date') | uppercase }}
                      </td>
                      <td class="text-center">
                        <span>{{ purchaseReceive.form.date | dateFormat("DD MMMM YYYY") }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">
                        {{ $t('Purchase Order') | uppercase }}
                      </td>
                      <td
                        v-if="purchaseReceive.purchase_order"
                        class="text-center text-primary"
                      >
                        <span>{{ purchaseReceive.purchase_order.form.number }}</span>
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
              <div
                class="row"
                style="margin-top:30px;"
              >
                <div class="col-12">
                  <table class="table table-sm table-bordered">
                    <tr
                      class="text-center print-background-gray"
                      style="border-color:#adb8c8;-webkit-box-shadow:none;box-shadow:none;"
                    >
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
              <div
                class="row mt-50"
                style="padding:15px!important; margin-top:50px;"
              >
                <div
                  class="col-8"
                  style="border:2px solid rgba(0,0,0,.3)!important;padding:10px!important;border-radius:3px;"
                >
                  <h6 class="mb-0">
                    {{ $t("notes") | uppercase }}
                  </h6>
                  <div style="white-space: pre-wrap">
                    {{ purchaseReceive.form.notes }}
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
                    {{ purchaseReceive.form.date | dateFormat("DD MMMM YYYY") }}
                  </div>
                  {{ purchaseReceive.form.created_by.full_name | uppercase }}
                  <div class="d-sm-block d-md-none mt-10" />
                </div>
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
import Form from '@/utils/Form'

export default {
  name: 'Show',
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      form: new Form({
        increment_group: this.$moment().format('YYYYMM'),
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        supplier_label: null,
        supplier_address: null,
        supplier_phone: null,
        supplier_email: null
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
        id: this.id,
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
          this.isLoading = false
        })
        .catch((error) => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },

    onDelete (reason) {
      this.isDeleting = true
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      })
        .then((response) => {
          this.isDeleting = false
          this.$notification.success('cancel success')
          this.purchaseReceiveRequest()
        })
        .catch((error) => {
          this.isDeleting = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.purchaseOrderRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.purchaseOrderRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      })
        .then((response) => {
          this.$notification.success('cancellation approved')
          this.$router.push('/purchase/receive')
        })
        .catch((error) => {
          this.$notification.error(error.message)
        })
    },

    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      })
        .then((response) => {
          this.$notification.success('cancellation rejected')
          this.purchaseReceiveRequest()
        })
        .catch((error) => {
          this.$notification.error(error.message)
        })
    },

    print () {
      this.$htmlToPaper('printMe')
    }
  }
}
</script>
