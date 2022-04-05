<template>
  <sweet-modal
    ref="modal"
    :title="'Select Form Reference' | uppercase"
    overlay-theme="dark"
    @close="onClose"
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
          <th>No</th>
          <th>Date Send</th>
          <th>Form Number</th>
          <th>From Warehouse</th>
          <th>To Warehouse</th>
          <th>Item</th>
          <th>Quantity</th>
        </tr>
        <template v-for="(option, optionIndex) in options">
          <tbody
            slot="p-body"
            :key="'request-'+optionIndex"
            class="cursor-pointer hover-active"
            @click="choose(option)"
          >
            <template v-if="option.form.number">
              <template v-for="(item, itemIndex) in option.items">
                <tr
                  :key="'request-'+optionIndex+'-'+itemIndex"
                >
                  <td>{{ optionIndex + 1 }}</td>
                  <td>{{ option.form.date }}</td>
                  <td>{{ option.form.number }}</td>
                  <td>{{ option.warehouse.name }}</td>
                  <td>{{ option.to_warehouse.name }}</td>
                  <td>{{ item.item.name }}</td>
                  <td>{{ item.quantity }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </template>
      </table>
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
    ...mapActions('inventoryTransferItem', ['get']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          remaining_info: true,
          join: 'form,items,item',
          fields: 'transfer_sent.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: 'activePending;approvalApproved',
          filter_not_null: 'form.number',
          includes: 'items.item.units;form.createdBy;receiveItem.items;warehouse;to_warehouse'
        }
      }).then(response => {
        this.options = response.data
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
