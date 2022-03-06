<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select customer') | uppercase"
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
          <a
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
            ><i class="fa fa-home fa-fw" /> {{ option.address | uppercase }}</div>
            <div
              v-if="option.phone"
              style="font-size:11px"
            ><i class="fa fa-phone fa-fw" /> {{ option.phone | uppercase }}</div>
          </a>
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
          v-if="createButton"
          type="button"
          class="btn btn-sm btn-outline-secondary mr-5"
          @click="$refs.addCustomer.open()"
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

    <m-add-customer
      id="add-customer"
      ref="addCustomer"
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
    },
    createButton: {
      type: Boolean,
      default: true
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
    ...mapGetters('masterCustomer', ['customers', 'pagination'])
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
    ...mapActions('masterCustomer', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          includes: 'addresses;phones;emails;groups',
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
            pricing_group_id: key.pricing_group_id || 1,
            name: key.name,
            address: key.address,
            phone: key.phone,
            label: key.label,
            groups: key.groups
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
    choose (option) {
      option.index = this.index
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
    open (index = null) {
      this.index = index
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
