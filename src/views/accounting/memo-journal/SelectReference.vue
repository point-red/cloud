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
          {{ option.number | uppercase }}
        </a>
      </template>
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
      mutableId: null,
      selected: {},
      isLoading: false,
      coa_id: null,
      masterable_id: null,
      masterable_type: null
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  methods: {
    ...mapActions('accountingMemoJournal', ['getFormReferences']),
    search () {
      this.isLoading = true
      this.getFormReferences({
        params: {
          coa_id: this.coa_id,
          masterable_id: this.masterable_id,
          masterable_type: this.masterable_type,
          filter_like: this.searchText
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
      this.$emit('input', null)
      this.$emit('choosen', {
        index: this.index,
        id: null,
        number: null
      })
      this.close()
    },
    choose (option) {
      option.index = this.index
      this.mutableId = option.id
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    open (index, row) {
      if (!row.chart_of_account_sub_ledger) return
      this.index = index
      if (row.chart_of_account_id) {
        this.coa_id = row.chart_of_account_id
        this.masterable_id = row.masterable_id
        this.masterable_type = row.masterable_type
        this.search()
        this.$refs.modal.open(index)
      }
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
</style>
