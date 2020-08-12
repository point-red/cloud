<template>
  <div>
    <span
      class="link"
      @click="clickInput"
    ><i class="fa fa-list mr-5" />{{ mutableChoosen || 'SELECT' || uppercase }}</span>
    <p-modal
      :id="'select' + id"
      :ref="'select' + id"
      :title="title"
    >
      <template slot="content">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search..."
          @keydown.enter.prevent=""
        >
        <hr>
        <div class="list-group push">
          <template v-for="(option, index) in mutableOptions">
            <a
              :key="index"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{'active': isActive(option.id)}"
              href="javascript:void(0)"
              @click="choose(option)"
            >
              {{ option.label }}
            </a>
          </template>
        </div>
        <div
          v-if="search && mutableOptions.length == 0"
          class="alert alert-info text-center"
        >
          Pencarian "{{ search }}" tidak ditemukan! <br>
          klik <span
            class="link"
            @click="addData"
          ><i
            class="fa fa-xs"
            :class="{
              'fa-refresh fa-spin': isLoadingAddButton,
              'fa-plus': !isLoadingAddButton
            }"
          /> Add</span> untuk menambahkan data
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn-primary">
          Add
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: 'select'
    },
    value: {
      type: String,
      default: ''
    },
    choosen: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      search: '',
      mutableChoosen: this.choosen,
      mutableOptions: this.options,
      isLoadingAddButton: false
    }
  },
  watch: {
    search: debounce(function (value) {
      this.$emit('search', value)
    }, 300),
    value: function (value) {
      this.mutableChoosen = value
    },
    options: function (options) {
      this.mutableOptions = options
      this.isLoadingAddButton = false
    }
  },
  methods: {
    clickInput () {
      this.$refs['select' + this.id].show()
    },
    addData () {
      if (this.isLoadingAddButton == false) {
        this.$emit('addData', this.search)
      }
      this.isLoadingAddButton = true
    },
    choose (option) {
      this.$emit('choosen', option)
      this.mutableChoosen = option.label
      this.close()
    },
    show () {
      this.$refs['select' + this.id].show()
    },
    close () {
      this.$refs['select' + this.id].close()
    },
    isActive (id) {
      return false
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
