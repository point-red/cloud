<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || 'SELECT' | uppercase }}</span>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select warehouse">
      <template slot="content">
        <input type="text" class="form-control" v-model="searchText" placeholder="Search..." @keydown.enter.prevent="">
        <hr>
        <div v-if="isLoading">
          <h3 class="text-center">Loading ...</h3>
        </div>
        <div v-else class="list-group push">
          <template v-for="(option, index) in options">
          <a
            :key="index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': option.id == mutableId }"
            @click="choose(option)"
            href="javascript:void(0)">
            {{ option.label | uppercase }}
          </a>
          </template>
        </div>
        <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
          {{ $t('searching not found', [searchText]) | capitalize }} <br>
          {{ $t('click') }} <span class="link" @click="add"><i class="fa fa-xs" :class="{
            'fa-refresh fa-spin': isSaving,
            'fa-plus': !isSaving
          }"></i> Add</span> {{ $t('to add new data') }}
        </div>
        <div class="alert alert-info text-center" v-if="!searchText && options.length == 0 && !isLoading">
          {{ $t('you don\'t have any') | capitalize }} {{ $t('warehouse') | capitalize }}, <br/> {{ $t('you can create') }}
          <router-link :to="'/master/warehouse/create'">
            <span>{{ $t('new one') }}</span>
          </router-link>
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
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
    ...mapGetters('masterWarehouse', ['warehouses', 'pagination'])
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    }
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
  methods: {
    ...mapActions('masterWarehouse', ['get', 'create']),
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
            'id': key['id'],
            'name': key['name'],
            'label': key['name']
          })

          if (this.value == key['id']) {
            this.mutableLabel = key['name']
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
