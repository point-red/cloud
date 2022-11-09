<!-- Still Need FIX in Layout -->
<template>
  <!-- Modal Select Reference Cash Advance -->
  <sweet-modal
    ref="modal"
    :title="'select reference cash advance' | uppercase"
    overlay-theme="dark"
    width="80%"
    enable-mobile-fullscreen
    @close="onClose()"
  >
    <!-- Search -->
    <div class="row">
      <p-block :title="$t('reference cash advance')">
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
        <!-- Table Reference Cash Advance  -->
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr
              slot="p-head"
              class="text-center"
            >
              <th>Number</th>
              <th>Date</th>
              <th>Person</th>
              <th>Amount</th>
              <th>Amount Remaining</th>
              <th>Notes</th>
              <th>Created By</th>
            </tr>
            <template v-for="(option, optionIndex) in options">
              <tr
                :key="optionIndex"
                slot="p-body"
                style="cursor: pointer"
                class="table-select text-center"
                :class="{ active: option.id == mutableId }"
                @click="chooseCashAdvance(option)"
              >
                <th>
                  <router-link
                    :to="{
                      name: 'finance.cash-advance.show',
                      params: { id: option.id }
                    }"
                    class="link-color"
                  >
                    {{ option.form.number }}
                  </router-link>
                </th>
                <td>
                  {{ option.form.date | dateFormat('DD MMMM YYYY') }}
                </td>
                <td>
                  {{ option.employee.name }}
                </td>
                <td>
                  {{ option.amount | numberFormat }}
                </td>
                <td>
                  {{ option.amount_remaining | numberFormat }}
                </td>
                <td>
                  {{ option.details[0].notes }}
                </td>
                <td>
                  {{ option.form.created_by.name }}
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
      limit: 100,
      isActiveSelect: false,
      //
      options: [],
      // Data Default Index
      index: null,
      // Data Default Mutable Id & Label
      mutableId: null
    }
  },
  computed: {
    // ...mapGetters('financePaymentOrder', {
    //   paymentOrders: 'paymentOrders',
    //   paymentOrdersPagination: 'pagination'
    // }),
    // ...mapGetters('purchaseDownPayment', ['downPayments', 'pagination']),
    // ...mapGetters('financeCashOutReference', ['references', 'pagination'])
    ...mapGetters('financeCashAdvance', ['cashAdvances', 'pagination'])
  },
  // watch: {
  //   handler: function () {
  //     this.$router.push({
  //       query: {
  //         ...this.$route.query
  //       }
  //     })
  //     this.search()
  //   },

  //   deep: true
  // },
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
    // ...mapActions('financePaymentOrder', {
    //   getPaymentOrder: 'get'
    // }),
    // ...mapActions('purchaseDownPayment', {
    //   getPurchaseDownPayment: 'get'
    // }),
    // ...mapActions('accountingSettingJournal', {
    //   findAccount: 'find'
    // }),
    // ...mapActions('financeCashOutReference', {
    //   getReferences: 'get'
    // }),
    ...mapActions('financeCashAdvance', {
      getReferenceCashAdvance: 'get'
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
      this.getReferenceCashAdvance({
        params: {
          join: 'form,details,account,employee',
          sort_by: 'form.date',
          group_by: 'cash_advance.id',
          fields: 'cash_advance.*',
          filter_form: 'active;pending;approvalApproved',
          filter_not_equal: {
            amount_remaining: 0
          },
          filter_equal: {
            payment_type: 'cash'
          },
          // filter_where_has: [
          //   {
          //     details: {
          //       chart_of_account_id: ''
          //     }
          //   }
          // ],
          filter_like: {
            'form.number': this.searchText,
            'employee.name': this.searchText,
            'cash_advance_detail.notes': this.searchText
          },
          includes: 'employee;form;details.account;form.createdBy',
          limit: this.limit,
          page: this.currentPage
        }
      })
        .then((response) => {
          this.options = response.data
          this.isLoading = false
          console.log('opca', this.options)
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
    chooseCashAdvance (option) {
      //

      // Initialization Data Cash Person
      this.mutableId = option.id
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
      console.log('index', option)
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
      this.$emit('input', downPayment.id)
      this.$emit('choosen', downPayment)
      this.close()
    },
    open (index = null) {
      this.index = index
      this.search()
      // Add Style for Responsive Table
      const addStyle = document.querySelector('div.sweet-content-content')
      addStyle.style.width = '100%'
      // Open Modal
      this.$refs.modal.open()
    },
    // async open (index = null) {
    //   this.index = index
    //   this.search()
    //   this.$refs.modal.open()
    //   await this.$nextTick()
    //   // Add Style for Responsive Table
    //   const addStyle = document.querySelector('div.sweet-content-content')
    //   addStyle.style.width = '100%'
    //   // Open Modal
    // },
    clear (option) {
      // Initialization Data Select to Reset Default
      // Search Text
      this.searchText = ''
      // Mutable Id
      this.mutableId = null
      // Current Page
      this.currentPage = 1
      //
      this.$emit('choosen', {
        id: null,
        form: {
          number: null
        },
        details: [
          {
            notes: null
          }
        ],
        amount: 0,
        amount_remaining: 0,
        amount_usage: 0
      })
      console.log(this.option)
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
