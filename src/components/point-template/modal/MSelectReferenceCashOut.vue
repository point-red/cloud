<template>
  <!-- Modal Select Reference Cash Out -->
  <sweet-modal
    ref="modal"
    :title="'select reference cash out' | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <!-- Search -->
    <div class="row">
      <p-block :title="$t('payment order')">
        <div class="input-group block">
          <p-form-input
            id="search-text"
            ref="searchText"
            v-model="searchText"
            name="search-text"
            placeholder="Search..."
            class="btn-block"
            @input="filterSearch"
            @keydown.enter.prevent=""
          />
        </div>
        <hr>
        <!-- Table Reference Cash Out  -->
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>To</th>
              <th>Account</th>
              <th>Notes</th>
              <th class="text-right">
                Amount
              </th>
              <th class="text-center" />
            </tr>
            <!-- Table Payment Order -->
            <template v-for="(paymentOrder, index) in paymentOrders">
              <template
                v-for="(paymentOrderDetail, index2) in paymentOrder.details"
              >
                <tr
                  :key="'payment-order-' + index + '-' + index2"
                  slot="p-body"
                  style="cursor: pointer"
                  class="hoover-table-select"
                  @click="choosePaymentOrder(paymentOrder)"
                >
                  <th>
                    <router-link
                      :to="{
                        name: 'finance.payment-order.show',
                        params: { id: paymentOrder.id }
                      }"
                    >
                      {{ paymentOrder.form.number }}
                    </router-link>
                  </th>
                  <td>
                    {{
                      paymentOrder.form.date | dateFormat('DD MMMM YYYY HH:mm')
                    }}
                  </td>
                  <td>{{ paymentOrder.paymentable.name }}</td>
                  <td>{{ paymentOrderDetail.account.label }}</td>
                  <td>{{ paymentOrderDetail.notes }}</td>
                  <td class="text-right">
                    {{ paymentOrderDetail.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </template>
            <!-- Table Down Payment -->
            <template v-for="(downPayment, index) in downPayments">
              <tr
                :key="'purchase-down-payment-' + index"
                slot="p-body"
                style="cursor: pointer"
                class="hoover-table-select"
                @click="chooseDownPayment(downPayment)"
              >
                <th>
                  <router-link
                    :to="{
                      name: 'purchase.down-payment.show',
                      params: { id: downPayment.id }
                    }"
                  >
                    {{ downPayment.form.number }}
                  </router-link>
                </th>
                <td>
                  {{ downPayment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                </td>
                <td>{{ downPayment.supplier.name }}</td>
                <td>{{ downPaymentAccountLabel }}</td>
                <td>{{ downPayment.form.notes }}</td>
                <td class="text-right">
                  {{ downPayment.amount | numberFormat }}
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <!-- Pagination  -->
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <!-- Button Clear -->
    <div class="pull-right">
      <button
        type="button"
        class="btn btn-sm btn-outline-danger"
        @click="clear()"
      >
        {{ $t('clear') | uppercase }}
      </button>
    </div>
  </sweet-modal>
</template>

<script>
// Import Library & Components
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
// Import Vuex
import { mapGetters, mapActions } from 'vuex'

export default {
  // Use Library & Components
  components: {
    PointTable
  },
  data () {
    return {
      isLoading: false,
      downPaymentAccountId: null,
      downPaymentAccountLabel: null,
      date: {
        start: this.$route.query.date_from
          ? this.$moment(this.$route.query.date_from).format(
            'YYYY-MM-DD 00:00:00'
          )
          : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to
          ? this.$moment(this.$route.query.date_to).format(
            'YYYY-MM-DD 23:59:59'
          )
          : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 100,
      isActiveSelect: false
    }
  },
  computed: {
    ...mapGetters('financePaymentOrder', {
      paymentOrders: 'paymentOrders',
      paymentOrdersPagination: 'pagination'
    }),
    ...mapGetters('purchaseDownPayment', ['downPayments', 'pagination'])
  },
  watch: {
    handler: function () {
      this.$router.push({
        query: {
          ...this.$route.query
        }
      })
      this.search()
    },

    deep: true
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  mounted () {
    // Add Style for Responsive Table
    const addStyle = document.querySelector('div.sweet-content-content')
    addStyle.style.width = '100%'
  },
  methods: {
    ...mapActions('financePaymentOrder', {
      getPaymentOrder: 'get'
    }),
    ...mapActions('purchaseDownPayment', {
      getPurchaseDownPayment: 'get'
    }),
    ...mapActions('accountingSettingJournal', {
      findAccount: 'find'
    }),
    // Filter Data Finance Payment
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.search()
    }, 300),
    //
    search () {
      this.isLoading = true
      this.findAccount({
        feature: 'purchase',
        name: 'down payment'
      }).then((response) => {
        this.downPaymentAccountId = response.data.id
        this.downPaymentAccountLabel = response.data.label
      })
      this.getPaymentOrder({
        params: {
          join: 'form,details,account',
          sort_by: '-form.date',
          group_by: 'payment_order.id',
          fields: 'payment_order.*',
          filter_form: 'notArchived;pending;approvalApproved',
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            paymentable_name: this.searchText
          },
          filter_null: 'payment_order.payment_id',
          filter_equal: {
            'payment_order.payment_type': 'cash'
          },
          limit: this.limit,
          includes: 'form;paymentable;details.account;details.allocation',
          page: this.currentPage
        }
      })
        .then((response) => {
          this.isLoading = false
        })
        .catch((error) => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      this.getPurchaseDownPayment({
        params: {
          join: 'form',
          sort_by: '-form.date',
          group_by: 'purchase_down_payment.id',
          fields: 'purchase_down_payment.*',
          filter_form: 'notArchived;pending;approvalApproved',
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            supplier_name: this.searchText
          },
          limit: this.limit,
          includes: 'form;supplier',
          page: this.currentPage
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
    updatePage (value) {
      this.currentPage = value
      this.search()
    },
    clear (clear) {
      //
      // this.searchText = null
      //
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: null,
          referenceable_id: null,
          referenceable_type: null,
          reference_number: null,
          paymentable_name: null,
          paymentable_type: null,
          paymentable_id: null,
          amount: null,
          details: null
        }
      })
      //
      this.$emit('choosen', clear)
      //
      this.close()
    },
    choosePaymentOrder (paymentOrder) {
      const details = []
      paymentOrder.details.forEach((el) => {
        details.push({
          chart_of_account_id: el.account.id,
          chart_of_account_label: el.account.label,
          allocation_id: el.allocation ? el.allocation.id : null,
          allocation_name: el.allocation ? el.allocation.name : null,
          notes: el.notes,
          amount: el.amount
        })
      })
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: paymentOrder.form.id,
          referenceable_id: paymentOrder.id,
          referenceable_type: 'PaymentOrder',
          reference_number: paymentOrder.form.number,
          paymentable_name: paymentOrder.paymentable.name,
          paymentable_type: paymentOrder.paymentable_type,
          paymentable_id: paymentOrder.paymentable_id,
          amount: paymentOrder.amount,
          details: details
        }
      })
      this.$emit('choosen', paymentOrder)
      this.close()
    },
    chooseDownPayment (downPayment) {
      const details = []
      details.push({
        chart_of_account_id: this.downPaymentAccountId,
        chart_of_account_label: this.downPaymentAccountLabel,
        notes: downPayment.form.notes,
        amount: downPayment.amount
      })
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: downPayment.form.id,
          referenceable_id: downPayment.id,
          referenceable_type: 'PurchaseDownPayment',
          reference_number: downPayment.form.number,
          paymentable_name: downPayment.supplier.name,
          paymentable_type: 'Supplier',
          paymentable_id: downPayment.supplier_id,
          amount: downPayment.amount,
          details: details
        }
      })
      this.$emit('choosen', downPayment)
      this.close()
    },
    open () {
      this.search()
      // Add Style for Responsive Table
      const addStyle = document.querySelector('div.sweet-content-content')
      addStyle.style.width = '100%'
      // Open Modal
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
/*  */
.hoover-table-select:hover > th,
.hoover-table-select:hover > td {
  background-color: #f6f7f9;
}
input:readonly {
  background-color: white;
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
.w-1 {
  width: 1px;
}
</style>
