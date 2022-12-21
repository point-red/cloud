<template>
  <sweet-modal
    id="select-purchase-invoice-modal"
    ref="modal"
    :title="'Select Purchase Invoice' | uppercase"
    overlay-theme="dark"
    width="70%"
    @close="onClose"
  >
    <input
      id="search-purchase-invoice"
      v-model="searchText"
      type="text"
      class="form-control"
      placeholder="Search..."
      @keydown.enter.prevent=""
    >
    <hr>
    <div v-if="isLoading">
      <h3 class="text-center">
        Loading ...
      </h3>
    </div>
    <div
      v-else
      class="list-group push table-responsive"
    >
      <table class="table table-sm">
        <tr>
          <th>Date Receive</th>
          <th>Purchase Receive</th>
          <th>Date Invoice</th>
          <th>Invoice Number</th>
          <th>Supplier</th>
          <th>Item</th>
          <th>Quantity Receive</th>
          <th>Warehouse Receive</th>
        </tr>
        <template v-for="(option, optionIndex) in options">
          <tbody
            slot="p-body"
            :key="'request-'+optionIndex"
            class="cursor-pointer hover-active"
            @click="choose(option)"
          >
            <template v-for="(item, itemIndex) in option.items">
              <tr
                v-if="item.quantity > 0"
                :key="'request-'+optionIndex+'-'+itemIndex"
              >
                <td>{{ `${$options.filters.dateFormat(item.purchaseReceive.form.date, 'DD MMMM YYYY')}` }}</td>
                <td>{{ item.purchaseReceive.form.number }}</td>
                <td>{{ itemIndex === 0 ? `${$options.filters.dateFormat(option.form.date, 'DD MMMM YYYY')}` : null }}</td>
                <td>{{ itemIndex === 0 ? option.form.number : null }}</td>
                <td>{{ itemIndex === 0 ? option.supplierName : null }}</td>
                <td>{{ item.itemName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.purchaseReceive.warehouseName }}</td>
              </tr>
            </template>
          </tbody>
        </template>
      </table>
      <p-pagination
        :current-page="currentPage"
        :last-page="lastPage"
        @updatePage="updatePage"
      />
    </div>
    <div
      v-if="searchText && options.length == 0 && !isLoading"
      class="alert alert-info text-center"
    >
      {{ $t('searching not found', [searchText]) | capitalize }}
    </div>
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
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      index: null,
      searchText: '',
      currentPage: 1,
      lastPage: 1,
      options: [],
      selected: {},
      isLoading: false
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  methods: {
    ...mapActions('purchaseReturn', ['getInvoices']),
    search () {
      this.isLoading = true
      this.getInvoices({
        params: {
          remaining_info: true,
          join: 'form,supplier,items,item',
          fields: 'purchase_invoice.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: 'pending;approvalApproved',
          filter_not_null: 'form.number',
          filter_like: {
            'form.number': this.searchText
          },
          includes: 'supplier;items.item.units;form.createdBy;'
        }
      }).then(response => {
        const purchaseInvoices = response.data
        this.options = []
        purchaseInvoices.forEach(purchaseInvoice => {
          purchaseInvoice.items.forEach(item => {
            item.quantity = parseFloat(item.quantity)
            item.purchaseReturnItems.forEach(returnItem => {
              item.quantity = parseFloat(item.quantity) - parseFloat(returnItem.quantity)
            })
          })
          this.options.push(purchaseInvoice)
        })
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    clear (option) {
      this.$emit('choosen', {
        id: null,
        form: {
          number: null
        }
      })
      this.close()
    },
    choose (option) {
      this.$emit('choosen', option)
      this.close()
    },
    open (index = null) {
      this.index = index
      this.search()
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close', true)
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
input:readonly {
  background-color: white
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
