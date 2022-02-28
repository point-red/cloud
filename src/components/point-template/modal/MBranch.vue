<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('select branch') | uppercase"
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
        class="list-group push"
      >
        <template v-for="(option, index) in options">
          <a
            :key="index"
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
      <div
        v-if="clearButton"
        class="pull-right"
      >
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="clear()"
        >
          {{ $t('clear') | uppercase }}
        </button>
      </div>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </sweet-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    clearButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchText: '',
      options: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterBranch', ['branches', 'pagination'])
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
    ...mapActions('masterBranch', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.options.push({
            id: key.id,
            name: key.name,
            label: key.name
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
      this.isSaving = true
      this.create({
        code: this.searchText,
        name: this.searchText
      }).then(response => {
        this.search()
        this.isSaving = false
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    onClose () {
      this.search()
    },
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
      this.$emit('close', true)
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = ''
      this.$emit('input', null)
      this.$emit('choosen', {
        id: null,
        name: '',
        label: ''
      })
      this.close()
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
