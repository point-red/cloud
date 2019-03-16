<template>
  <div>
    <input type="text" class="form-control" @click="clickInput" readonly placeholder="Select" :value="mutableChoosen">
    <p-modal :ref="'select' + id" :id="'select' + id" :title="title">
      <template slot="content">
        <input type="text" class="form-control" v-model="search" placeholder="Search...">
        <hr>
        <div class="list-group push">
          <template v-for="(option, index) in options">
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
      </template>
      <template slot="footer">
        <button class="btn btn-primary">Add</button>
        <button type="button" @click="close()" class="btn btn-outline-danger">Close</button>
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
      mutableChoosen: this.choosen
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
    choosen: {
      type: String
    }
  },
  watch: {
    search: debounce(function (value) {
      this.$emit('search', value)
    }, 300),
    choosen: function (value) {
      this.mutableChoosen = value
    }
  },
  methods: {
    clickInput () {
      this.$refs['select'+this.id].show()
    },
    choose (option) {
      this.$emit('choosen', option)
      this.mutableChoosen = option.label
      this.close()
    },
    show () {
      this.$refs['select'+this.id].show()
    },
    close () {
      this.$refs['select'+this.id].close()
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
</style>
