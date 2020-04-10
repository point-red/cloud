<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select customer') | uppercase"
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
          {{ option.label | uppercase }}<br v-if="option.address">
          {{ option.address | uppercase }}<br v-if="option.email">
          {{ option.email | uppercase }}<br v-if="option.phone">
          {{ option.phone | uppercase }}
        </a>
        </template>
      </div>
      <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div class="pull-left">
        <button type="button" class="btn btn-sm btn-outline-secondary mr-5" @click="$refs.addCustomer.open()">
          {{ $t('create new') | uppercase }}
        </button>
      </div>
      <div class="pull-right">
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
      </div>
    </sweet-modal>

    <m-add-customer id="add-customer" ref="addCustomer" @added="onAdded()"></m-add-customer>
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
    ...mapGetters('masterCustomer', ['customers', 'pagination'])
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
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('masterCustomer', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 20,
          includes: 'addresses;phones;emails',
          filter_like: {
            'name': this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          let obj = {
            'id': key['id'],
            'name': key['name'],
            'label': key['label']
          }
          if (key['addresses'].length > 0) {
            obj.address = key['addresses'][0]['address']
          }
          if (key['emails'].length > 0) {
            obj.email = key['emails'][0]['email']
          }
          if (key['phones'].length > 0) {
            obj.phone = key['phones'][0]['number']
          }
          this.options.push({
            ...obj
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
    choose (option) {
      this.mutableId = option.id
      this.$emit('choosen', option)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('choosen', '')
      this.close()
    },
    onAdded () {
      this.search()
    },
    open () {
      this.$refs['select-' + this.id].open()
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
