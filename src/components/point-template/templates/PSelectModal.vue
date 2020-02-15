<template>
  <div>
    <span @click="clickInput" class="link"><i class="fa fa-list mr-5"></i>{{ mutableChoosen || 'SELECT' || uppercase }}</span>
    <p-modal :ref="'select' + id" :id="'select' + id" :title="title">
      <template slot="content">
        <input type="text" class="form-control" v-model="search" placeholder="Search..." @keydown.enter.prevent="">
        <hr>
        <div class="list-group push">
          <template v-for="(option, index) in mutableOptions">
          <a
            :key="index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': isActive(option.id)}"
            @click="choose(option)"
            href="javascript:void(0)">
            {{ option.label }}
          </a>
          </template>
        </div>
        <div class="alert alert-info text-center" v-if="search && mutableOptions.length == 0">
          Pencarian "{{ search }}" tidak ditemukan! <br>
          klik <span class="link" @click="addData"><i class="fa fa-xs" :class="{
            'fa-refresh fa-spin': isLoadingAddButton,
            'fa-plus': !isLoadingAddButton
          }"></i> Add</span> untuk menambahkan data
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn-primary">Add</button>
        <button type="button" @click="close()" class="btn btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  data () {
    return {
      search: '',
      mutableChoosen: this.choosen,
      mutableOptions: this.options,
      isLoadingAddButton: false
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    options: {
      type: Array
    },
    title: {
      type: String,
      default: 'select'
    },
    value: {
      type: String
    },
    choosen: {
      type: String
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
