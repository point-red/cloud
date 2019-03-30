<template>
  <div>
    <span @click="show" class="link"><i class="fa fa-list mr-5"></i>{{ mutableLabel || 'SELECT'}}</span>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select item">
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
            {{ option.label }}
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
          {{ $t('you doesn\'t have any') | capitalize }} {{ $t('item') | capitalize }}, <br/> {{ $t('you can create') }} 
          <router-link :to="'/master/item/create'">
            <span>{{ $t('new one') }}</span>
          </router-link>
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-outline-danger">Close</button>
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
      mutableId: null,
      mutableLabel: this.value,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('Item', ['items', 'pagination'])
  },
  props: {
    id: {
      type: String,
      required: true
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
    ...mapActions('Item', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          },
          includes: 'units'
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'label': key['name'],
            'units': key['units']
          })
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
        name: this.searchText,
        units: [
          {
            label: 'pcs',
            name: 'pcs'
          }
        ]
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
      this.$emit('units', {
        item_id: option.id,
        units: option.units
      })
      this.close()
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
    }
  }
}
</script>

<style>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px blueviolet;
  cursor: pointer;
}
</style>
