<template>
  <sweet-modal
    ref="modal"
    :title="'Select Purchase Order' | uppercase"
    overlay-theme="dark"
    @close="onClose">
    <input type="text" class="form-control" v-model="searchText" placeholder="Search..." @keydown.enter.prevent="">
    <hr>
    <div v-if="isLoading">
      <h3 class="text-center">Loading ...</h3>
    </div>
    <div v-else class="list-group push">
      <a v-for="(option, index) in options"
        :key="'request-'+index"
        class="list-group-item list-group-item-action"
        href="javascript:void(0)"
        @click="choose(option)">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ option.form.number }}</strong>
          </div>
          <div style="font-size: 0.8em;" class="text-black-50 text-right">
            Created by {{ option.form.created_by.name }}<br>
            {{ option.form.created_at | dateFormat('DD MMMM YYYY HH:mm') }}
          </div>
        </div>
        <table style="font-size:11px" class="table mb-0">
          <tr v-for="(item, index) in option.items" :key="'item-'+index">
            <td class="pl-0">
              {{ item.item.name }}
            </td>
            <td class="w-1 text-right text-nowrap">
              {{ item.quantity }} {{ item.unit }}
            </td>
          </tr>
        </table>
      </a>
    </div>
    <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
      {{ $t('searching not found', [searchText]) | capitalize }}
    </div>
    <div class="pull-right">
      <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
    </div>
  </sweet-modal>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      index: null,
      searchText: '',
      options: [],
      selected: {},
      isLoading: false
    }
  },
  props: {
    id: {
      type: String
    },
    value: {
      type: [String, Number]
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  methods: {
    ...mapActions('purchaseOrder', ['get']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,items,item',
          fields: 'purchase_order.*',
          sort_by: '-form.number',
          group_by: 'form.id',
          filter_form: 'activePending;approvalApproved',
          filter_not_null: 'form.number',
          includes: 'items.item.units;form.createdBy'
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