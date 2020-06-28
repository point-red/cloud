<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">
        <router-link
          to="/accounting/cut-off"
          class="breadcrumb-item"
        >{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <p-block>
            <nav
              class="breadcrumb bg-white text-center"
              style="display:block !important"
            >
              <router-link
                to="/accounting/cut-off/create"
                class="breadcrumb-item"
              >
                {{ $t('start') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/account"
                class="breadcrumb-item"
              >
                {{ $t('account') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/inventory"
                class="breadcrumb-item"
              >
                {{ $t('inventory') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/account-payable"
                class="breadcrumb-item"
              >
                {{ $t('account payable') | uppercase }}
              </router-link>
              <span class="breadcrumb-item active">{{ $t('purchase down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account receivable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('sales down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('review') | uppercase }}</span>
            </nav>
            <hr>
            <h5 class="text-center">
              {{ $t('purchase down payment') | uppercase }}
            </h5>
            <template>
              <div class="input-group block mb-5">
                <a
                  v-if="$permission.has('create cut off')"
                  href="javascript:void(0)"
                  class="input-group-prepend"
                  @click="() => $refs.createPurchaseDownPayment.show()"
                >
                  <span class="input-group-text">
                    <i class="fa fa-plus" />
                  </span>
                </a>
                <p-form-input
                  id="search-text"
                  ref="searchText"
                  name="search-text"
                  placeholder="Search"
                  class="btn-block"
                  :value="searchText"
                  @input="filterSearch"
                />
              </div>
              <hr>
              <p-block-inner :is-loading="isLoading">
                <point-table>
                  <tr slot="p-head">
                    <th>Supplier</th>
                    <th>Account</th>
                    <th>Notes</th>
                    <th class="text-right">
                      Amount
                    </th>
                  </tr>
                  <tr
                    v-for="accountPayable in purchaseDownPayments"
                    :key="accountPayable.id"
                    slot="p-body"
                  >
                    <td>
                      <a
                        href="javascript:void(0)"
                        @click="$refs.editPurchaseDownPayment.show(accountPayable)"
                      >
                        {{ accountPayable.supplier.name }}
                      </a>
                    </td>
                    <td>
                      {{ accountPayable.account.label }}
                    </td>
                    <td>
                      {{ accountPayable.notes }}
                    </td>
                    <td class="text-right">
                      {{ accountPayable.amount | numberFormat }} {{ accountPayable.unit | lowercase }}
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td
                      colspan="2"
                      class="text-right"
                    >
                      <b>TOTAL</b>
                    </td>
                    <td class="text-right">
                      {{ total | numberFormat }}
                    </td>
                  </tr>
                </point-table>
              </p-block-inner>
              <router-link
                tag="button"
                to="/accounting/cut-off/create/account-receivable"
                class="btn btn-sm btn-primary min-width-100 float-right"
              >
                {{ $t('next') | uppercase }}
              </router-link>
              <router-link
                tag="button"
                to="/accounting/cut-off/create/account-payable"
                class="btn btn-sm btn-primary min-width-100 float-left"
              >
                {{ $t('prev') | uppercase }}
              </router-link>
              <br><br><br>
            </template>
          </p-block>
        </div>
      </div>
    </div>
    <m-create-purchase-down-payment
      id="create-purchase-down-payment"
      ref="createPurchaseDownPayment"
      @updated="getPurchaseDownPaymentRequest()"
    />
    <m-edit-purchase-down-payment
      id="edit-purchase-down-payment"
      ref="editPurchaseDownPayment"
      @updated="getPurchaseDownPaymentRequest()"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import MCreatePurchaseDownPayment from './MCreatePurchaseDownPayment'
import MEditPurchaseDownPayment from './MEditPurchaseDownPayment'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable,
    MCreatePurchaseDownPayment,
    MEditPurchaseDownPayment
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      total: 0,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1
    }
  },
  computed: {
    ...mapGetters('accountingCutOffPurchaseDownPayment', ['purchaseDownPayments'])
  },
  created () {
    this.getPurchaseDownPaymentRequest()
  },
  methods: {
    ...mapActions('accountingCutOffPurchaseDownPayment', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPurchaseDownPaymentRequest()
    }, 300),
    getPurchaseDownPaymentRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'cut_off_purchase_down_payments.*',
          limit: 1000,
          join: 'supplier,cutOff,chartOfAccount',
          filter_like: {
            'supplier.name': this.searchText,
            amount: this.searchText
          },
          includes: 'supplier;cutOff;account'
        }
      }).then(response => {
        this.total = 0
        this.purchaseDownPayments.forEach(element => {
          this.total += element.amount
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    }
  }
}
</script>
