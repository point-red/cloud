<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || 'SELECT' | uppercase }}</span>
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
            {{ option.label | uppercase }}
          </a>
          </template>
        </div>
        <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
          {{ $t('searching not found', [searchText]) | capitalize }}
        </div>
        <div class="alert alert-info text-center" v-if="!searchText && options.length == 0 && !isLoading">
          {{ $t('you don\'t have any') | capitalize }} {{ $t('item') | capitalize }}
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger mr-5">{{ $t('clear') | uppercase }}</button>
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
    ...mapGetters('masterItem', ['items', 'pagination'])
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
    ...mapActions('masterItem', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 100,
          filter_like: {
            code: this.searchText,
            name: this.searchText
          },
          includes: 'units'
        }
      }).then(response => {
        this.options = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'label': key['label'],
            'name': key['name'],
            'require_expiry_date': key['require_expiry_date'],
            'require_production_number': key['require_production_number'],
            'unit_default': key['unit_default'],
            'unit_default_purchase': key['unit_default_purchase'],
            'unit_default_sales': key['unit_default_sales'],
            'units': key['units']
          })

          if (this.value == key['id']) {
            this.mutableLabel = key['label']
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
    clear (option) {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('clear')
      this.close()
    },
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      // make default unit non reactive
      let unit = JSON.parse(JSON.stringify(option.units[0]))
      this.$emit('input', option.id)
      this.$emit('choosen', {
        id: option.id,
        name: option.name,
        require_expiry_date: option.require_expiry_date,
        require_production_number: option.require_production_number,
        unit_default: option.unit_default,
        unit_default_purchase: option.unit_default_purchase,
        unit_default_sales: option.unit_default_sales,
        units: option.units,
        unit: unit
      })
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
