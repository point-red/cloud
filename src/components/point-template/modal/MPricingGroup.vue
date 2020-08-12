<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select pricing group') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
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
    }
  },
  data () {
    return {
      searchText: '',
      options: [],
      limit: 10,
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterPricingGroup', ['groups', 'pagination'])
  },
  watch: {
    value () {
      this.mutableId = this.value
    },
    label () {
      this.mutableLabel = this.label
    },
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  created () {
    this.search()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterPricingGroup', ['get']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'label',
          limit: this.limit,
          filter_like: {
            label: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.options.push({
            id: key.id,
            label: key.label
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
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', '')
      this.close()
    },
    onClose () {
      this.$emit('close')
    },
    open () {
      this.$refs['select-' + this.id].open()
    },
    close () {
      this.$refs['select-' + this.id].close()
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
