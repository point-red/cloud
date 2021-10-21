<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select allocation') | uppercase"
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
            {{ option.name | uppercase }}
          </a>
        </template>
      </div>
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div class="pull-right">
        <button
          v-if="createButton"
          type="button"
          class="btn btn-sm btn-outline-secondary mr-5"
          @click="add()"
        >
          {{ $t('add') | uppercase }}
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="clear()"
        >
          {{ $t('clear') | uppercase }}
        </button>
      </div>
    </sweet-modal>

    <m-add-allocation
      id="add-allocation"
      ref="addAllocation"
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
      default: ''
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
      searchText: '',
      options: [],
      index: null,
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterAllocation', ['allocations', 'pagination'])
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    },
    value () {
      this.mutableId = this.value
    }
  },
  created () {
    this.search()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterAllocation', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 10,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          const obj = {
            id: key.id,
            name: key.name,
            label: key.label
          }
          this.options.push({
            ...obj
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
    add () {
      this.$refs.addAllocation.open()
    },
    onAdded () {
      this.search()
    },
    save () {
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
    open (index = null) {
      this.index = index
      this.$refs['select-' + this.id].open()
      this.$nextTick(() => {
        this.$refs.searchText.focus()
      })
    },
    choose (option) {
      this.mutableId = option.id
      this.$emit('choosen', {
        ...option,
        index: this.index
      })
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', {
        index: this.index,
        id: null,
        name: null,
        label: null
      })
      this.close()
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
</style>
