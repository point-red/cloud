<template>
  <sweet-modal
    ref="modal"
    :title="'Select Purchase Request' | uppercase"
    overlay-theme="dark"
    @close="onClose()">
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
        <table class="table mb-0">
          <tr v-for="(item, index) in option.items" :key="'item-'+index">
            <td class="pl-0">
              {{ item.item.name }}
            </td>
            <td class="w-1 text-right text-nowrap">
              {{ item.quantity }} {{ item.unit }}
            </td>
            <td class="w-1 text-right text-nowrap pr-0">
              {{ item.price | numberFormat }}
            </td>
          </tr>
        </table>
      </a>
    </div>
    <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
      {{ $t('searching not found', [searchText]) | capitalize }}
    </div>
    <div class="alert alert-info text-center" v-if="!searchText && options.length == 0 && !isLoading">
      {{ $t('you don\'t have any') | capitalize }} {{ $t('item') | capitalize }}
    </div>
    <div class="pull-right">
      <button type="button" @click="add()" class="btn btn-sm btn-outline-secondary mr-5">{{ $t('create') | uppercase }}</button>
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
  computed: {
    ...mapGetters('masterItem', ['items', 'pagination'])
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
  created () {
    this.search()
  },
  methods: {
    ...mapActions('purchaseRequest', ['get', 'create']),
    search () {
      this.isLoading = true
      let params = {
        // sort_by: 'name',
        limit: 100,
        // filter_like: {
        //   code: this.searchText,
        //   name: this.searchText
        // },
        // filter_has: {
        //   'items.name': this.searchText
        // },
        includes: 'items.item.units;form.createdBy'
      }
      this.get({ params })
        .then(response => {
          this.options = response.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clear (option) {
      this.$emit('choosen', {
        index: this.index,
        id: null
      })
      this.close()
    },
    choose (option) {
      this.$emit('choosen', option)
      this.close()
    },
    open (index = null) {
      this.index = index
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
