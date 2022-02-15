<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select expedition') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <input
        ref="searchText"
        v-model="searchText"
        type="text"
        class="form-control"
        placeholder="Search..."
        @keydown.enter.prevent=""
      >
      <hr>
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
      >
        <template v-for="(option, idx) in options">
          <div
            :key="idx"
            class="list-group-item list-group-item-action justify-content-between align-items-center"
            :class="{'active': option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }}
            <div
              v-if="option.address"
              style="font-size:11px"
            >
              <i class="fa fa-home fa-fw" /> {{ option.address | uppercase }}
            </div>
            <div
              v-if="option.phone"
              style="font-size:11px"
            >
              <i class="fa fa-phone fa-fw" /> {{ option.phone | uppercase }}
            </div>
          </div>
        </template>
      </div>
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div class="pull-left">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary mr-5"
          @click="$refs.addExpedition.open()"
        >
          {{ $t('create new') | uppercase }}
        </button>
      </div>
      <div class="pull-right">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="clear()"
        >
          {{ $t('clear') | uppercase }}
        </button>
      </div>
    </sweet-modal>

    <m-add-expedition
      id="add-expedition"
      ref="addExpedition"
      @added="onAdded()"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      index: null,
      searchText: '',
      options: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterExpedition', ['expeditions', 'pagination'])
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
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterExpedition', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          includes: 'addresses;phones;emails',
          filter_like: {
            code: this.searchText,
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          const obj = {
            id: key.id,
            name: key.name,
            label: key.label
          }
          if (key.addresses.length > 0) {
            obj.address = key.addresses[0].address
          }
          if (key.emails.length > 0) {
            obj.email = key.emails[0].email
          }
          if (key.phones.length > 0) {
            obj.phone = key.phones[0].number
          }
          this.options.push({
            ...obj
          })

          if (this.value == key.id) {
            this.mutableLabel = key.name
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
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
      option.index = this.index
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
