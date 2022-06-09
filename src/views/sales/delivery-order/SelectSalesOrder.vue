<template>
  <sweet-modal
    ref="modal"
    :title="'select sales order' | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <p-form-input
      id="search-text"
      class="btn-block"
      name="search-text"
      placeholder="Search..."
      :value="searchText"
      @input="filterSearch"
    />
    <hr>
    <p-block-inner :is-loading="isLoading">
      <point-table>
        <tr slot="p-head">
          <th>Date Form</th>
          <th>Form Number</th>
          <th>Customer</th>
          <th width="105px">
            Item
          </th>
          <th width="50px">
            Quantity Requested
          </th>
          <th width="50px">
            Quantity Remaining
          </th>
        </tr>
        <template v-for="(option, optionIndex) in salesOrders">
          <tr
            v-for="(item, itemIndex) in option.items"
            :key="'pr-' + optionIndex + '-i-' + itemIndex"
            slot="p-body"
            class="list-group-item-action"
            style="cursor: pointer"
            @click="choose(option)"
          >
            <th>{{ option.form.created_at | dateFormat('DD MMMM YYYY HH:mm') }}</th>
            <td>{{ option.form.number }}</td>
            <td>{{ option.form.created_by.name }}</td>
            <td>{{ item.item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.quantity_remaining }}</td>
          </tr>
        </template>
      </point-table>
      <p-pagination
        :current-page="currentPage"
        :last-page="lastPage"
        @updatePage="updatePage"
      />
    </p-block-inner>
    <div
      v-if="searchText && salesOrders.length == 0 && !isLoading"
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
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable
  },
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
      limit: 10,
      selected: {},
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('salesOrder', ['salesOrders', 'pagination'])
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesOrder', ['get']),
    filterSearch: debounce(function (value) {
      console.log({ value })
      this.searchText = value
      this.currentPage = 1
      this.getSalesOrder()
    }, 500),
    getSalesOrder () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,items,item,customer',
          fields: 'sales_order.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: 'activePending;approvalApproved',
          filter_not_null: 'form.number',
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText,
            'item.code': this.searchText,
            'item.name': this.searchText,
            'sales_order_item.notes': this.searchText,
            'sales_order_item.quantity': this.searchText,
            'sales_order_item.price': this.searchText
          },
          includes: 'customer;items.item.units;form.createdBy',
          remaining_delivery_order_info: 1,
          limit: this.limit,
          page: this.currentPage
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getSalesOrder()
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

      this.getSalesOrder()

      this.$refs.modal.open()
      this.$refs.modal.$el.querySelector('.sweet-content-content').style.overflow = 'auto'
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
