<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select supplier') | uppercase"
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
      <div class="alert alert-info text-center" v-if="!searchText && options.length == 0 && !isLoading">
        {{ $t('you don\'t have any') | capitalize }} {{ $t('supplier') | capitalize }}
      </div>
      <button slot="button" type="button" @click="add()" class="btn btn-sm btn-outline-danger mr-5">{{ $t('add') | uppercase }}</button>
      <button slot="button" type="button" @click="clear()" class="btn btn-sm btn-outline-danger mr-5">{{ $t('clear') | uppercase }}</button>
    </sweet-modal>

    <m-add-supplier id="add-supplier" ref="addSupplier" @close="onClose()"></m-add-supplier>
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
    ...mapGetters('masterSupplier', ['suppliers', 'pagination'])
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
    },
    value () {
      this.mutableId = this.value
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('masterSupplier', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
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
    add () {
      this.$refs.addSupplier.open()
    },
    onClose () {
      this.search()
    },
    save () {
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
    open () {
      this.$refs['select-' + this.id].open()
    },
    choose (option) {
      this.mutableId = option.id
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
</style>
