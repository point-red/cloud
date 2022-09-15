<template>
  <sweet-modal
    ref="modal"
    :title="'Select Sales Invoice' | uppercase"
    overlay-theme="dark"
    @close="onClose()"
  >
    <input
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
          <th>Date</th>
          <th>Sales Invoice</th>
          <th>Customer</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
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
                v-if="item.quantityRemaining > 0"
                :key="'request-'+optionIndex+'-'+itemIndex"
              >
                <td>{{ itemIndex === 0 ? `${$options.filters.dateFormat(option.form.date, 'DD MMMM YYYY')}` : null }}</td>
                <td>{{ itemIndex === 0 ? option.form.number : null }}</td>
                <td>{{ itemIndex === 0 ? option.customerName : null }}</td>
                <td>{{ item.itemName }}</td>
                <td>{{ item.quantityRemaining }}</td>
                <td>{{ item.price - item.discountValue }}</td>
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
      this.currentPage = 1
      this.search()
    }, 300)
  },
  methods: {
    ...mapActions('salesInvoice', ['get']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          filter_like: {
            'form.number': this.searchText,
            'form.created_at': this.searchText,
            'customer.name': this.searchText,
            'items.item_name': this.searchText
          },
          filter_form: 'pending;null',
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.options = response.data
        this.lastPage = response.meta.last_page
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
      this.searchText = ''
      this.$emit('close', true)
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
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
.cursor-pointer {
  cursor: pointer;
}
.hover-active:hover {
  background: #2196f3;
  color: #ffffff;
}
</style>
