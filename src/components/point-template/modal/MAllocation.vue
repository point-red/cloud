<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select allocation') | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <input
        type="text"
        class="form-control"
        ref="searchText"
        v-model="searchText"
        placeholder="Search..."
        @keydown.enter.prevent="">
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
          {{ option.name | uppercase }}
        </a>
        </template>
      </div>
      <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div class="pull-right">
        <button type="button" @click="add()" class="btn btn-sm btn-outline-secondary mr-5">{{ $t('add') | uppercase }}</button>
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
      </div>
    </sweet-modal>

    <m-add-allocation id="add-allocation" ref="addAllocation" @added="onAdded()"></m-add-allocation>
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
      index: null,
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterAllocation', ['allocations', 'pagination'])
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
    ...mapActions('masterAllocation', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 10,
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
      this.$refs.addAllocation.open()
    },
    onAdded () {
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
    open (index = null) {
      this.index = index
      this.$refs['select-' + this.id].open()
      this.$nextTick(() => {
        this.$refs.searchText.focus()
      })
    },
    choose (option) {
      this.mutableId = option.id
      this.$emit('choosen', {
        ...option,
        index: this.index
      })
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', {
        index: this.index,
        id: null,
        name: null,
        label: null
      })
      this.close()
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
</style>
