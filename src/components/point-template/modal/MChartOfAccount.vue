<template>
  <div>
    <span @click="show" class="link"><i class="fa fa-list mr-5"></i>{{ mutableLabel || 'SELECT'}}</span>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select supplier">
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
          {{ $t('you doesn\'t have any') | capitalize }} {{ $t('chart of account') | capitalize }}, <br/> {{ $t('you can create') }} 
          <router-link :to="'/accounting/chart-of-account/create'">
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
    ...mapGetters('ChartOfAccount', ['chartOfAccounts'])
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
    ...mapActions('ChartOfAccount', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'number',
          limit: 50,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'label': key['number'] + ' - ' + key['alias']
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
