<template>
  <div>
    <span
      class="link"
      @click="show"
    >{{ mutableLabel || 'SELECT' | uppercase }}</span>
    <a
      v-show="mutableId != null"
      href="javascript:void(0)"
      class="ml-5"
      @click="clear"
    >
      <i class="clickable fa fa-close" />
    </a>
    <p-modal
      :id="'select-' + id"
      :ref="'select-' + id"
      title="select service"
    >
      <template slot="content">
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
          {{ $t('click') }} <span
            class="link"
            @click="add"
          ><i
            class="fa fa-xs"
            :class="{
              'fa-refresh fa-spin': isSaving,
              'fa-plus': !isSaving
            }"
          /> Add</span> {{ $t('to add new data') }}
        </div>
        <div
          v-if="!searchText && options.length == 0 && !isLoading"
          class="alert alert-info text-center"
        >
          {{ $t('you don\'t have any') | capitalize }} {{ $t('service') | capitalize }}, <br> {{ $t('you can create') }}
          <router-link :to="'/master/service/create'">
            <span>{{ $t('new one') }}</span>
          </router-link>
        </div>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
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
      searchText: '',
      options: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterService', ['services', 'pagination'])
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
    ...mapActions('masterService', ['get', 'create']),
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
      this.$emit('choosen', option.label)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', '')
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
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
