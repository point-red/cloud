<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('select chart of account') | uppercase"
      overlay-theme="dark"
      @close="onClose()">
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
        {{ $t('you don\'t have any') | capitalize }} {{ $t('chart of account') | capitalize }}, <br/> {{ $t('you can create') }}
        <router-link :to="'/accounting/chart-of-account/create'">
          <span>{{ $t('new one') }}</span>
        </router-link>
      </div>
      <div class="pull-right">
        <button type="button" @click="add()" class="btn btn-sm btn-outline-secondary mr-5">{{ $t('add') | uppercase }}</button>
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
      </div>
    </sweet-modal>
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
    ...mapGetters('accountingChartOfAccount', ['chartOfAccounts'])
  },
  props: {
    id: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    },
    type: {
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
    ...mapActions('accountingChartOfAccount', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          join: 'account_type',
          fields: 'account.*',
          limit: 1000,
          filter_like: {
            'account_type.alias': this.searchText,
            'account.alias': this.searchText,
            'account.number': this.searchText
          },
          filter_equal: {
            'account_type.name': this.type
          },
          includes: 'type',
          sort_by: 'account.number;account.alias'
        }
      }).then(response => {
        this.options = []
        this.mutableLabel = null
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'alias': key['alias'],
            'label': key['label']
          })

          if (this.value == key['id']) {
            this.mutableLabel = key['number'] + ' - ' + key['alias']
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.$notification.error(error.message)
        this.isLoading = false
      })
    },
    add () {
      //
    },
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    open () {
      this.$refs.modal.open()
      this.search()
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
