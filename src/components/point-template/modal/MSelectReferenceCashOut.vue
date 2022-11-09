  <!-- Still Need FIX in Layout -->
<template>
  <!-- Modal Select Reference Cash Out -->
  <sweet-modal
    ref="modal"
    :title="'select reference cash out' | uppercase"
    overlay-theme="dark"
    :enable-mobile-fullscreen="false"
    @close="onClose()"
  >
    <!-- Search -->
    <div class="row">
      <p-block :title="$t('reference cash out')">
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
            <tr
              slot="p-head"
              class="text-center"
            >
              <th>Number</th>
              <th>Date</th>
              <th>Person</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Created By</th>
            </tr>
            <template v-for="(reference, index) in references">
              <!-- Table Payment Order -->
              <template v-for="(referenceDetail, index2) in reference.details">
                <tr
                  v-if="reference.form.formable_type === 'PaymentOrder'"
                  :key="'reference-' + index + index2"
                  slot="p-body"
                  style="cursor: pointer"
                  class="table-select text-center"
                  :class="{
                    active:
                      reference.id == mutableId &&
                      reference.form.formable_type === mutableType
                  }"
                  @click="choosePaymentOrder(reference)"
                >
                  <th>
                    <router-link
                      :to="{
                        name: 'finance.payment-order.show',
                        params: { id: reference.id }
                      }"
                      class="link-color"
                    >
                      {{ reference.form.number }}
                    </router-link>
                  </th>
                  <td>
                    {{ reference.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </td>
                  <td>
                    {{ reference.paymentable.name }}
                  </td>
                  <td>{{ referenceDetail.account.label }}</td>
                  <td>
                    {{ referenceDetail.amount | numberFormat }}
                  </td>
                  <td>{{ referenceDetail.notes }}</td>
                  <td>
                    {{ reference.form.created_by.name }}
                  </td>
                </tr>
              </template>
              <!-- Table Down Payment -->
              <tr
                v-if="reference.form.formable_type === 'PurchaseDownPayment'"
                :key="'reference-' + index"
                slot="p-body"
                style="cursor: pointer"
                class="table-select text-center"
                :class="{
                  active:
                    reference.id == mutableId &&
                    reference.form.formable_type === mutableType
                }"
                @click="chooseDownPayment(reference)"
              >
                <th>
                  <router-link
                    :to="{
                      name: 'purchase.down-payment.show',
                      params: { id: reference.id }
                    }"
                    class="link-color"
                  >
                    {{ reference.form.number }}
                  </router-link>
                </th>
                <td>
                  {{ reference.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                </td>
                <td>{{ reference.supplier.name }}</td>
                <td>{{ downPaymentAccountLabel }}</td>
                <td class="text-right">
                  {{ reference.amount | numberFormat }}
                </td>
                <td>{{ reference.form.notes }}</td>
                <td>
                  {{ reference.form.created_by.name }}
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>

    <div class="row">
      <!-- Pagination Cash Person -->
      <div class="col d-flex justify-content-start">
        <p-pagination-modal
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </div>
      <!-- Button Clear -->
      <div class="col d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-md btn-outline-danger"
          @click="clear()"
        >
          {{ $t('clear') | uppercase }}
        </button>
      </div>
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
      searchText: '',
      currentPage: 1,
      lastPage: 1,
      limit: 10,
      isActiveSelect: false,
      //
      options: [],
      // Data Default Mutable Id & Type
      mutableId: null,
      mutableType: null
    }
  },
  computed: {
    ...mapGetters('financeCashOutReference', ['references', 'pagination'])
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  mounted () {
    // // Add Style for Responsive Table
    // const addStyle = document.querySelector('div.sweet-content-content')
    // addStyle.style.width = '100%'      // Add Class for Responsive Table
    // const addClass = document.querySelector('div.sweet-modal')
    // addClass.classList.add('sweet-modal-responsive')
    // addClass.style.width = '100%'
  },
  methods: {
    ...mapActions('accountingSettingJournal', {
      findAccount: 'find'
    }),
    ...mapActions('financeCashOutReference', {
      getReferences: 'get'
    }),
    // Filter Data Finance Payment
    filterSearch: debounce(function (value) {
      // this.$router.push({ query: { search: value } })
      this.searchText = value
      this.search()
    }, 300),
    //
    search () {
      this.isLoading = true
      //
      this.findAccount({
        feature: 'purchase',
        name: 'down payment'
      }).then((response) => {
        this.downPaymentAccountId = response.data.id
        this.downPaymentAccountLabel = response.data.label
      })

      this.getReferences({
        params: {
          //
          sort_by: 'form.date',
          // PO
          paymentorder_join: 'form,details,account',
          // paymentorder_sort_by: '-form.date',
          paymentorder_group_by: 'payment_order.id',
          paymentorder_fields: 'payment_order.*',
          paymentorder_filter_form: 'notArchived;pending;approvalApproved',
          paymentorder_filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            paymentable_name: this.searchText
          },
          paymentorder_filter_null: 'payment_order.payment_id',
          paymentorder_filter_equal: {
            'payment_order.payment_type': 'cash'
          },
          paymentorder_includes:
            'form;paymentable;details.account;details.allocation;form.createdBy',

          // DPs
          downpayment_join: 'form',
          // downpayment_sort_by: '-form.date',
          downpayment_group_by: 'purchase_down_payment.id',
          downpayment_fields: 'purchase_down_payment.*',
          downpayment_filter_form: 'notArchived;pending;approvalApproved',
          downpayment_filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            supplier_name: this.searchText
          },
          downpayment_includes: 'form;supplier;form.createdBy',

          // LP
          limit: this.limit,
          page: this.currentPage
        }
      })
        .then((response) => {
          this.isLoading = false
          console.log('asd', response)
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
    choosePaymentOrder (paymentOrder) {
      // Initialization Data Cash Person
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
      // Initialization Data Select
      this.mutableId = paymentOrder.id
      this.mutableType = paymentOrder.form.formable_type
      this.$emit('input', paymentOrder.id)
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

      // Initialization Data Select
      // Emit Data Values
      this.mutableId = downPayment.id
      this.mutableType = downPayment.form.formable_type
      this.$emit('input', downPayment.id)
      this.$emit('choosen', downPayment)
      this.close()
    },
    // open () {
    //   this.search()
    //   // Add Style for Responsive Table
    //   const addStyle = document.querySelector('div.sweet-content-content')
    //   addStyle.style.width = '100%'
    //   // Open Modal
    //   this.$refs.modal.open()
    // },
    async open (index = null) {
      this.index = index
      this.search()
      this.$refs.modal.open()

      const addClass = document.querySelector('div.sweet-modal')
      await addClass.classList.add('sweet-modal-responsive')
      addClass.style.width = '100%'

      // Add Style for Responsive Table
      const addStyle = document.querySelector('div.sweet-content-content')
      addStyle.style.width = '100%'

      // Open Modal
    },
    clear (clear) {
      // Initialization Data Select to Reset Default
      // Search Text
      this.searchText = ''
      // Mutable Id
      this.mutableId = null
      this.mutableType = null
      // Current Page
      this.currentPage = 1
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
.sweet-modal {
  width: 10% !important;
}
.sweet-modal-responsive {
  width: 10% !important;
}
/*  */
.table-select:hover > th,
.table-select:hover > td {
  background-color: #f6f7f9;
}
.active > th,
.active > th > .link-color,
.active > td {
  color: white !important;
  background-color: #3f9ce8 !important;
}

input:readonly {
  background-color: white;
}
input {
  min-width: 200px;
}
/* .link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
} */
.w-1 {
  width: 1px;
}
/* Style for Hide Border */
.block {
  background-color: none !important;
  -webkit-box-shadow: 0 0px 0px #e4e7ed !important;
  box-shadow: 0 0px 0px #e4e7ed !important;
}
</style>
