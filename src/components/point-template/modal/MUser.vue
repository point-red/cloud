<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select user') | uppercase"
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
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-left"
            :class="{'active': option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }} <br>
            <span style="font-size:10px">{{ option.email | uppercase }}</span>
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
    },
    permission: {
      type: String,
      default: ''
    },
    help: {
      type: String,
      default: ''
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
    ...mapGetters('masterUser', ['users', 'pagination'])
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
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterUser', ['get']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          },
          filter_permission: this.permission
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          this.options.push({
            id: key.id,
            label: key.first_name + ' ' + key.last_name,
            email: key.email,
            firstName: key.first_name,
            lastName: key.last_name,
            fullName: key.first_name + ' ' + key.last_name
          })

          if (this.value == key.id) {
            this.mutableLabel = key.first_name + ' ' + key.last_name
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
      this.$emit('choosen', option)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', '')
      this.close()
    },
    open () {
      this.$refs['select-' + this.id].open()
      this.search()
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
