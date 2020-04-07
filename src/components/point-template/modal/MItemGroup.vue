<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('select item group') | uppercase"
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
      </div>
      <div class="pull-right">
        <!-- <button type="button" @click="add()" class="btn btn-sm btn-outline-secondary mr-5">{{ $t('add') | uppercase }}</button>
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button> -->
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
    ...mapGetters('masterItemGroup', ['groups', 'pagination'])
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
    value () {
      this.mutableId = this.value
    },
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('masterItemGroup', ['get', 'create']),
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
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('clear')
    },
    open () {
      this.$refs.modal.open()
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
.clickable {
  cursor: pointer;
}
</style>
