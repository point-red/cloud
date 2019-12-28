<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || 'ACTIVE' | uppercase }}</span>
    <a href="javascript:void(0)" class="ml-5" @click="clear" v-show="mutableId == 1">
      <i class="clickable fa fa-close"></i>
    </a>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select status">
      <template slot="content">
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
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-outline-danger">Close</button>
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
      options: [
        { id: 0, label: 'active' },
        { id: 1, label: 'archived' }
      ],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
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
  methods: {
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option.label)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', '')
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
