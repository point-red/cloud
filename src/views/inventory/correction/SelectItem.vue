<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select item') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <input
        ref="searchText"
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
        class="list-group push"
      >
        <template v-for="(option, optionIndex) in options">
          <a
            :key="optionIndex"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }}
          </a>
        </template>
      </div>
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('searching not found', [searchText]) | capitalize }}
      </div>
      <div
        v-if="!searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('you don\'t have any') | capitalize }} {{ $t('item') | capitalize }}
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
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import axiosNode from '@/axiosNode'
// import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    warehouseId: {
      type: Number,
      default: null
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    createButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      index: null,
      searchText: '',
      options: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    // ...mapGetters('masterItem', ['items', 'pagination'])
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    if (this.warehouseId) {
      this.search()
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    getItems (payload) {
      return axiosNode.get('/master/items', payload)
    },
    search () {
      this.isLoading = true
      this.getItems({
        params: {
          warehouse_id: this.warehouseId,
          filter_like: {
            code: this.searchText,
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        this.mutableLabel = ''
        response.data.data.map((key, value) => {
          this.options.push({
            id: key.id,
            label: key.label,
            name: key.name,
            require_expiry_date: key.requireExpiryDate,
            require_production_number: key.requireProductionNumber,
            unit_default: key.unitDefault,
            unit_default_purchase: key.unitDefaultPurchase,
            unit_default_sales: key.unitDefaultSales,
            units: key.units
          })

          if (this.value == key.id) {
            this.mutableLabel = key.label
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    clear (option) {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', {
        index: this.index,
        id: null,
        name: null,
        label: null,
        require_expiry_date: null,
        require_production_number: null,
        unit_default: null,
        unit_default_purchase: null,
        unit_default_sales: null,
        units: null,
        unit: null
      })
      this.close()
    },
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      // make default unit non reactive
      const unit = JSON.parse(JSON.stringify(option.units[0]))
      this.$emit('choosen', {
        index: this.index,
        id: option.id,
        name: option.name,
        label: option.label,
        require_expiry_date: option.require_expiry_date,
        require_production_number: option.require_production_number,
        unit_default: option.unit_default,
        unit_default_purchase: option.unit_default_purchase,
        unit_default_sales: option.unit_default_sales,
        units: option.units,
        unit: unit
      })
      this.close()
    },
    open (index = null) {
      this.search()
      this.index = index
      this.$refs['select-' + this.id].open()
      this.$nextTick(() => {
        this.$refs.searchText.focus()
      })
    },
    close () {
      this.$refs['select-' + this.id].close()
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
</style>
