<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select asset') | uppercase"
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
        <template v-for="(option, idx) in options">
          <a
            :key="idx"
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
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div class="pull-left">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary mr-5"
          @click="$refs.addFixedAsset.open()"
        >
          {{ $t('create new') | uppercase }}
        </button>
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

    <m-add-fixed-asset
      id="add-fixed-asset"
      ref="addFixedAsset"
      @added="onAdded()"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      chartOfAccountId: null,
      accumulationChartOfAccountId: null,
      depreciationChartOfAccountId: null,
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
    ...mapGetters('masterFixedAsset', ['fixedAssets', 'pagination'])
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
    this.search()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterFixedAsset', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          },
          filter_equal_or: {
            chart_of_account_id: this.chartOfAccountId,
            accumulation_chart_of_account_id: this.accumulationChartOfAccountId,
            depreciation_chart_of_account_id: this.depreciationChartOfAccountId
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          this.options.push({
            id: key.id,
            label: key.name,
            depreciation_method: key.depreciation_method
          })

          if (this.value == key.id) {
            this.mutableLabel = key.name
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    onAdded () {
      this.search()
    },
    add () {
      this.isSaving = true
      this.create({
        name: this.searchText
      }).then(response => {
        this.search()
        this.isSaving = false
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    open (index = null, options = null) {
      this.index = index
      if (options) {
        this.chartOfAccountId = options.chartOfAccountId
        this.accumulationChartOfAccountId = options.accumulationChartOfAccountId
        this.depreciationChartOfAccountId = options.depreciationChartOfAccountId
        this.search()
      }
      this.$refs['select-' + this.id].open()
      this.$nextTick(() => {
        this.$refs.searchText.focus()
      })
    },
    choose (option) {
      option.index = this.index
      option.name = option.label
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
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
