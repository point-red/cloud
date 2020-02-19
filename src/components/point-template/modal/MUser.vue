<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || $t('select') | uppercase }}</span>
    <div
      v-for="(error, index) in mutableErrors"
      :key="index"
      class="invalid-input"><i class="fa fa-warning"></i> {{ error }}</div>
    <div
      v-show="help"
      class="form-text text-muted">{{ help }}</div>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select user">
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
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-left"
            :class="{'active': option.id == mutableId }"
            @click="choose(option)"
            href="javascript:void(0)">
            {{ option.label | uppercase }} <br>
            <span style="font-size:10px">{{ option.email | uppercase }}</span>
          </a>
          </template>
        </div>
        <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
          {{ $t('searching not found', [searchText]) | capitalize }} <br>
        </div>
        <div class="alert alert-info text-center" v-if="!searchText && options.length == 0 && !isLoading">
          {{ $t('you don\'t have any') | capitalize }} {{ $t('allocation') | capitalize }}
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
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
      mutableErrors: this.errors,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterUser', ['users', 'pagination'])
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
    },
    help: {
      type: String
    },
    errors: {
      type: Array,
      default: null
    }
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
    },
    errors () {
      this.mutableErrors = this.errors
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('masterUser', ['get', 'create']),
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
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'label': key['first_name'] + ' ' + key['last_name'],
            'email': key['email'],
            'firstName': key['first_name'],
            'lastName': key['last_name'],
            'fullName': key['first_name'] + ' ' + key['last_name']
          })

          if (this.value == key['id']) {
            this.mutableLabel = key['first_name'] + ' ' + key['last_name']
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
      this.mutableErrors = []
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
